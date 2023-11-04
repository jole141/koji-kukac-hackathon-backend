import { ParkingClusterModel } from '@models/parkingCluster.model';
import { customDataDateOffset } from '@utils/customDataDateOffset';
import { getParkingHourFromCurrentDate } from '@utils/getParkingHourFromCurrentDate';
import { DAYS_OF_WEEK } from '@/constants';

class ParkingOccupancyService {
  public parkingClusterCollection = ParkingClusterModel;

  public async storeParkingOccupancyData(): Promise<any> {
    const currentClusterOccupancy = await this.getCurrentClusterOccupancy();
    const offset = customDataDateOffset() % 7;
    const dayOfWeek = DAYS_OF_WEEK[offset];
    const hourOfDay = getParkingHourFromCurrentDate();
    for (const cluster of currentClusterOccupancy) {
      const newOccupancy = cluster.occupancy;

      if (hourOfDay >= 24) return;

      const currentOccupancy = cluster.occupancy.find(o => o.dayOfWeek === dayOfWeek);
      if (currentOccupancy) {
        const currentHourOccupancy = currentOccupancy.hours.find(h => h.hour === hourOfDay);
        if (currentHourOccupancy) {
          currentHourOccupancy.occupancy = cluster.occupancyPercentage;
        } else {
          currentOccupancy.hours.push({
            hour: hourOfDay,
            occupancy: cluster.occupancyPercentage,
          });
        }
      } else {
        newOccupancy.push({
          dayOfWeek,
          hours: [
            {
              hour: hourOfDay,
              occupancy: cluster.occupancyPercentage,
            },
          ],
        });
      }

      await this.parkingClusterCollection.findByIdAndUpdate(cluster._id, {
        occupancy: newOccupancy,
      });
    }
  }

  private async getCurrentClusterOccupancy(): Promise<any> {
    return this.parkingClusterCollection.aggregate([
      {
        $project: {
          _id: 1,
          parkingSpots: 1,
          occupancy: 1,
          occupiedCount: {
            $size: {
              $filter: {
                input: '$parkingSpots',
                as: 'spot',
                cond: '$$spot.occupied',
              },
            },
          },
          totalSpotCount: {
            $size: '$parkingSpots',
          },
        },
      },
      {
        $project: {
          _id: 1,
          occupancyPercentage: {
            $cond: {
              if: { $eq: ['$totalSpotCount', 0] },
              then: 0,
              else: { $multiply: [{ $divide: ['$occupiedCount', '$totalSpotCount'] }, 1] },
            },
          },
          occupancy: 1,
        },
      },
    ]);
  }
}

export default ParkingOccupancyService;

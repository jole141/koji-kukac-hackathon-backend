import { ParkingSpotModel } from '@models/parkingSpot.model';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';
import { haversine } from '@utils/util';
import { ObjectId } from 'mongodb';

class ParkingClusterService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public getParkingClusterById(id: string) {
    return this.parkingClusterCollection.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $unwind: '$parkingSpots',
      },
      {
        $group: {
          _id: '$_id',
          totalOccupied: { $sum: { $cond: { if: '$parkingSpots.occupied', then: 1, else: 0 } } },
          totalSpots: { $sum: 1 },
          hasAvailable: { $max: { $eq: ['$parkingSpots.occupied', false] } },
          longitude: { $first: '$longitude' },
          latitude: { $first: '$latitude' },
          name: { $first: '$name' },
          address: { $first: '$address' },
          parkingClusterZone: { $first: '$parkingClusterZone' },
          parkingSpots: { $push: '$parkingSpots' },
          occupancy: { $first: '$occupancy' },
        },
      },
      {
        $project: {
          _id: 1,
          occupancyPercentage: { $divide: ['$totalOccupied', '$totalSpots'] },
          available: '$hasAvailable',
          numOfAvailableSpots: { $subtract: ['$totalSpots', '$totalOccupied'] },
          longitude: 1,
          latitude: 1,
          name: 1,
          address: 1,
          parkingClusterZone: 1,
          parkingSpots: 1,
          occupancy: 1,
        },
      },
    ]);
  }

  public async getParkingClusters(): Promise<IParkingCluster[]> {
    return this.parkingClusterCollection.aggregate([
      {
        $unwind: '$parkingSpots',
      },
      {
        $group: {
          _id: '$_id',
          totalOccupied: { $sum: { $cond: { if: '$parkingSpots.occupied', then: 1, else: 0 } } },
          totalSpots: { $sum: 1 },
          hasAvailable: { $max: { $eq: ['$parkingSpots.occupied', false] } },
          longitude: { $first: '$longitude' },
          latitude: { $first: '$latitude' },
          name: { $first: '$name' },
          address: { $first: '$address' },
          parkingClusterZone: { $first: '$parkingClusterZone' },
        },
      },
      {
        $project: {
          _id: 1,
          occupancyPercentage: { $divide: ['$totalOccupied', '$totalSpots'] },
          available: '$hasAvailable',
          numOfAvailableSpots: { $subtract: ['$totalSpots', '$totalOccupied'] },
          longitude: 1,
          latitude: 1,
          name: 1,
          address: 1,
          parkingClusterZone: 1,
        },
      },
    ]);
  }

  public async initParkingClusters(): Promise<IParkingCluster[]> {
    const parkingSpots = await this.parkingSpotsCollection.find({});
    let parkingClustersNumber = 1;
    for (const parkingSpot of parkingSpots) {
      if (parkingSpot.cluster !== undefined) {
        continue;
      }
      // TODO: get address from google maps api
      const parkingCluster = {
        name: `Parking cluster ${parkingClustersNumber++}`,
        latitude: parkingSpot.latitude,
        longitude: parkingSpot.longitude,
        parkingClusterZone: parkingSpot.parkingSpotZone,
        parkingSpots: [parkingSpot],
        occupancy: [],
      };
      const savedParkingCluster = await this.parkingClusterCollection.create(parkingCluster);
      parkingSpot.cluster = savedParkingCluster._id;
      await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot._id, { cluster: savedParkingCluster._id });
      for (const parkingSpot1 of parkingSpots) {
        if (parkingSpot1.cluster !== undefined || parkingSpot._id === parkingSpot1._id) {
          continue;
        }
        if (this.isInCluster(parkingCluster, parkingSpot1)) {
          parkingSpot1.cluster = savedParkingCluster._id;
          await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot1._id, { cluster: savedParkingCluster._id });
          await this.parkingClusterCollection.findByIdAndUpdate(savedParkingCluster._id, {
            $push: { parkingSpots: parkingSpot1 },
          });
          await this.updateClusterCoordinates(savedParkingCluster._id);
        }
      }
    }

    return undefined;
  }

  public async updateClusterCoordinates(uuid: string) {
    let longitudeSum = 0;
    let latitudeSum = 0;
    let count = 0;
    const parkingCluster = await this.parkingClusterCollection.findOne({ uuid: uuid });
    parkingCluster.parkingSpots.forEach(parkingSpace => {
      longitudeSum += parkingSpace.longitude;
      latitudeSum += parkingSpace.latitude;
      count++;
    });
    parkingCluster.longitude = longitudeSum / count;
    parkingCluster.latitude = latitudeSum / count;
    await this.parkingClusterCollection.findByIdAndUpdate(parkingCluster._id, parkingCluster);
  }

  private isInCluster(ps1: any, ps2: any) {
    return haversine(ps1.latitude, ps1.longitude, ps2.latitude, ps2.longitude) < 50;
  }
}

export default ParkingClusterService;

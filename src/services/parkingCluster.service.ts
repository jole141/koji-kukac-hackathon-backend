import { ParkingSpotModel } from '@models/parkingSpot.model';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';

class ParkingClusterService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public async initParkingClusters(): Promise<IParkingCluster[]> {
    let parkingSpots = await this.parkingSpotsCollection.find({});

    for (let parkingSpot of parkingSpots) {
      if (parkingSpot.cluster !== undefined) {
        continue;
      }
      const parkingCluster = {
        latitude: parkingSpot.latitude,
        longitude: parkingSpot.longitude,
        parkingClusterZone: parkingSpot.parkingSpotZone,
        parkingSpots: [parkingSpot],
      };
      const savedParkingCluster = await this.parkingClusterCollection.create(parkingCluster);
      parkingSpot.cluster = savedParkingCluster._id;
      await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot._id, { cluster: savedParkingCluster._id });

      for (let parkingSpot1 of parkingSpots) {
        if (parkingSpot1.cluster !== undefined || parkingSpot._id === parkingSpot1._id) {
          continue;
        }
        if (this.isInCluster(parkingCluster, parkingSpot1)) {
          parkingSpot1.cluster = savedParkingCluster._id;
          await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot1._id, { cluster: savedParkingCluster._id });
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
    return Math.abs(ps1.latitude - ps2.latitude) * 111 < 50 && Math.abs(ps1.longitude - ps2.longitude) * 139 < 50;
  }
}

export default ParkingClusterService;

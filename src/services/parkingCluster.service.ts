import { ParkingSpotModel } from '@models/parkingSpot.model';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';

const { v4: uuidv4 } = require('uuid');

class ParkingClusterService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public async initParkingClusters(): Promise<IParkingCluster[]> {
    const parkingSpaces = await this.parkingSpotsCollection.find({});

    parkingSpaces.forEach(parkingSpace => {
      if (parkingSpace.cluster !== undefined) {
        return;
      }

      const uuid = uuidv4();
      const parkingCluster = {
        _id: uuid,
        latitude: parkingSpace.latitude,
        longitude: parkingSpace.longitude,
        parkingClusterZone: parkingSpace.parkingSpotZone,
        parkingSpots: [parkingSpace],
      };
      parkingSpace.cluster = parkingCluster;
      //this.parkingClusterCollection.create(parkingCluster);

      parkingSpaces.forEach(s => {
        if (s.cluster !== undefined) {
          return;
        }
        if (this.isInCluster(parkingSpace, s)) {
          parkingSpace.cluster = uuid;
          this.updateClusterCoordinates(uuid);
        }
      });
    });
    return undefined;
  }

  public async updateClusterCoordinates(uuid: any) {
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
    parkingCluster.save();
  }
  private isInCluster(ps1, ps2) {
    return Math.abs(ps1.latitude - ps2.latitude) * 111 < 50 && Math.abs(ps1.longitude - ps2.longitude) * 139 < 50;
  }
}

export default ParkingClusterService;

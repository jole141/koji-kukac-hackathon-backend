import { ParkingSpotModel } from '@models/parkingSpot.model';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { IParkingCluster } from '@interfaces/parkingCluster.interface';
import { haversine } from '@utils/util';
import { ParkingClusterCreateDto } from '@dtos/parkingClusterCreate.dto';
import { v4 as uuidv4 } from 'uuid';
class ParkingClusterService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public async getParkingClusters(): Promise<IParkingCluster[]> {
    return this.parkingClusterCollection.find();
  }

  public async initParkingClusters(): Promise<IParkingCluster[]> {
    const parkingSpots = await this.parkingSpotsCollection.find({});

    for (const parkingSpot of parkingSpots) {
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

  private isInCluster(parkingCluster: any, ps2: any) {
    if (parkingCluster.parkingClusterZone !== ps2.parkingSpotZone) {
      return false;
    }
    return haversine(parkingCluster.latitude, parkingCluster.longitude, ps2.latitude, ps2.longitude) < 50;
  }

  async createParkingCluster(parkingClusterCreateDto: ParkingClusterCreateDto) {
    const parkingSpots = [];
    for (let i = 0; i < parkingClusterCreateDto.numberOfParkingSpots; i++) {
      const parkingSpot = {
        _id: uuidv4(),
        latitude: parkingClusterCreateDto.latitude,
        longitude: parkingClusterCreateDto.longitude,
        parkingSpotZone: parkingClusterCreateDto.parkingClusterZone,
        occupied: false,
        occupiedTimestamp: null,
      };
      const savedParkingSpot = await this.parkingSpotsCollection.create(parkingSpot);
      console.log(savedParkingSpot);
      parkingSpots.push(savedParkingSpot);
    }

    const parkingCluster = {
      latitude: parkingClusterCreateDto.latitude,
      longitude: parkingClusterCreateDto.longitude,
      parkingClusterZone: parkingClusterCreateDto.parkingClusterZone,
      parkingSpots: parkingSpots,
    };

    return await this.parkingClusterCollection.create(parkingCluster);
  }

  async deleteParkingCluster(id: string) {
    const parkingCluster = await this.parkingClusterCollection.findById(id);
    for (const parkingSpot of parkingCluster.parkingSpots) {
      await this.parkingSpotsCollection.findByIdAndDelete(parkingSpot._id);
    }
    return this.parkingClusterCollection.findByIdAndDelete(id);
  }
}

export default ParkingClusterService;

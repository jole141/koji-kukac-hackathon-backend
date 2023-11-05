import { ParkingSpotModel } from '@models/parkingSpot.model';

import { IParkingSpot } from '@interfaces/parkingSpot.interface';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { ParkingSpotReserveDto } from '@dtos/parkingSpotReserve.dto';
import axios from 'axios';
import { SIMULATION_BACKEND_API_URL, SIMULATION_BACKEND_API_KEY } from '@config';
import { ParkingSpotCreateDto } from '@dtos/parkingSpotCreate.dto';

class ParkingSpotService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;

  public async getParkingSpots(): Promise<IParkingSpot[]> {
    return this.parkingSpotsCollection.find();
  }

  public async deleteParkingSpot(id: string) {
    const parkingSpot = await this.parkingSpotsCollection.findById(id);

    const url = new URL('./ParkingSpot/delete/' + id, SIMULATION_BACKEND_API_URL).toString();
    const res = await axios.delete(url, {
      headers: {
        accept: 'application/json',
        'Api-Key': SIMULATION_BACKEND_API_KEY,
      },
    });
    if (res.status !== 200) {
      return false;
    }
    return this.parkingSpotsCollection.findByIdAndDelete(parkingSpot._id);
  }

  async reserveParkingSpot(parkingSpotReserveDto: ParkingSpotReserveDto) {
    const parkingSpot = await this.parkingSpotsCollection.findById(parkingSpotReserveDto._id);
    if (parkingSpot.occupied) {
      return false;
    }

    const url = new URL('./ParkingSpot/reserve', SIMULATION_BACKEND_API_URL).toString();
    const res = await axios.post(
      url,
      {
        id: parkingSpot._id,
        h: parkingSpotReserveDto.h,
        m: parkingSpotReserveDto.m,
      },
      {
        headers: {
          accept: 'application/json',
          'Api-Key': SIMULATION_BACKEND_API_KEY,
        },
      },
    );

    if (res.status !== 200) {
      return false;
    }

    parkingSpot.occupied = true;
    parkingSpot.occupiedTimestamp = new Date().setHours(parkingSpotReserveDto.h, parkingSpotReserveDto.m, 0, 0).toString();

    return this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot._id, parkingSpot);
  }

  public async createParkingSpot(parkingSpotCreateDto: ParkingSpotCreateDto) {
    const url = new URL('./ParkingSpot', SIMULATION_BACKEND_API_URL).toString();
    const res = await axios.post(
      url,
      {
        latitude: parkingSpotCreateDto.latitude,
        longitude: parkingSpotCreateDto.longitude,
        parkingSpotZone: parkingSpotCreateDto.parkingSpotZone,
      },
      {
        headers: {
          accept: 'application/json',
          'Api-Key': SIMULATION_BACKEND_API_KEY,
        },
      },
    );
    if (res.status !== 200) {
      return false;
    }
    return this.parkingSpotsCollection.create({
      _id: res.data.id,
      latitude: res.data.latitude,
      longitude: res.data.longitude,
      parkingSpotZone: res.data.parkingSpotZone,
      occupied: res.data.occupied,
      occupiedTimestamp: res.data.occupiedTimestamp,
    });
  }
}

export default ParkingSpotService;

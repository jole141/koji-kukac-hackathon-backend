import { ParkingSpotModel } from '@models/parkingSpot.model';

import { IParkingSpot } from '@interfaces/parkingSpot.interface';
import { ParkingClusterModel } from '@models/parkingCluster.model';
import { ParkingSpotReserveDto } from '@dtos/parkingSpotReserve.dto';
import axios from 'axios';
import { SIMULATION_BACKEND_API_URL, SIMULATION_BACKEND_API_KEY } from '@config';
import { ParkingSpotCreateDto } from '@dtos/parkingSpotCreate.dto';
import { IUser } from '@interfaces/user.interface';
import { UserModel } from '@models/user.model';
import ParkingSimulationService from '@services/parkingSimulation.service';

class ParkingSpotService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingClusterCollection = ParkingClusterModel;
  public parkingSimulationService = new ParkingSimulationService();
  public userCollection = UserModel;

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

  async reserveParkingSpot(parkingSpotReserveDto: ParkingSpotReserveDto, user) {
    const currentHours = new Date().getHours();
    console.log(currentHours);
    const currentMinutes = new Date().getMinutes();
    console.log(currentMinutes);

    if (parkingSpotReserveDto.h < currentHours || (parkingSpotReserveDto.h === currentHours && parkingSpotReserveDto.m < currentMinutes)) {
      return false;
    }
    const count = parkingSpotReserveDto.h - currentHours;

    const parkingCluster = await this.parkingClusterCollection.findById(parkingSpotReserveDto._id);

    if (user.balance < count * parkingCluster.pricePerHour) {
      return false;
    }

    for (const parkingSpot of parkingCluster.parkingSpots) {
      if (!parkingSpot.occupied) {
        const requestBody = {
          _id: parkingSpot._id,
          isOccupied: true,
          time: `${parkingSpotReserveDto.h}:${parkingSpotReserveDto.m}`,
        };
        /*await this.userCollection.findByIdAndUpdate(user._id, {
          $inc: { balance: -count * parkingCluster.pricePerHour },
        });
        const url = new URL('./ParkingSpot/reserve', SIMULATION_BACKEND_API_URL).toString();
        console.log(url);
        const res = await axios.post(url, requestBody, {
          headers: {
            accept: 'application/json',
            'Api-Key': SIMULATION_BACKEND_API_KEY,
          },
        });

        if (res.status !== 200) {
          return false;
        }*/
        await this.parkingSimulationService.updateParkingSpot(requestBody);
        parkingSpot.occupied = true;
        parkingSpot.occupiedTimestamp = new Date().setHours(parkingSpotReserveDto.h, parkingSpotReserveDto.m, 0, 0).toString();

        return this.parkingSpotsCollection.findByIdAndUpdate(parkingSpot._id, parkingSpot);
      }
    }
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

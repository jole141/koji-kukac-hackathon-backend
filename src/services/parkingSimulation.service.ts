import { logger } from '@utils/logger';
import { ParkingSpotModel } from '@models/parkingSpot.model';
import { IParkingSpotSimulation } from '@interfaces/parkingSimulation.interface';
import { SIMULATION_BACKEND_API_URL, SIMULATION_BACKEND_API_KEY } from '@config';
import axios from 'axios';
import { ParkingSpotEventDto } from '@dtos/parkingSpotEvent.dto';
import { ParkingSimulationEventModel } from '@models/parkingSimulationEvent.model';
import { customDataDateOffset } from '@utils/customDataDateOffset';

class ParkingSimulationService {
  public parkingSpotsCollection = ParkingSpotModel;
  public parkingSimulationEventsCollection = ParkingSimulationEventModel;

  public async fetchAndSaveParkingSpots(): Promise<void> {
    try {
      const url = new URL('./ParkingSpot/getAll', SIMULATION_BACKEND_API_URL).toString();
      const res = await axios.get(url, {
        headers: {
          accept: 'application/json',
          'Api-Key': SIMULATION_BACKEND_API_KEY,
        },
      });

      const data = res.data;
      await this.parkingSpotsCollection.insertMany(
        data.map((spot: IParkingSpotSimulation) => {
          const { id, ...rest } = spot;
          return {
            _id: id,
            ...rest,
          };
        }),
        { ordered: false },
      );
    } catch (error) {
      logger.error('Error saving parking spots:', error);
    }
  }

  public async updateParkingSpot(parkingSpotEventDto: ParkingSpotEventDto): Promise<void> {
    try {
      await this.parkingSpotsCollection.findByIdAndUpdate(parkingSpotEventDto._id, {
        isOccupied: parkingSpotEventDto.isOccupied,
      });
      const eventTime = parkingSpotEventDto.time.split(':');
      const eventDate = new Date(2023, 0, 1, 1, 0, 0, 0);
      const offset = customDataDateOffset();
      eventDate.setDate(eventDate.getDate() + offset);
      eventDate.setHours(parseInt(eventTime[0], 10));
      eventDate.setMinutes(parseInt(eventTime[1], 10));
      // await this.parkingSimulationEventsCollection.create({
      //   parkingSpotId: parkingSpotEventDto._id,
      //   occupied: parkingSpotEventDto.isOccupied,
      //   timestamp: eventDate.toISOString(),
      // });
      logger.info(`Parking spot ${parkingSpotEventDto._id} updated, occupied: ${parkingSpotEventDto.isOccupied}`);
    } catch (error) {
      logger.error('Error updating parking spot:', error);
    }
  }
}

export default ParkingSimulationService;

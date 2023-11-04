import { logger } from '@utils/logger';
import ParkingOccupancyService from '@services/parkingOccupancy.service';

export const parkingOccupancyJob = async () => {
  try {
    const parkingOccupancyService = new ParkingOccupancyService();
    await parkingOccupancyService.storeParkingOccupancyData();
  } catch (e) {
    logger.error('Error in parkingOccupancyJob', e);
  }
};

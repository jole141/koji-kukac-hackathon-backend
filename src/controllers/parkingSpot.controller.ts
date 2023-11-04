import { NextFunction, Request, Response } from 'express';
import ParkingSpotService from '@services/parkingSpot.service';

class ParkingSpotController {
  public parkingSpotService = new ParkingSpotService();

  public getParkingSpots = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.parkingSpotService.getParkingSpots();
      if (!data) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default ParkingSpotController;

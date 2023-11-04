import { NextFunction, Request, Response } from 'express';
import ParkingClusterService from '@services/parkingCluster.service';

class ParkingClusterController {
  public parkingClusterService = new ParkingClusterService();

  public getParkingClusters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.parkingClusterService.getParkingClusters();
      if (!data) {
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getParkingClusterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data = await this.parkingClusterService.getParkingClusterById(id);
      if (!data) {
        res.status(404).json({ message: 'Parking cluster not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default ParkingClusterController;

import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ParkingClusterController from '@controllers/parkingCluster.controller';

class ParkingClusterRoute implements Routes {
  public path = '/parking-clusters';
  public router = Router();
  public parkingClusterController = new ParkingClusterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.parkingClusterController.getParkingClusters);
    this.router.post(`${this.path}`, this.parkingClusterController.createParkingCluster);
  }
}

export default ParkingClusterRoute;

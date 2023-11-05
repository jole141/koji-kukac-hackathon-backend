import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ParkingClusterController from '@controllers/parkingCluster.controller';
import validateAdminMiddleware from '@middlewares/validateAdmin.middleware';

class ParkingClusterRoute implements Routes {
  public path = '/parking-clusters';
  public router = Router();
  public parkingClusterController = new ParkingClusterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.parkingClusterController.getParkingClusters);
    this.router.get(`${this.path}/:id`, this.parkingClusterController.getParkingClusterById);
    this.router.post(`${this.path}`, validateAdminMiddleware, this.parkingClusterController.createParkingCluster);
    this.router.delete(`${this.path}/:id`, validateAdminMiddleware, this.parkingClusterController.deleteParkingCluster);
    this.router.patch(`${this.path}/:id`, validateAdminMiddleware, this.parkingClusterController.updateParkingClusterName);
    this.router.patch(
      `${this.path}/updateDynamicParameters/:id`,
      validateAdminMiddleware,
      this.parkingClusterController.updateDynamicPricingParameters,
    );
  }
}

export default ParkingClusterRoute;

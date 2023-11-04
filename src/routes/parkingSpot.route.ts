import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ParkingSpotController from '@controllers/parkingSpot.controller';

class ParkingSpotRoute implements Routes {
  public path = '/parking-spots';
  public router = Router();
  public parkingSpotController = new ParkingSpotController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.parkingSpotController.getParkingSpots);
  }
}

export default ParkingSpotRoute;

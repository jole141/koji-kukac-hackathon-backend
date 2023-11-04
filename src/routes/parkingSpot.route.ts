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
    this.router.delete(`${this.path}/:id`, this.parkingSpotController.deleteParkingSpot);
    this.router.post(`${this.path}/reserve`, this.parkingSpotController.reserveParkingSpot);
    this.router.post(`${this.path}`, this.parkingSpotController.createParkingSpot);
  }
}

export default ParkingSpotRoute;

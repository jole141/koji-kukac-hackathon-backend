import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import UserController from '@controllers/user.controller';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id`, this.userController.getUserById);
    this.router.post(`${this.path}/addCar/:id`, this.userController.addCar);
    this.router.post(`${this.path}/removeCar/:id`, this.userController.removeCar);
    this.router.post(`${this.path}/addBalance/:id`, this.userController.addBalance);
    this.router.post(`${this.path}/deductBalance/:id`, this.userController.deductBalance);
  }
}

export default UserRoute;

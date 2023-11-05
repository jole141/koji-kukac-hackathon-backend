import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import UserController from '@controllers/user.controller';
import bearerTokenValidationMiddleware from '@middlewares/bearerTokenValidation.middleware';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/addCar`, bearerTokenValidationMiddleware, this.userController.addCar);
    this.router.post(`${this.path}/addBalance`, bearerTokenValidationMiddleware, this.userController.addBalance);
  }
}

export default UserRoute;

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
    this.router.get(`${this.path}/:id`, bearerTokenValidationMiddleware, this.userController.getUserById);
    this.router.post(`${this.path}/addCar/:id`, bearerTokenValidationMiddleware, this.userController.addCar);
    this.router.post(`${this.path}/removeCar/:id`, bearerTokenValidationMiddleware, this.userController.removeCar);
    this.router.post(`${this.path}/addBalance/:id`, bearerTokenValidationMiddleware, this.userController.addBalance);
    this.router.post(`${this.path}/deductBalance/:id`, bearerTokenValidationMiddleware, this.userController.deductBalance);
  }
}

export default UserRoute;

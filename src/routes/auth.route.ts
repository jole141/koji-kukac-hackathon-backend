import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import AuthController from '@controllers/auth.controller';
import bearerTokenValidationMiddleware from '@middlewares/bearerTokenValidation.middleware';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/adminLogin`, this.authController.adminLogin);
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/adminRegister`, this.authController.adminRegister);
    this.router.get(`${this.path}/whoAmI`, bearerTokenValidationMiddleware, this.authController.whoAmI);
  }
}

export default AuthRoute;

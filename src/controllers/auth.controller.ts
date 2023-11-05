import { NextFunction, Request, Response } from 'express';
import AuthService from '@services/auth.service';
import { UserRegisterDto } from '@dtos/userRegister.dto';
import { UserLoginDto } from '@dtos/userLogin.dto';

class AuthController {
  public authService = new AuthService();

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorizationToken = await this.authService.login(req.body as UserLoginDto);
      res.status(200).json(authorizationToken);
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRegisterDto = req.body as UserRegisterDto;
      const registerResponse = await this.authService.register(userRegisterDto);
      if (registerResponse) {
        res.status(201).json({ message: 'User created' });
      } else {
        res.status(500).json({ message: 'User not created' });
      }
    } catch (error) {
      next(error);
    }
  };

  public adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorizationToken = await this.authService.adminLogin(req.body as UserLoginDto);
      res.status(200).json(authorizationToken);
    } catch (error) {
      next(error);
    }
  };

  public adminRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userRegisterDto = req.body as UserRegisterDto;
      const registerResponse = await this.authService.adminRegister(userRegisterDto);
      if (registerResponse) {
        res.status(201).json({ message: 'Admin created' });
      } else {
        res.status(500).json({ message: 'Admin not created' });
      }
    } catch (error) {
      next(error);
    }
  };

  public whoAmI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const data = await this.authService.whoAmI(token);
      if (!data) {
        res.status(401).json('Unauthorized');
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;

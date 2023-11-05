import UserService from '@services/user.service';
import { NextFunction, Request, Response } from 'express';
import { CarCreateDto } from '@dtos/carCreate.dto';
import { CarDeleteDto } from '@dtos/carDelete.dto';
import { BalanceDto } from '@dtos/balance.dto';

class UserController {
  public userService = new UserService();

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const data = await this.userService.getUserById(id);
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  addCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const car = req.body as CarCreateDto;
      const data = await this.userService.addCar(id, car);
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  removeCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const car = req.body as CarDeleteDto;
      const data = await this.userService.removeCar(id, car);
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
  addBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const balance = req.body.balance as BalanceDto;
      const data = await this.userService.addBalance(id, balance);
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  deductBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      const balance = req.body.balance as BalanceDto;
      const data = await this.userService.deductBalance(id, balance);
      if (!data) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

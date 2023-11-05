import UserService from '@services/user.service';
import { NextFunction, Request, Response } from 'express';
import { CarCreateDto } from '@dtos/carCreate.dto';
import { BalanceDto } from '@dtos/balance.dto';
import AuthService from '@services/auth.service';

class UserController {
  public userService = new UserService();
  public authService = new AuthService();

  // TODO: edit, delete car
  public addCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const user = await this.authService.whoAmI(token);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const car = req.body as CarCreateDto;
      const data = await this.userService.addCar(user._id, car);
      if (!data) {
        res.status(404).json({ message: 'Car not added' });
        return;
      }
      res.status(200).json({ message: 'Car added' });
    } catch (error) {
      next(error);
    }
  };

  addBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const balance = req.body as BalanceDto;
      const token = req.headers.authorization?.split(' ')[1];
      const user = await this.authService.whoAmI(token);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const data = await this.userService.addBalance(user._id, balance);
      if (!data) {
        res.status(404).json({ message: 'Balance update error' });
        return;
      }
      res.status(200).json({ message: 'Balance updated' });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;

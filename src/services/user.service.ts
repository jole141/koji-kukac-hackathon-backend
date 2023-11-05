import { IUser } from '@interfaces/user.interface';
import { UserModel } from '@models/user.model';
import { BalanceDto } from '@dtos/balance.dto';
import { CarCreateDto } from '@dtos/carCreate.dto';
import { logger } from '@utils/logger';

class UserService {
  public userCollection = UserModel;

  public async getUserById(userId: string): Promise<IUser> {
    try {
      return await this.userCollection.findById(userId);
    } catch (error) {
      throw error;
    }
  }

  public async addBalance(id: string, balance: BalanceDto) {
    try {
      await this.userCollection.findByIdAndUpdate(id, {
        $inc: { balance: balance.balance },
      });
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  public async deductBalance(id: string, balance: BalanceDto) {
    try {
      const user = await this.userCollection.findById(id);
      if (!user) {
        return null;
      }
      if (user.balance < balance.balance) {
        return null;
      }
      user.balance -= balance.balance;
      return this.userCollection.findByIdAndUpdate(id, user);
    } catch (error) {
      throw error;
    }
  }

  async addCar(id: string, carCreateDto: CarCreateDto) {
    try {
      const user = await this.userCollection.findById(id);
      if (!user) {
        return false;
      }
      await this.userCollection.findByIdAndUpdate(id, {
        $push: { cars: carCreateDto },
      });
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default UserService;

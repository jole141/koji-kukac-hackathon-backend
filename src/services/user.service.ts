import { CarType, IUser } from '@interfaces/user.interface';
import { UserModel } from '@models/user.model';
import { BalanceDto } from '@dtos/balance.dto';
import { CarDeleteDto } from '@dtos/carDelete.dto';
import { CarCreateDto } from '@dtos/carCreate.dto';

class UserService {
  public userCollection = UserModel;

  public async getUserById(userId: string): Promise<IUser> {
    try {
      return await this.userCollection.findById(userId);
    } catch (error) {
      throw error;
    }
  }

  async addBalance(id: string, balance: BalanceDto) {
    try {
      const user = await this.userCollection.findById(id);
      if (!user) {
        return null;
      }
      user.balance += balance.balance;
      return this.userCollection.findByIdAndUpdate(id, user);
    } catch (error) {
      throw error;
    }
  }

  async deductBalance(id: string, balance: BalanceDto) {
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

  async removeCar(id: string, car: CarDeleteDto) {
    try {
      const user = await this.userCollection.findById(id);
      if (!user) {
        return null;
      }
      user.cars = user.cars.filter(c => c.licensePlate !== car.licensePlate);
      return this.userCollection.findByIdAndUpdate(id, user);
    } catch (error) {
      throw error;
    }
  }

  async addCar(id: string, carCreateDto: CarCreateDto) {
    const car = {
      licensePlate: carCreateDto.licensePlate,
      brand: carCreateDto.brand,
      model: carCreateDto.model,
      type: CarType[carCreateDto.type],
    };
    try {
      const user = await this.userCollection.findById(id);
      if (!user) {
        return null;
      }
      user.cars.push(car);
      return this.userCollection.findByIdAndUpdate(id, user);
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;

import { UserRegisterDto } from '@dtos/userRegister.dto';
import { UserModel } from '@models/user.model';
import bcrypt from 'bcrypt';
import { logger } from '@utils/logger';
import { UserLoginDto } from '@dtos/userLogin.dto';
import { IAuthorizationToken } from '@interfaces/auth.interface';
import { JWT_SECRET, JWT_SECRET_ADMIN } from '@config';
import jwt from 'jsonwebtoken';
import { AdminUserModel } from '@models/adminUser.model';

class AuthService {
  public userCollection = UserModel;
  public adminUserCollection = AdminUserModel;

  public login = async (loginDto: UserLoginDto): Promise<IAuthorizationToken> => {
    const { username, password } = loginDto;
    const user = await this.userCollection.findOne({ username });
    if (!user) throw new Error('Invalid credentials');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');
    return {
      token: jwt.sign({ user }, JWT_SECRET, { expiresIn: '24h' }),
    };
  };

  public register = async (registerDto: UserRegisterDto): Promise<boolean> => {
    try {
      const { password, ...rest } = registerDto;
      const hashedPassword = await this.hashPassword(password);

      await this.userCollection.create({ ...rest, password: hashedPassword });
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  };

  public adminLogin = async (loginDto: UserLoginDto): Promise<IAuthorizationToken> => {
    const { username, password } = loginDto;
    const user = await this.adminUserCollection.findOne({ username });
    if (!user) throw new Error('Invalid credentials');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');
    return {
      token: jwt.sign({ user }, JWT_SECRET_ADMIN, { expiresIn: '24h' }),
    };
  };

  public adminRegister = async (registerDto: UserRegisterDto): Promise<boolean> => {
    try {
      const { password, ...rest } = registerDto;
      const hashedPassword = await this.hashPassword(password);

      await this.adminUserCollection.create({ ...rest, password: hashedPassword });
      return true;
    } catch (error) {
      logger.error(error);
      return false;
    }
  };

  public whoAmI = async (token: string): Promise<any> => {
    try {
      const { user } = jwt.verify(token, JWT_SECRET) as any;
      return await this.userCollection.findOne({ username: user.username }, { password: 0, __v: 0 });
    } catch (error) {
      logger.error(error);
    }
  };

  private hashPassword = async (password: string): Promise<string> => {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      logger.error(error);
    }
  };
}

export default AuthService;

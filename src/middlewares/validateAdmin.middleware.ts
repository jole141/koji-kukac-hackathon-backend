import { Response, NextFunction, RequestHandler, Request } from 'express';
import { JWT_SECRET_ADMIN } from '@/config';
import jwt from 'jsonwebtoken';

const validateAdminMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization?.split(' ')[1];
  if (!bearerToken) {
    res.status(401).json({ message: 'No bearer token provided' });
    return;
  }
  try {
    jwt.verify(bearerToken, JWT_SECRET_ADMIN);
  } catch (error) {
    res.status(403).json({ message: 'Invalid bearer token' });
    return;
  }
  next();
};

export default validateAdminMiddleware;

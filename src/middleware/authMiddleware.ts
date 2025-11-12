
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { RequestWithTenant } from './tenantMiddleware';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authMiddleware = async (req: RequestWithTenant, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found, authorization denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

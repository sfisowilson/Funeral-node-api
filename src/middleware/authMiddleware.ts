
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
    
    // Set tenantId and tenantDomain from the JWT token (authenticated user)
    // This overrides any X-Tenant-ID header for authenticated requests
    (req as any).tenantId = decoded.tenantId || user.tenantId;
    
    // Optionally load the full tenant object if needed
    if (!req.tenant && decoded.tenantId) {
      const Tenant = (await import('../models/tenant')).default;
      const tenant = await Tenant.findByPk(decoded.tenantId);
      if (tenant) {
        req.tenant = tenant;
        (req as any).tenantDomain = tenant.domain;
        console.log(`  ✅ Tenant from JWT: ${tenant.domain} (${tenant.id})`);
      }
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

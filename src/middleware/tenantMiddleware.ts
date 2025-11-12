
import { Request, Response, NextFunction } from 'express';
import { getTenantByDomain } from '../services/tenantService';
import { baseDomain } from '../config/config';
import Tenant from '../models/tenant';
import User from '../models/user';

export interface RequestWithTenant extends Request {
  tenant?: Tenant;
  user?: User;
}

export const tenantMiddleware = async (req: RequestWithTenant, res: Response, next: NextFunction) => {
  let tenantDomain = req.headers['x-tenant-id'] as string;

  if (!tenantDomain) {
    tenantDomain = req.query['X-Tenant-ID'] as string;
  }

  console.log(`🔍 TenantMiddleware: hostname=${req.hostname}, x-tenant-id header=${req.headers['x-tenant-id']}, X-Tenant-ID query=${req.query['X-Tenant-ID']}`);

  if (!tenantDomain) {
    const host = req.hostname;
    if (host.endsWith(baseDomain)) {
      const subdomain = host.substring(0, host.length - baseDomain.length).slice(0, -1);
      if (subdomain) {
        tenantDomain = subdomain;
        console.log(`  ➜ Resolved from subdomain: ${tenantDomain}`);
      }
    }
    // For localhost development, default to 'host' tenant
    else if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('localhost:') || host.startsWith('127.0.0.1:')) {
      tenantDomain = 'host';
      console.log(`  ➜ Localhost detected, using default 'host' tenant`);
    }
  } else {
    console.log(`  ➜ Using tenantDomain from headers/query: ${tenantDomain}`);
  }

  if (tenantDomain) {
    const tenant = await getTenantByDomain(tenantDomain);
    if (tenant) {
      req.tenant = tenant;
      console.log(`  ✅ Tenant resolved: ${tenant.domain} (${tenant.id})`);
    } else {
      console.error(`  ❌ Tenant not found: ${tenantDomain}`);
      res.status(404).send('Tenant not found');
      return;
    }
  }

  next();
};

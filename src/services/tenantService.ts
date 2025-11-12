
import { Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import Tenant from '../models/tenant';


export const registerTenant = async (req: RequestWithTenant, res: Response) => {
  try {
    const { name, domain, adminEmail, adminPassword, adminFirstName, adminLastName } = req.body;
    if (!name || !domain) {
      return res.status(400).json({ message: 'Missing name or domain' });
    }
    const existing = await Tenant.findOne({ where: { domain } });
    if (existing) {
      return res.status(409).json({ message: 'Domain already in use' });
    }
    // Create tenant
    const tenant = await Tenant.create({ name, domain });

    // Create default TenantSetting if not exist
    const tenantSettingService = require('./tenantSettingService').default;
    const existingSetting = await tenantSettingService.getCurrentTenantSettings(tenant.id);
    if (!existingSetting) {
      await tenantSettingService.createTenantSetting({
        settings: '{}',
        tenantId: tenant.id,
        tenantName: name
      });
    }

    // Create default Role if not exist
    const Role = require('../models/role').default;
    let adminRole = await Role.findOne({ where: { name: 'TenantAdmin', tenantId: tenant.id } });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'TenantAdmin', tenantId: tenant.id });
    }

    // Create default Permission if not exist
    const Permission = require('../models/permission').default;
    let adminPermission = await Permission.findOne({ where: { name: 'ViewDashboard', tenantId: tenant.id } });
    if (!adminPermission) {
      adminPermission = await Permission.create({ name: 'ViewDashboard', tenantId: tenant.id });
    }
    // Associate permission to role via RolePermission join table
    const RolePermission = require('../models/rolePermission').default;
    const existingAssociation = await RolePermission.findOne({ where: { roleId: adminRole.id, permissionId: adminPermission.id } });
    if (!existingAssociation) {
      await RolePermission.create({ roleId: adminRole.id, permissionId: adminPermission.id });
    }

    // Create default User if not exist
    const User = require('../models/user').default;
    let adminUser;
    if (adminEmail && adminPassword) {
      adminUser = await User.findOne({ where: { email: adminEmail, tenantId: tenant.id } });
      if (!adminUser) {
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        adminUser = await User.create({
          email: adminEmail,
          passwordHash: hashedPassword,
          firstName: adminFirstName || 'Admin',
          lastName: adminLastName || 'User',
          tenantId: tenant.id
        });
      }
    }

    res.status(201).json({ tenant, adminRole, adminPermission, adminUser });
  } catch (error) {
    console.error('Error registering tenant:', error);
    res.status(500).json({ message: 'An error occurred while registering tenant', error });
  }
};

export const getTenantById = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing tenant id' });
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    console.error('Error getting tenant by id:', error);
    res.status(500).json({ message: 'An error occurred while retrieving tenant' });
  }
};

export const getAllTenants = async (req: RequestWithTenant, res: Response) => {
  try {
    const tenants = await Tenant.findAll();
    res.json(tenants);
  } catch (error) {
    console.error('Error getting all tenants:', error);
    res.status(500).json({ message: 'An error occurred while retrieving tenants' });
  }
};

export const updateTenant = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    const { name, domain } = req.body;
    if (!id) return res.status(400).json({ message: 'Missing tenant id' });
    const tenant = await Tenant.findByPk(id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    if (name) tenant.name = name;
    if (domain) tenant.domain = domain;
    await tenant.save();
    res.json(tenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ message: 'An error occurred while updating tenant' });
  }
};

export const deleteTenant = async (req: RequestWithTenant, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Missing tenant id' });
    const deleted = await Tenant.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Tenant not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ message: 'An error occurred while deleting tenant' });
  }
};

export const getTenantByDomain = async (domain: string) => {
  try {
    const tenant = await Tenant.findOne({ where: { domain } });
    return tenant;
  } catch (error) {
    console.error('Error getting tenant by domain:', error);
    return null;
  }
};

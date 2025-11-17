import { Request, Response } from 'express';
import Permission from '../models/permission';
import { Op } from 'sequelize';

export const getAllPermissions = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const tenantDomain = (req as any).tenantDomain;

    let permissions;

    if (tenantDomain === 'host') {
      // Host tenant gets all permissions
      permissions = await Permission.findAll({
        order: [['name', 'ASC']]
      });
      console.log(`✅ Retrieved ${permissions.length} permissions for host tenant`);
    } else {
      // Regular tenants don't get tenant/subscription management permissions
      permissions = await Permission.findAll({
        where: {
          name: {
            [Op.and]: [
              { [Op.notLike]: 'Permission.tenant.%' },
              { [Op.notLike]: 'Permission.subscription.%' }
            ]
          }
        },
        order: [['name', 'ASC']]
      });
      console.log(`✅ Retrieved ${permissions.length} permissions for tenant ${tenantId}`);
    }

    res.json(permissions);
  } catch (error) {
    console.error('Error getting permissions:', error);
    res.status(500).json({ error: 'An error occurred while fetching permissions' });
  }
};

export const createPermission = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Permission name is required' });
    }

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const newPermission = await Permission.create({
      name,
      tenantId
    });

    console.log(`✅ Permission ${name} (ID: ${newPermission.id}) created for tenant ${tenantId}`);
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'An error occurred while creating the permission' });
  }
};

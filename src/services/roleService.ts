import { Request, Response } from 'express';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/rolePermission';

// Set up associations
Role.hasMany(RolePermission, {
  foreignKey: 'roleId',
  as: 'rolePermissions'
});

RolePermission.belongsTo(Permission, {
  foreignKey: 'permissionId',
  as: 'permission'
});

export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const roles = await Role.findAll({
      where: { tenantId },
      include: [{
        model: RolePermission,
        as: 'rolePermissions',
        include: [{
          model: Permission,
          as: 'permission',
          attributes: ['id', 'name']
        }]
      }],
      order: [['name', 'ASC']]
    });

    // Transform to match C# DTO structure
    const roleDtos = roles.map(role => {
      const roleData = role.toJSON() as any;
      return {
        id: roleData.id,
        name: roleData.name,
        permissions: roleData.rolePermissions?.map((rp: any) => ({
          id: rp.permission.id,
          name: rp.permission.name
        })) || []
      };
    });

    console.log(`✅ Retrieved ${roleDtos.length} roles for tenant ${tenantId}`);
    res.json(roleDtos);
  } catch (error) {
    console.error('Error getting roles:', error);
    res.status(500).json({ error: 'An error occurred while fetching roles' });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const newRole = await Role.create({
      name,
      tenantId,
      createdBy: (req as any).userId || null,
      updatedBy: (req as any).userId || null,
      isDeleted: false
    });

    // Return the role in the same format as C# API (with all fields)
    const roleResponse = {
      id: newRole.id,
      tenantId: newRole.tenantId,
      name: newRole.name,
      createdAt: newRole.createdAt,
      updatedAt: newRole.updatedAt,
      createdBy: newRole.createdBy || '00000000-0000-0000-0000-000000000000',
      updatedBy: newRole.updatedBy || '00000000-0000-0000-0000-000000000000',
      isDeleted: false,
      rolePermissions: []
    };

    console.log(`✅ Role ${name} (ID: ${newRole.id}) created for tenant ${tenantId}`);
    res.status(201).json(roleResponse);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'An error occurred while creating the role' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const tenantId = (req as any).tenantId;
    const { id, name } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    const role = await Role.findOne({
      where: { id, tenantId }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    role.name = name;
    role.updatedBy = (req as any).userId || null;
    await role.save();

    // Reload with permissions
    const updatedRole = await Role.findOne({
      where: { id, tenantId },
      include: [{
        model: RolePermission,
        as: 'rolePermissions',
        include: [{
          model: Permission,
          as: 'permission',
          attributes: ['id', 'name']
        }]
      }]
    });

    const roleData = updatedRole?.toJSON() as any;
    const roleDto = {
      id: roleData.id,
      name: roleData.name,
      permissions: roleData.rolePermissions?.map((rp: any) => ({
        id: rp.permission.id,
        name: rp.permission.name
      })) || []
    };

    console.log(`✅ Role ${name} (ID: ${id}) updated for tenant ${tenantId}`);
    res.json(roleDto);
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'An error occurred while updating the role' });
  }
};

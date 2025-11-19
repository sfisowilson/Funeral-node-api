
import { Request, Response } from 'express';
import { RequestWithTenant } from '../middleware/tenantMiddleware';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import Tenant from '../models/tenant';
import Role from '../models/role';
import Permission from '../models/permission';
import RolePermission from '../models/rolePermission';
import UserRole from '../models/userRole';
import TenantSetting from '../models/tenantSetting';
import RefreshToken from '../models/refreshToken';
import PasswordResetCode from '../models/passwordResetCode';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerTenant = async (req: Request, res: Response) => {
  try {
    const { name, email, password, domain, address, phone1, phone2, registrationNumber, type, subscriptionPlanId } = req.body;

    // Validation
    if (!name || !email || !password || !domain) {
      return res.status(400).json({ error: 'Name, email, password, and domain are required' });
    }

    // Check if tenant with same domain already exists
    const existingTenant = await Tenant.findOne({ where: { domain } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Tenant with this domain already exists' });
    }

    // Check if user with same email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create new tenant
    const tenant = await Tenant.create({
      name,
      domain,
      email,
      address: address || null,
      phone1: phone1 || null,
      phone2: phone2 || null,
      registrationNumber: registrationNumber || null,
      type: type || 'Standard',
      subscriptionPlanId: subscriptionPlanId || null,
      createdBy: '00000000-0000-0000-0000-000000000000', // System creator
      updatedBy: '00000000-0000-0000-0000-000000000000',
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Registering tenant: email=${email}, hashedPassword length=${hashedPassword.length}`);

    // Create admin user for the new tenant
    const adminUser = await User.create({
      email,
      passwordHash: hashedPassword,
      tenantId: tenant.id,
      mustChangePassword: false,
      createdBy: '00000000-0000-0000-0000-000000000000',
      updatedBy: '00000000-0000-0000-0000-000000000000',
    });
    console.log(`Admin user created: id=${adminUser.id}, email=${adminUser.email}, tenantId=${adminUser.tenantId}`);

    // Create 'Admin' role for the new tenant
    const adminRole = await Role.create({
      name: 'Admin',
      tenantId: tenant.id,
      createdBy: '00000000-0000-0000-0000-000000000000',
      updatedBy: '00000000-0000-0000-0000-000000000000',
    });

    // Assign admin role to the admin user
    await UserRole.create({
      userId: adminUser.id,
      roleId: adminRole.id,
    });

    // Define user management permissions
    const userManagementPermissions = [
      'Permission.user.create',
      'Permission.user.view',
      'Permission.user.update',
      'Permission.user.delete',
      'Permission.role.create',
      'Permission.role.view',
      'Permission.role.update',
      'Permission.role.delete',
      'Permission.rolepermission.create',
      'Permission.rolepermission.view',
      'Permission.rolepermission.update',
      'Permission.rolepermission.delete',
      'Permission.Admin.update'
    ];

    // Create permissions and assign to admin role
    for (const permName of userManagementPermissions) {
      const permission = await Permission.findOne({
        where: { name: permName, tenantId: tenant.id },
      });

      let permissionToUse = permission;
      if (!permissionToUse) {
        permissionToUse = await Permission.create({
          name: permName,
          tenantId: tenant.id,
          createdBy: '00000000-0000-0000-0000-000000000000',
          updatedBy: '00000000-0000-0000-0000-000000000000',
        });
      }

      // Assign permission to admin role
      const rolePermission = await RolePermission.findOne({
        where: { roleId: adminRole.id, permissionId: permissionToUse.id },
      });
      if (!rolePermission) {
        await RolePermission.create({
          roleId: adminRole.id,
          permissionId: permissionToUse.id,
        });
      }
    }

    // Create tenant settings
    await TenantSetting.create({
      tenantId: tenant.id,
      settings: JSON.stringify({ tenantName: tenant.name }),
    });

    // Reload CORS origins to include the new tenant
    try {
      const app = require('../index');
      if (app.loadTenantDomainsForCors) {
        await app.loadTenantDomainsForCors();
        console.log(`CORS origins reloaded after tenant registration: ${tenant.domain}`);
      }
    } catch (error) {
      console.warn('Failed to reload CORS origins:', error);
    }

    res.status(200).json(true);
  } catch (error: any) {
    console.error('Error registering tenant:', error);
    res.status(500).json({ error: 'Error registering tenant', details: error.message });
  }
};

export const register = async (req: RequestWithTenant, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!req.tenant) {
      return res.status(401).json({ error: 'Invalid tenant' });
    }

    // Check if email already exists within this tenant
    const existingUser = await User.findOne({ 
      where: { email, tenantId: req.tenant.id } 
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists in your organization' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user scoped to tenant
    const user = await User.create({ 
      email, 
      passwordHash: hashedPassword, 
      firstName: firstName || '', 
      lastName: lastName || '',
      tenantId: req.tenant.id,
      mustChangePassword: false
    });
    
    res.status(201).json(true);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

export const testIdentity = async (req: Request, res: Response) => { res.status(501).send('Not Implemented'); };

export const debugClaims = async (req: Request, res: Response) => { res.status(501).send('Not Implemented'); };

export const login = async (req: RequestWithTenant, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!req.tenant) {
      return res.status(401).json({ error: 'Invalid tenant' });
    }

    // Find user by email AND tenantId to ensure tenant isolation
    const user = await User.findOne({ 
      where: { email, tenantId: req.tenant.id } 
    });

    if (!user) {
      console.error(`User not found: email=${email}, tenantId=${req.tenant.id}`);
      return res.status(401).json({ error: 'Invalid credentials for your organization' });
    }

    if (!user.passwordHash) {
      console.error(`User has no password hash: email=${email}, userId=${user.id}`);
      return res.status(401).json({ error: 'Invalid credentials for your organization' });
    }

    // Verify password
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    } catch (bcryptError) {
      console.error('Bcrypt comparison error:', bcryptError);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`Login attempt: email=${email}, passwordValid=${isPasswordValid}, mustChangePassword=${user.mustChangePassword}`);
    
    if (!isPasswordValid) {
      console.error(`Invalid password for user: email=${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get user's roles for this tenant via UserRole table
    const userRoles = await UserRole.findAll({ 
      where: { userId: user.id }
    });

    // Get role names from the role IDs
    const roleIds = userRoles.map(ur => ur.roleId);
    const roles: any[] = [];
    if (roleIds.length > 0) {
      const roleRecords = await Role.findAll({
        where: { id: roleIds }
      });
      roles.push(...roleRecords.map(r => r.name));
    }
    
    // Get permissions for user's roles within this tenant
    const permissions: string[] = [];
    if (roleIds.length > 0) {
      const rolePermissions = await RolePermission.findAll({
        where: { roleId: roleIds }
      });
      
      const permIds = rolePermissions.map(rp => rp.permissionId);
      if (permIds.length > 0) {
        const permRecords = await Permission.findAll({
          where: { id: permIds, tenantId: req.tenant.id }
        });
        permissions.push(...permRecords.map(p => p.name));
      }
    }

    // Generate JWT token with tenant context
    const expiresInSeconds = 3600; // 1 hour
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        tenantId: user.tenantId,
        roles,
        permissions
      }, 
      JWT_SECRET, 
      { expiresIn: expiresInSeconds }
    );

    // Create refresh token
    const refreshTokenString = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);

    const refreshTokenRecord = await RefreshToken.create({
      userId: user.id,
      token: refreshTokenString,
      expiresAt: refreshTokenExpires,
      createdAt: new Date()
    });

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    res.json({ 
      token, 
      refreshToken: refreshTokenRecord.token,
      expiresAt: expiresAt.toISOString(),
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        tenantId: user.tenantId 
      },
      mustChangePassword: user.mustChangePassword || false
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Find the refresh token in the database
    const storedRefreshToken = await RefreshToken.findOne({
      where: { token: refreshToken }
    });

    if (!storedRefreshToken) {
      console.warn(`Refresh token not found: ${refreshToken.substring(0, 20)}...`);
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Check if token is revoked
    if (storedRefreshToken.isRevoked) {
      console.warn(`Attempt to use revoked refresh token for user ${storedRefreshToken.userId}`);
      return res.status(401).json({ error: 'Refresh token has been revoked' });
    }

    // Check if token is expired
    if (storedRefreshToken.isExpired) {
      console.warn(`Attempt to use expired refresh token for user ${storedRefreshToken.userId}`);
      return res.status(401).json({ error: 'Refresh token has expired' });
    }

    // Find user and load roles/permissions
    const user = await User.findByPk(storedRefreshToken.userId);
    if (!user) {
      console.error(`User not found for refresh token: ${storedRefreshToken.userId}`);
      return res.status(401).json({ error: 'User not found' });
    }

    // Get user's roles
    const userRoles = await UserRole.findAll({
      where: { userId: user.id }
    });

    const roleIds = userRoles.map(ur => ur.roleId);
    const roles: string[] = [];
    if (roleIds.length > 0) {
      const roleRecords = await Role.findAll({
        where: { id: roleIds }
      });
      roles.push(...roleRecords.map(r => r.name));
    }

    // Get permissions for user's roles
    const permissions: string[] = [];
    if (roleIds.length > 0) {
      const rolePermissions = await RolePermission.findAll({
        where: { roleId: roleIds }
      });

      const permIds = rolePermissions.map(rp => rp.permissionId);
      if (permIds.length > 0) {
        const permRecords = await Permission.findAll({
          where: { id: permIds, tenantId: user.tenantId }
        });
        permissions.push(...permRecords.map(p => p.name));
      }
    }

    // Mark old refresh token as replaced
    storedRefreshToken.revokedAt = new Date();
    storedRefreshToken.replacedByToken = 'rotated';
    await storedRefreshToken.save();

    // Generate new JWT token
    const expiresInSeconds = 3600; // 1 hour
    const newJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
        roles,
        permissions
      },
      JWT_SECRET,
      { expiresIn: expiresInSeconds }
    );

    // Create new refresh token
    const newRefreshTokenString = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const newRefreshTokenExpires = new Date();
    newRefreshTokenExpires.setDate(newRefreshTokenExpires.getDate() + 7);

    const newRefreshTokenRecord = await RefreshToken.create({
      userId: user.id,
      token: newRefreshTokenString,
      expiresAt: newRefreshTokenExpires,
      createdAt: new Date()
    });

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresInSeconds);

    res.json({
      token: newJwt,
      refreshToken: newRefreshTokenRecord.token,
      expiresAt: expiresAt.toISOString()
    });
  } catch (error: any) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Error refreshing token', details: error.message });
  }
};

export const revoke = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Find the refresh token
    const storedRefreshToken = await RefreshToken.findOne({
      where: { token: refreshToken }
    });

    if (!storedRefreshToken) {
      console.warn(`Revoke: Refresh token not found`);
      return res.status(404).json({ error: 'Token not found' });
    }

    if (storedRefreshToken.isRevoked) {
      console.warn(`Revoke: Token already revoked`);
      return res.status(404).json({ error: 'Token not found or already revoked' });
    }

    // Revoke the token
    storedRefreshToken.revokedAt = new Date();
    await storedRefreshToken.save();

    console.log(`Refresh token revoked for user ${storedRefreshToken.userId}`);
    res.json({ message: 'Token revoked successfully' });
  } catch (error: any) {
    console.error('Error revoking token:', error);
    res.status(500).json({ error: 'Error revoking token', details: error.message });
  }
};

export const forgotPassword = async (req: RequestWithTenant, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email in the current tenant
    const user = await User.findOne({
      where: { email, tenantId: req.tenant?.id }
    });

    if (!user) {
      // For security, don't reveal if the user doesn't exist
      console.warn(`Password reset requested for non-existent user: ${email} on tenant ${req.tenant?.id}`);
      return res.status(200).json({ 
        message: 'If a matching account was found, a password reset code has been sent to your email.' 
      });
    }

    // Generate a 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 15); // Valid for 15 minutes

    // Save the reset code
    await PasswordResetCode.create({
      userId: user.id,
      code,
      expiryDate,
      isUsed: false
    });

    // TODO: Send email with the code
    // For now, just log it
    console.log(`Password reset code for ${email}: ${code}`);

    res.status(200).json({ 
      message: 'If a matching account was found, a password reset code has been sent to your email.' 
    });
  } catch (error: any) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ error: 'Error processing password reset request', details: error.message });
  }
};

export const resetPassword = async (req: RequestWithTenant, res: Response) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }

    // Find user by email in the current tenant
    const user = await User.findOne({
      where: { email, tenantId: req.tenant?.id }
    });

    if (!user) {
      console.warn(`Password reset failed: User not found for email ${email}`);
      return res.status(400).json({ error: 'Invalid email address or user not found' });
    }

    // Find valid reset code
    const resetCode = await PasswordResetCode.findOne({
      where: {
        userId: user.id,
        code,
        isUsed: false
      }
    });

    if (!resetCode) {
      console.warn(`Password reset failed: Invalid or already used code for user ${user.id}`);
      return res.status(400).json({ error: 'Invalid or expired code, or user not found.' });
    }

    // Check if code is expired
    if (new Date() > resetCode.expiryDate) {
      console.warn(`Password reset failed: Code expired for user ${user.id}`);
      return res.status(400).json({ error: 'Invalid or expired code, or user not found.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear mustChangePassword flag
    await User.update(
      {
        passwordHash: hashedPassword,
        mustChangePassword: false
      },
      { where: { id: user.id } }
    );

    // Mark code as used
    await PasswordResetCode.update(
      { isUsed: true },
      { where: { id: resetCode.id } }
    );

    console.log(`Password reset successfully for user ${user.id}`);
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ error: 'Error resetting password', details: error.message });
  }
};

export const changePassword = async (req: RequestWithTenant, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // Get user ID from JWT token
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Invalid user token' });
    }

    // Find user by ID and tenant
    const user = await User.findOne({
      where: { id: userId, tenantId: req.tenant?.id }
    });

    if (!user) {
      console.error(`Password change failed: User not found. userId=${userId}, tenantId=${req.tenant?.id}`);
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify current password
    if (!user.passwordHash) {
      return res.status(401).json({ error: 'User password not configured' });
    }
    
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      console.warn(`Password change failed for user ${userId}: Invalid current password`);
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password and update user
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { 
        passwordHash: hashedNewPassword,
        mustChangePassword: false
      },
      { where: { id: userId } }
    );
    
    console.log(`Password changed successfully for user ${userId}`);
    res.status(200).json({ message: 'Password has been changed successfully. You can now use your new password to login.' });
  } catch (error: any) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error changing password', details: error.message });
  }
};

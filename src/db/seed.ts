/**
 * Database Seed Script - Creates Host Tenant and System Administrator
 * Matches C# CreateHostTenant.cs business logic
 */

import { Sequelize } from 'sequelize';
import * as bcrypt from 'bcrypt';
import Tenant from '../models/tenant';
import User from '../models/user';
import Role from '../models/role';
import Permission from '../models/permission';
import UserRole from '../models/userRole';
import RolePermission from '../models/rolePermission';
import { TenantSetting } from '../models/tenantSetting';
import SubscriptionPlan from '../models/subscriptionPlan';
import { PERMISSION_CATALOG } from '../permissions/permissionCatalog';

const HOST_DOMAIN = 'host';
const HOST_EMAIL = 'hostadmin@funeral.com';
const DEFAULT_PASSWORD = 'HostAdmin123!';

interface SeedOptions {
  sequelize: Sequelize;
  hostEmail?: string;
  hostPassword?: string;
}

export async function seedHostTenant(options: SeedOptions): Promise<void> {
  const { sequelize, hostEmail = HOST_EMAIL, hostPassword = DEFAULT_PASSWORD } = options;

  console.log('🚀 Starting Host Tenant Seed...\n');

  try {
    // Step 1: Create Subscription Plans
    await createSubscriptionPlans(sequelize);

    // Step 2: Create Host Tenant
    const hostTenant = await createHostTenant(sequelize, hostEmail);

    // Step 3: Create System Administrator User
    const adminUser = await createSystemAdminUser(sequelize, hostTenant.id, hostEmail, hostPassword);

    // Step 4: Create System Administrator Role
    const adminRole = await createSystemAdminRole(sequelize, hostTenant.id, adminUser.id);

    // Step 5: Create Permissions
    await createPermissions(sequelize, hostTenant.id, adminUser.id);

    // Step 6: Assign Permissions to Role
    await assignAllPermissionsToRole(sequelize, adminRole.id, hostTenant.id);

    // Step 7: Assign Admin Role to User
    await assignRoleToUser(sequelize, adminUser.id, adminRole.id);

    // Step 8: Create Tenant Settings
    await createTenantSettings(sequelize, hostTenant.id, hostTenant.name);

    console.log('\n🎉 HOST TENANT SETUP COMPLETE!');
    console.log('===============================');
    console.log(`Tenant ID: ${hostTenant.id}`);
    console.log(`Domain: ${hostTenant.dataValues.domain}`);
    console.log(`Admin Email: ${adminUser.email}`);
    console.log(`Admin Password: ${hostPassword}`);
    console.log('===============================');
    console.log('⚠️  IMPORTANT: Please change the admin password after first login!\n');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

async function createSubscriptionPlans(sequelize: Sequelize): Promise<void> {
  const existingPlans = await SubscriptionPlan.count();

  if (existingPlans > 0) {
    console.log('✅ Subscription plans already exist');
    return;
  }

  const now = new Date();
  const plans = [
    {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Basic',
      description: 'Basic funeral management features',
      monthlyPrice: 0,
      allowedTenantType: 'Basic',
      features: JSON.stringify({
        MaxMembers: 100,
        MaxPolicies: 5,
        IdentityVerification: false,
        MaxVerificationsPerMonth: 0,
      }),
      createdBy: '00000000-0000-0000-0000-000000000000',
      updatedBy: '00000000-0000-0000-0000-000000000000',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'Standard',
      description: 'Standard funeral management with verification',
      monthlyPrice: 49,
      allowedTenantType: 'Standard',
      features: JSON.stringify({
        MaxMembers: 500,
        MaxPolicies: 20,
        IdentityVerification: true,
        MaxVerificationsPerMonth: 100,
      }),
      createdBy: '00000000-0000-0000-0000-000000000000',
      updatedBy: '00000000-0000-0000-0000-000000000000',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Premium',
      description: 'Premium funeral management with full verification suite',
      monthlyPrice: 99,
      allowedTenantType: 'Premium',
      features: JSON.stringify({
        MaxMembers: -1, // Unlimited
        MaxPolicies: -1, // Unlimited
        IdentityVerification: true,
        MaxVerificationsPerMonth: -1, // Unlimited
      }),
      createdBy: '00000000-0000-0000-0000-000000000000',
      updatedBy: '00000000-0000-0000-0000-000000000000',
      createdAt: now,
      updatedAt: now,
    },
  ];

  await SubscriptionPlan.bulkCreate(plans);
  console.log(`✅ Created ${plans.length} subscription plans`);
}

async function createHostTenant(sequelize: Sequelize, hostEmail: string): Promise<any> {
  // Check if host tenant already exists
  const existingHostTenant = await Tenant.findOne({
    where: { domain: HOST_DOMAIN },
  });

  if (existingHostTenant) {
    console.log('✅ Host tenant already exists!');
    console.log(`   Tenant ID: ${existingHostTenant.id}`);
    console.log(`   Domain: ${existingHostTenant.dataValues.domain}`);
    console.log(`   Name: ${existingHostTenant.name}`);
    return existingHostTenant;
  }

  const now = new Date();
  const emptyGuid = '00000000-0000-0000-0000-000000000000';
  const premiumPlan = await SubscriptionPlan.findOne({
    where: { name: 'Premium' },
  });

  const hostTenantData: any = {
    name: 'Host Tenant',
    domain: HOST_DOMAIN,
    email: hostEmail,
    address: 'System Administration Office',
    phone1: '+1-800-FUNERAL',
    phone2: '+1-800-SUPPORT',
    registrationNumber: 'HOST-SYSTEM-001',
    type: 'Premium',
    subscriptionStartDate: now,
    createdBy: emptyGuid,
    updatedBy: emptyGuid,
  };

  if (premiumPlan?.id) {
    hostTenantData.subscriptionPlanId = premiumPlan.id;
  }

  const hostTenant = await Tenant.create(hostTenantData);

  console.log(`✅ Created host tenant: ${hostTenant.name} (${hostTenant.dataValues.domain})`);
  return hostTenant;
}

async function createSystemAdminUser(
  sequelize: Sequelize,
  tenantId: string,
  email: string,
  password: string
): Promise<any> {
  const now = new Date();
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await User.create({
    email,
    firstName: 'System',
    lastName: 'Administrator',
    passwordHash: hashedPassword,
    tenantId,
    mustChangePassword: false,
    createdBy: '00000000-0000-0000-0000-000000000000',
    updatedBy: '00000000-0000-0000-0000-000000000000',
  });

  console.log(`✅ Created system administrator: ${adminUser.email}`);
  return adminUser;
}

async function createSystemAdminRole(
  sequelize: Sequelize,
  tenantId: string,
  createdBy: string
): Promise<any> {
  const adminRole = await Role.create({
    name: 'Admin',
    tenantId,
    createdBy,
    updatedBy: createdBy,
  });

  console.log(`✅ Created admin role: ${adminRole.name}`);
  return adminRole;
}

async function createPermissions(sequelize: Sequelize, tenantId: string, createdBy: string): Promise<void> {
  const existingPermissions = await Permission.findAll({
    where: { tenantId },
    attributes: ['name'],
  });

  const existingPermissionNames = existingPermissions.map((p: any) => p.name);
  const permissionsToCreate = PERMISSION_CATALOG.filter((p) => !existingPermissionNames.includes(p));

  if (permissionsToCreate.length === 0) {
    console.log('✅ All permissions already exist for tenant');
    return;
  }

  const permissions = permissionsToCreate.map((permName) => ({
    name: permName,
    tenantId,
    createdBy,
    updatedBy: createdBy,
  }));

  await Permission.bulkCreate(permissions);
  console.log(`✅ Created ${permissions.length} permissions`);
}

async function assignAllPermissionsToRole(
  sequelize: Sequelize,
  roleId: string,
  tenantId: string
): Promise<void> {
  const permissions = await Permission.findAll({
    where: { tenantId },
  });

  const rolePermissions = permissions.map((permission: any) => ({
    roleId,
    permissionId: permission.id,
  }));

  await RolePermission.bulkCreate(rolePermissions);
  console.log(`✅ Assigned ${rolePermissions.length} permissions to admin role`);
}

async function assignRoleToUser(sequelize: Sequelize, userId: string, roleId: string): Promise<void> {
  await UserRole.create({
    userId,
    roleId,
  });

  console.log('✅ Assigned admin role to user');
}

async function createTenantSettings(sequelize: Sequelize, tenantId: string, tenantName: string): Promise<void> {
  const settingsData: any = {
    tenantId,
    settings: JSON.stringify({
      TenantName: tenantName,
      SystemTenant: true,
      AllowTenantCreation: true,
      MaxTenantsAllowed: -1, // Unlimited
      EnableSystemFeatures: true,
    }),
  };

  const tenantSettings = await TenantSetting.create(settingsData);

  console.log('✅ Created tenant settings');
}

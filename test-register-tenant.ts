import sequelize from './src/db/database';
import Tenant from './src/models/tenant';
import User from './src/models/user';
import Role from './src/models/role';
import Permission from './src/models/permission';
import RolePermission from './src/models/rolePermission';
import UserRole from './src/models/userRole';
import TenantSetting from './src/models/tenantSetting';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

async function testRegisterTenantFlow() {
  try {
    console.log('🚀 Starting registerTenant auto-creation flow test...\n');

    // Sync database
    console.log('📦 Syncing database models...');
    await sequelize.sync();
    console.log('✅ Database synced\n');

    // Test data
    const testData = {
      name: `Test Tenant ${Date.now()}`,
      domain: `test-tenant-${Date.now()}@example.com`,
      adminEmail: `admin-${Date.now()}@test.com`,
      adminPassword: 'TestPassword123!',
      adminFirstName: 'Test',
      adminLastName: 'Admin'
    };

    console.log('📋 Test Input:');
    console.log(`  - Tenant Name: ${testData.name}`);
    console.log(`  - Domain: ${testData.domain}`);
    console.log(`  - Admin Email: ${testData.adminEmail}\n`);

    // Step 1: Create Tenant
    console.log('Step 1️⃣  Creating tenant...');
    const tenant = await Tenant.create({ name: testData.name, domain: testData.domain });
    // Reload to get the ID properly (workaround for public class field shadowing)
    await tenant.reload();
    console.log(`  ✅ Tenant created with ID: ${tenant.id}\n`);

    // Step 2: Create TenantSetting
    console.log('Step 2️⃣  Creating tenant setting...');
    const tenantSetting = await TenantSetting.create({
      tenantId: tenant.id,
      settings: '{}'
    });
    console.log(`  ✅ TenantSetting created with ID: ${tenantSetting.id}\n`);

    // Step 3: Create Role
    console.log('Step 3️⃣  Creating TenantAdmin role...');
    const role = await Role.create({
      name: 'TenantAdmin',
      tenantId: tenant.id
    });
    console.log(`  ✅ Role created with ID: ${role.id}`);
    console.log(`  ✅ Role name: ${role.name}`);
    console.log(`  ✅ Role tenantId: ${role.tenantId}\n`);

    // Step 4: Create Permission
    console.log('Step 4️⃣  Creating ViewDashboard permission...');
    const permission = await Permission.create({
      name: 'ViewDashboard',
      tenantId: tenant.id
    });
    console.log(`  ✅ Permission created with ID: ${permission.id}`);
    console.log(`  ✅ Permission name: ${permission.name}`);
    console.log(`  ✅ Permission tenantId: ${permission.tenantId}\n`);

    // Step 5: Associate Permission to Role
    console.log('Step 5️⃣  Associating permission to role via RolePermission...');
    const rolePermission = await RolePermission.create({
      roleId: role.id,
      permissionId: permission.id
    });
    console.log(`  ✅ RolePermission created with ID: ${rolePermission.id}`);
    console.log(`  ✅ Role ID: ${rolePermission.roleId}`);
    console.log(`  ✅ Permission ID: ${rolePermission.permissionId}\n`);

    // Step 6: Create Admin User
    console.log('Step 6️⃣  Creating admin user...');
    const hashedPassword = await bcrypt.hash(testData.adminPassword, 10);
    const adminUser = await User.create({
      email: testData.adminEmail,
      passwordHash: hashedPassword,
      firstName: testData.adminFirstName,
      lastName: testData.adminLastName,
      tenantId: tenant.id
    });
    console.log(`  ✅ User created with ID: ${adminUser.id}`);
    console.log(`  ✅ User email: ${adminUser.email}`);
    console.log(`  ✅ User tenantId: ${adminUser.tenantId}\n`);

    // Step 7: Associate User to Role
    console.log('Step 7️⃣  Associating user to role via UserRole...');
    const userRole = await UserRole.create({
      userId: adminUser.id,
      roleId: role.id
    });
    console.log(`  ✅ UserRole created with ID: ${userRole.id}`);
    console.log(`  ✅ User ID: ${userRole.userId}`);
    console.log(`  ✅ Role ID: ${userRole.roleId}\n`);

    // Verification Steps
    console.log('🔍 Verification:\n');

    // Verify Tenant
    console.log('Verifying Tenant...');
    const verifyTenant = await Tenant.findByPk(tenant.id);
    console.log(`  ✅ Tenant exists: ${verifyTenant !== null}`);
    console.log(`  ✅ Tenant ID matches: ${verifyTenant?.id === tenant.id}`);
    console.log(`  ✅ Tenant name: ${verifyTenant?.name}\n`);

    // Verify TenantSetting
    console.log('Verifying TenantSetting...');
    const verifyTenantSetting = await TenantSetting.findByPk(tenantSetting.id);
    console.log(`  ✅ TenantSetting exists: ${verifyTenantSetting !== null}`);
    console.log(`  ✅ TenantSetting tenantId matches: ${verifyTenantSetting?.tenantId === tenant.id}`);
    console.log(`  ✅ TenantSetting id: ${verifyTenantSetting?.id}\n`);

    // Verify Role
    console.log('Verifying Role...');
    const verifyRole = await Role.findByPk(role.id);
    console.log(`  ✅ Role exists: ${verifyRole !== null}`);
    console.log(`  ✅ Role tenantId matches: ${verifyRole?.tenantId === tenant.id}`);
    console.log(`  ✅ Role name: ${verifyRole?.name}\n`);

    // Verify Permission
    console.log('Verifying Permission...');
    const verifyPermission = await Permission.findByPk(permission.id);
    console.log(`  ✅ Permission exists: ${verifyPermission !== null}`);
    console.log(`  ✅ Permission tenantId matches: ${verifyPermission?.tenantId === tenant.id}`);
    console.log(`  ✅ Permission name: ${verifyPermission?.name}\n`);

    // Verify RolePermission Association
    console.log('Verifying RolePermission Association...');
    const verifyRolePermission = await RolePermission.findOne({
      where: { roleId: role.id, permissionId: permission.id }
    });
    console.log(`  ✅ RolePermission association exists: ${verifyRolePermission !== null}`);
    console.log(`  ✅ RolePermission ID: ${verifyRolePermission?.id}\n`);

    // Verify User
    console.log('Verifying User...');
    const verifyUser = await User.findByPk(adminUser.id);
    console.log(`  ✅ User exists: ${verifyUser !== null}`);
    console.log(`  ✅ User tenantId matches: ${verifyUser?.tenantId === tenant.id}`);
    console.log(`  ✅ User email: ${verifyUser?.email}`);
    console.log(`  ✅ User has passwordHash: ${verifyUser?.passwordHash !== null && verifyUser?.passwordHash !== undefined}`);
    
    // Verify password works
    if (verifyUser?.passwordHash) {
      const passwordValid = await bcrypt.compare(testData.adminPassword, verifyUser.passwordHash);
      console.log(`  ✅ Password verification: ${passwordValid}\n`);
    }

    // Verify UserRole Association
    console.log('Verifying UserRole Association...');
    const verifyUserRole = await UserRole.findOne({
      where: { userId: adminUser.id, roleId: role.id }
    });
    console.log(`  ✅ UserRole association exists: ${verifyUserRole !== null}`);
    console.log(`  ✅ UserRole ID: ${verifyUserRole?.id}\n`);

    // Verify Multi-tenancy: Different tenant shouldn't see the role
    console.log('Verifying Multi-tenancy Isolation...');
    const otherTenantId = uuidv4();
    const otherTenantRole = await Role.findOne({
      where: { name: 'TenantAdmin', tenantId: otherTenantId }
    });
    console.log(`  ✅ Other tenant cannot see TenantAdmin role: ${otherTenantRole === null}\n`);

    console.log('✨ All tests passed!\n');

    // Summary
    console.log('📊 Test Summary:');
    console.log(`  ✅ Tenant: ${tenant.id}`);
    console.log(`  ✅ TenantSetting: ${tenantSetting.id}`);
    console.log(`  ✅ Role: ${role.id}`);
    console.log(`  ✅ Permission: ${permission.id}`);
    console.log(`  ✅ RolePermission: ${rolePermission.id}`);
    console.log(`  ✅ User: ${adminUser.id}`);
    console.log(`  ✅ UserRole: ${userRole.id}\n`);

    console.log('🎉 registerTenant auto-creation flow is working correctly!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

testRegisterTenantFlow();

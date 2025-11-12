const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const fs = require('fs');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'funeral_db'
};

const models = [
  'Asset',
  'AssetCheckout',
  'AssetInspectionLog',
  'Beneficiary',
  'Claim',
  'DashboardWidgetSetting',
  'Dependent',
  'DocumentRequirement',
  'FileMetadata',
  'FuneralEvent',
  'LandingPageComponent',
  'LandingPageLayout',
  'Member',
  'MemberBankingDetail',
  'MemberProfileCompletion',
  'Permission',
  'Policy',
  'PolicyEnrollment',
  'Resource',
  'ResourceBooking',
  'Role',
  'RolePermission',
  'Tenant',
  'TenantSetting',
  'User',
  'UserRole'
];

async function checkAndCreateTables() {
  const connection = await mysql.createConnection({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  });

  let log = '';

  try {
    log += `Checking for missing tables in database: ${dbConfig.database}\n\n`;

    // Get existing tables
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `, [dbConfig.database]);

    const existingTables = new Set(tables.map(t => t.TABLE_NAME));
    log += `Existing tables (${existingTables.size}):\n`;
    [...existingTables].sort().forEach(table => {
      log += `  ✓ ${table}\n`;
    });

    log += `\nModels defined (${models.length}):\n`;
    const missingTables = [];
    const missingTableMap = {
      'Asset': 'Assets',
      'AssetCheckout': 'AssetCheckouts',
      'AssetInspectionLog': 'AssetInspectionLogs',
      'Beneficiary': 'Beneficiaries',
      'Claim': 'Claims',
      'DashboardWidgetSetting': 'DashboardWidgetSettings',
      'Dependent': 'Dependents',
      'DocumentRequirement': 'DocumentRequirements',
      'FileMetadata': 'FileMetadata',
      'FuneralEvent': 'FuneralEvents',
      'LandingPageComponent': 'LandingPageComponents',
      'LandingPageLayout': 'LandingPageLayouts',
      'Member': 'Members',
      'MemberBankingDetail': 'MemberBankingDetails',
      'MemberProfileCompletion': 'MemberProfileCompletions',
      'Permission': 'Permissions',
      'Policy': 'Policies',
      'PolicyEnrollment': 'PolicyEnrollments',
      'Resource': 'Resources',
      'ResourceBooking': 'ResourceBookings',
      'Role': 'Roles',
      'RolePermission': 'RolePermissions',
      'Tenant': 'Tenants',
      'TenantSetting': 'TenantSettings',
      'User': 'Users',
      'UserRole': 'UserRoles'
    };

    models.forEach(model => {
      const tableName = missingTableMap[model] || model;
      if (existingTables.has(tableName)) {
        log += `  ✓ ${model} -> ${tableName}\n`;
      } else {
        log += `  ✗ ${model} -> ${tableName} (MISSING)\n`;
        missingTables.push(tableName);
      }
    });

    log += `\nMissing tables (${missingTables.length}):\n`;
    missingTables.forEach(table => {
      log += `  - ${table}\n`;
    });

    // Write summary to log file
    fs.writeFileSync('create-tables.log', log);
    console.log(log);

  } catch (error) {
    log += `ERROR: ${error.message}\n`;
    fs.writeFileSync('create-tables.log', log);
    console.error(error);
  } finally {
    await connection.end();
  }
}

checkAndCreateTables();

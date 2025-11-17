import sequelize from './src/db/database';

async function checkLogoSchema() {
  try {
    console.log('🔍 Checking TenantSettings table schema...');
    
    const [results]: any = await sequelize.query(`
      SELECT 
        COLUMN_NAME, 
        DATA_TYPE, 
        CHARACTER_MAXIMUM_LENGTH,
        IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'TenantSettings' 
      AND COLUMN_NAME IN ('logo', 'favicon')
      ORDER BY COLUMN_NAME
    `);
    
    console.log('\n📋 Current schema:');
    console.table(results);
    
    // Check if columns are TEXT or UUID
    for (const col of results) {
      if (col.DATA_TYPE === 'char' && col.CHARACTER_MAXIMUM_LENGTH === 36) {
        console.log(`\n⚠️  WARNING: ${col.COLUMN_NAME} is UUID (char(36)), should be TEXT/LONGTEXT`);
        console.log(`   Need to alter column to LONGTEXT`);
      } else if (col.DATA_TYPE === 'longtext' || col.DATA_TYPE === 'text') {
        console.log(`\n✅ ${col.COLUMN_NAME} is correctly ${col.DATA_TYPE}`);
      } else {
        console.log(`\n❓ ${col.COLUMN_NAME} has unexpected type: ${col.DATA_TYPE}`);
      }
    }
    
    // Check current data
    console.log('\n📊 Current data in TenantSettings:');
    const [data]: any = await sequelize.query(`
      SELECT id, tenantId, logo, favicon, LEFT(settings, 100) as settings_preview
      FROM TenantSettings
      LIMIT 5
    `);
    console.table(data);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkLogoSchema();

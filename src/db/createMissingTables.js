const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('funeral_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function createMissingTables() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const queryInterface = sequelize.getQueryInterface();
    
    const tables = await queryInterface.showAllTables();
    console.log('Creating missing tables...\n');

    // MemberProfileCompletions
    if (!tables.includes('MemberProfileCompletions')) {
      console.log('Creating MemberProfileCompletions table...');
      await sequelize.query(`
        CREATE TABLE MemberProfileCompletions (
          id VARCHAR(36) PRIMARY KEY,
          memberId INT NOT NULL,
          profileCompletionPercentage FLOAT DEFAULT 0,
          tenantId INT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ MemberProfileCompletions created');
    } else {
      console.log('✓ MemberProfileCompletions already exists');
    }

    // PolicyEnrollments
    if (!tables.includes('PolicyEnrollments')) {
      console.log('Creating PolicyEnrollments table...');
      await sequelize.query(`
        CREATE TABLE PolicyEnrollments (
          id VARCHAR(36) PRIMARY KEY,
          policyId INT NOT NULL,
          memberId INT NOT NULL,
          enrollmentDate DATETIME,
          tenantId INT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('✓ PolicyEnrollments created');
    } else {
      console.log('✓ PolicyEnrollments already exists');
    }

    console.log('\n✓ All missing tables handled successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating tables:', error.message);
    process.exit(1);
  }
}

createMissingTables();

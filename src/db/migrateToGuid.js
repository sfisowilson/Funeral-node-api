const { Sequelize } = require('sequelize');
const db = new Sequelize('funeral_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

async function migrateToGuidSchema() {
  try {
    await db.authenticate();
    console.log('Connected to database\n');

    // Drop all existing tables
    console.log('Dropping existing tables...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    
    const tables = [
      'tenantsettings', 'users', 'userroles', 'roles', 'rolepermissions', 
      'permissions', 'members', 'memberprofilecompletions', 'beneficiaries',
      'dependents', 'policies', 'policyenrollments', 'claims', 'assets',
      'assetcheckouts', 'assetinspectionlogs', 'resources', 'resourcebookings',
      'funeralevents', 'memberbankingdetails', 'documentrequirements',
      'landingpagecomponents', 'landingpagelayouts', 'dashboardwidgetsettings',
      'filemetadata', 'tenants'
    ];

    for (const table of tables) {
      try {
        await db.query(`DROP TABLE IF EXISTS ${table}`);
        console.log(`  ✓ Dropped ${table}`);
      } catch (e) {
        console.log(`  - ${table} (doesn't exist)`);
      }
    }

    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('\n✓ All tables dropped\n');

    // Create new tables with GUID structure
    console.log('Creating new tables with GUID structure...\n');

    // 1. Tenants
    console.log('Creating Tenants table...');
    await db.query(`
      CREATE TABLE Tenants (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255),
        domain VARCHAR(255) UNIQUE,
        email VARCHAR(255),
        address VARCHAR(255),
        phone1 VARCHAR(20),
        phone2 VARCHAR(20),
        registrationNumber VARCHAR(50),
        type VARCHAR(50) DEFAULT 'Standard',
        subscriptionPlanId CHAR(36),
        subscriptionStartDate DATETIME,
        lastInvoiceDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36)
      )
    `);
    console.log('  ✓ Tenants\n');

    // 2. Users
    console.log('Creating Users table...');
    await db.query(`
      CREATE TABLE Users (
        id CHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        phoneNumber VARCHAR(20),
        address VARCHAR(255),
        idNumber VARCHAR(20),
        passwordHash VARCHAR(255),
        tenantId CHAR(36) NOT NULL,
        mustChangePassword BOOLEAN DEFAULT FALSE,
        isIdVerified BOOLEAN DEFAULT FALSE,
        idVerifiedAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_email (email),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Users\n');

    // 3. Permissions
    console.log('Creating Permissions table...');
    await db.query(`
      CREATE TABLE Permissions (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tenantId CHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId),
        UNIQUE KEY unique_permission_per_tenant (name, tenantId)
      )
    `);
    console.log('  ✓ Permissions\n');

    // 4. Roles
    console.log('Creating Roles table...');
    await db.query(`
      CREATE TABLE Roles (
        id CHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tenantId CHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId),
        UNIQUE KEY unique_role_per_tenant (name, tenantId)
      )
    `);
    console.log('  ✓ Roles\n');

    // 5. RolePermissions
    console.log('Creating RolePermissions table...');
    await db.query(`
      CREATE TABLE RolePermissions (
        id CHAR(36) PRIMARY KEY,
        roleId CHAR(36) NOT NULL,
        permissionId CHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (roleId) REFERENCES Roles(id),
        FOREIGN KEY (permissionId) REFERENCES Permissions(id),
        UNIQUE KEY unique_role_permission (roleId, permissionId)
      )
    `);
    console.log('  ✓ RolePermissions\n');

    // 6. UserRoles
    console.log('Creating UserRoles table...');
    await db.query(`
      CREATE TABLE UserRoles (
        id CHAR(36) PRIMARY KEY,
        userId CHAR(36) NOT NULL,
        roleId CHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id),
        FOREIGN KEY (roleId) REFERENCES Roles(id),
        UNIQUE KEY unique_user_role (userId, roleId)
      )
    `);
    console.log('  ✓ UserRoles\n');

    // 7. TenantSettings
    console.log('Creating TenantSettings table...');
    await db.query(`
      CREATE TABLE TenantSettings (
        id CHAR(36) PRIMARY KEY,
        settings LONGTEXT,
        logo LONGTEXT,
        favicon LONGTEXT,
        tenantId CHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        UNIQUE KEY unique_tenant_setting (tenantId)
      )
    `);
    console.log('  ✓ TenantSettings\n');

    // 8. Members
    console.log('Creating Members table...');
    await db.query(`
      CREATE TABLE Members (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        title VARCHAR(10),
        firstNames VARCHAR(100),
        surname VARCHAR(100),
        name VARCHAR(255),
        dateOfBirth DATE,
        email VARCHAR(255),
        phone1 VARCHAR(20),
        phone2 VARCHAR(20),
        identificationNumber VARCHAR(20),
        sourceOfIncome VARCHAR(50),
        sourceOfIncomeOther VARCHAR(200),
        streetAddress VARCHAR(200),
        city VARCHAR(100),
        province VARCHAR(100),
        postalCode VARCHAR(10),
        country VARCHAR(100),
        address VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId),
        INDEX idx_email (email)
      )
    `);
    console.log('  ✓ Members\n');

    // 9. Beneficiaries
    console.log('Creating Beneficiaries table...');
    await db.query(`
      CREATE TABLE Beneficiaries (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        memberId CHAR(36),
        name VARCHAR(255),
        relationship VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Beneficiaries\n');

    // 10. Dependents
    console.log('Creating Dependents table...');
    await db.query(`
      CREATE TABLE Dependents (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        memberId CHAR(36),
        name VARCHAR(255),
        relationship VARCHAR(100),
        dateOfBirth DATE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Dependents\n');

    // 11. Policies
    console.log('Creating Policies table...');
    await db.query(`
      CREATE TABLE Policies (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        policyNumber VARCHAR(50),
        memberId CHAR(36),
        policyType VARCHAR(100),
        status VARCHAR(50),
        startDate DATE,
        endDate DATE,
        premiumAmount DECIMAL(10, 2),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Policies\n');

    // 12. PolicyEnrollments
    console.log('Creating PolicyEnrollments table...');
    await db.query(`
      CREATE TABLE PolicyEnrollments (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        policyId CHAR(36),
        memberId CHAR(36),
        enrollmentDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (policyId) REFERENCES Policies(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ PolicyEnrollments\n');

    // 13. Claims
    console.log('Creating Claims table...');
    await db.query(`
      CREATE TABLE Claims (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        claimNumber VARCHAR(50),
        policyId CHAR(36),
        memberId CHAR(36),
        claimDate DATE,
        claimAmount DECIMAL(10, 2),
        status VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (policyId) REFERENCES Policies(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Claims\n');

    // 14. Assets
    console.log('Creating Assets table...');
    await db.query(`
      CREATE TABLE Assets (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        name VARCHAR(255),
        description TEXT,
        status VARCHAR(50),
        location VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Assets\n');

    // 15. AssetCheckouts
    console.log('Creating AssetCheckouts table...');
    await db.query(`
      CREATE TABLE AssetCheckouts (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        assetId CHAR(36),
        userId CHAR(36),
        checkoutDate DATETIME,
        returnDate DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (assetId) REFERENCES Assets(id),
        FOREIGN KEY (userId) REFERENCES Users(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ AssetCheckouts\n');

    // 16. AssetInspectionLogs
    console.log('Creating AssetInspectionLogs table...');
    await db.query(`
      CREATE TABLE AssetInspectionLogs (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        assetId CHAR(36),
        inspectionDate DATETIME,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (assetId) REFERENCES Assets(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ AssetInspectionLogs\n');

    // 17. Resources
    console.log('Creating Resources table...');
    await db.query(`
      CREATE TABLE Resources (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        name VARCHAR(255),
        type VARCHAR(100),
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ Resources\n');

    // 18. ResourceBookings
    console.log('Creating ResourceBookings table...');
    await db.query(`
      CREATE TABLE ResourceBookings (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        resourceId CHAR(36),
        userId CHAR(36),
        bookingDate DATE,
        startTime TIME,
        endTime TIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (resourceId) REFERENCES Resources(id),
        FOREIGN KEY (userId) REFERENCES Users(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ ResourceBookings\n');

    // 19. FuneralEvents
    console.log('Creating FuneralEvents table...');
    await db.query(`
      CREATE TABLE FuneralEvents (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        memberId CHAR(36),
        eventDate DATE,
        location VARCHAR(255),
        description TEXT,
        status VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ FuneralEvents\n');

    // 20. MemberBankingDetails
    console.log('Creating MemberBankingDetails table...');
    await db.query(`
      CREATE TABLE MemberBankingDetails (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        memberId CHAR(36),
        bankName VARCHAR(100),
        accountNumber VARCHAR(50),
        accountHolderName VARCHAR(255),
        accountType VARCHAR(50),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ MemberBankingDetails\n');

    // 21. DocumentRequirements
    console.log('Creating DocumentRequirements table...');
    await db.query(`
      CREATE TABLE DocumentRequirements (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        name VARCHAR(255),
        description TEXT,
        isMandatory BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ DocumentRequirements\n');

    // 22. LandingPageComponents
    console.log('Creating LandingPageComponents table...');
    await db.query(`
      CREATE TABLE LandingPageComponents (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        title VARCHAR(255),
        content TEXT,
        componentType VARCHAR(50),
        sortOrder INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ LandingPageComponents\n');

    // 23. LandingPageLayouts
    console.log('Creating LandingPageLayouts table...');
    await db.query(`
      CREATE TABLE LandingPageLayouts (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        name VARCHAR(255),
        layoutJson TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ LandingPageLayouts\n');

    // 24. DashboardWidgetSettings
    console.log('Creating DashboardWidgetSettings table...');
    await db.query(`
      CREATE TABLE DashboardWidgetSettings (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        widgetName VARCHAR(255),
        widgetConfig TEXT,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        createdBy CHAR(36),
        updatedBy CHAR(36),
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ DashboardWidgetSettings\n');

    // 25. FileMetadata
    console.log('Creating FileMetadata table...');
    await db.query(`
      CREATE TABLE FileMetadata (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        fileName VARCHAR(255),
        fileSize BIGINT,
        fileType VARCHAR(50),
        filePath VARCHAR(255),
        uploadedBy CHAR(36),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        INDEX idx_tenantId (tenantId)
      )
    `);
    console.log('  ✓ FileMetadata\n');

    // 26. MemberProfileCompletions
    console.log('Creating MemberProfileCompletions table...');
    await db.query(`
      CREATE TABLE MemberProfileCompletions (
        id CHAR(36) PRIMARY KEY,
        tenantId CHAR(36) NOT NULL,
        memberId CHAR(36),
        profileCompletionPercentage FLOAT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tenantId) REFERENCES Tenants(id),
        FOREIGN KEY (memberId) REFERENCES Members(id),
        UNIQUE KEY unique_member_profile (memberId)
      )
    `);
    console.log('  ✓ MemberProfileCompletions\n');

    console.log('✓ All tables created successfully with GUID schema!\n');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error.message);
    process.exit(1);
  }
}

migrateToGuidSchema();

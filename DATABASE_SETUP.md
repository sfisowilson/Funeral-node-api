# Database Setup Guide

## Quick Start

To automatically create the database and all 26 tables with proper GUID schema and multi-tenancy support, run:

```bash
npm run db:sync
```

This command will:
1. ✅ Create the MySQL database if it doesn't exist (`funeral_db`)
2. ✅ Create all 26 tables with GUID primary keys (UUID format)
3. ✅ Add `tenantId` fields for multi-tenancy on all entity tables
4. ✅ Add audit trail fields (`createdBy`, `updatedBy`, `createdAt`, `updatedAt`) on all tables
5. ✅ Set up proper foreign key relationships

## What Gets Created

### Core Auth & Multi-Tenancy (7 tables)
- `Tenants` - Tenant organizations with domain, subscription info
- `Users` - User accounts with passwordHash, tenant scoping
- `Roles` - Role definitions (e.g., TenantAdmin, Member)
- `Permissions` - Permission definitions (e.g., ViewDashboard)
- `RolePermissions` - Join table linking roles to permissions
- `UserRoles` - Join table linking users to roles
- `TenantSettings` - Tenant-specific configuration storage

### Member Management (5 tables)
- `Members` - Member profiles with ID, contact info, address
- `MemberProfileCompletions` - Profile completion tracking
- `Beneficiaries` - Beneficiary records linked to members
- `Dependents` - Dependent records linked to members
- `MemberBankingDetails` - Banking information for members

### Financial Management (3 tables)
- `Policies` - Insurance policies with type, premium, status
- `PolicyEnrollments` - Policy enrollment tracking per member
- `Claims` - Claim records with amount, status

### Asset Management (3 tables)
- `Assets` - Physical assets/inventory items
- `AssetCheckouts` - Checkout/return tracking for assets
- `AssetInspectionLogs` - Inspection records for assets

### Resource Management (2 tables)
- `Resources` - Bookable resources (e.g., venues, equipment)
- `ResourceBookings` - Booking records for resources

### Event Management (1 table)
- `FuneralEvents` - Funeral event records with dates, location

### Content Management (3 tables)
- `LandingPageLayouts` - Page layout definitions
- `LandingPageComponents` - Page component definitions
- `DashboardWidgetSettings` - Dashboard widget configurations

### Support (2 tables)
- `DocumentRequirements` - Required documents list
- `FileMetadata` - File upload metadata

## Database Schema Features

### GUID Primary Keys
All tables use UUID (CHAR(36)) primary keys with automatic generation:
```sql
id CHAR(36) PRIMARY KEY DEFAULT (UUID())
```

### Multi-Tenancy
All entity tables include:
```sql
tenantId CHAR(36) NOT NULL REFERENCES Tenants(id)
```

This ensures:
- Complete data isolation between tenants
- All queries filtered by tenantId at service layer
- Security through enforced multi-tenant queries

### Audit Trail
All tables include:
```sql
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
createdBy CHAR(36) NULL  -- UUID of user who created the record
updatedBy CHAR(36) NULL  -- UUID of user who last updated the record
```

## Available Commands

```bash
# Create/sync database and all tables
npm run db:sync

# Test the registerTenant auto-creation flow
npm run test:register-tenant

# Start development server
npm start

# Start with HTTPS
npm start:https
```

## Configuration

Database configuration is in `src/config/config.ts`:

```typescript
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'funeral_db'
};
```

Set environment variables to customize:
- `DB_HOST` - MySQL host (default: localhost)
- `DB_USER` - MySQL user (default: root)
- `DB_PASSWORD` - MySQL password (default: empty)
- `DB_NAME` - Database name (default: funeral_db)

## After Database Creation

Once the database is created and synced, you can:

1. **Register your first tenant:**
   ```bash
   curl -X POST http://localhost:5000/api/Tenant/Tenant_RegisterTenant \
     -H "Content-Type: application/json" \
     -d '{
       "name": "My Funeral Company",
       "domain": "company.example.com",
       "adminEmail": "admin@company.com",
       "adminPassword": "SecurePassword123!",
       "adminFirstName": "John",
       "adminLastName": "Admin"
     }'
   ```

2. **The registerTenant endpoint will automatically:**
   - ✅ Create the Tenant record
   - ✅ Create TenantSetting for tenant configuration
   - ✅ Create TenantAdmin role scoped to the tenant
   - ✅ Create ViewDashboard permission scoped to the tenant
   - ✅ Associate permission to role via RolePermission
   - ✅ Create admin User with bcrypt-hashed password
   - ✅ Associate user to role via UserRole

3. **Login with the admin user:**
   ```bash
   curl -X POST http://localhost:5000/api/Auth/Auth_Login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@company.com",
       "password": "SecurePassword123!"
     }'
   ```

## Verification

To verify the database was created correctly:

```bash
# Run the registerTenant test
npm run test:register-tenant
```

This will:
- ✅ Create a test tenant
- ✅ Verify all 7 auto-created entities
- ✅ Test multi-tenancy isolation
- ✅ Verify bcrypt password hashing works

## Troubleshooting

### "Database connection refused"
- Ensure MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD environment variables
- Verify MySQL user has permissions to create databases

### "Table already exists"
- The sync command uses `force: true` which drops and recreates all tables
- This deletes all existing data - use with caution in production!

### "Column does not exist"
- Ensure all model imports are up-to-date
- Run `npm run db:sync` to recreate tables with latest schema

## Production Considerations

⚠️ **WARNING**: `npm run db:sync` uses `force: true` which **deletes all data**.

For production migrations, consider:
1. Use Sequelize migrations instead of sync
2. Back up data before running sync
3. Run sync in a development/staging environment first
4. Use database migrations for safe production updates

## Reference

- **Database**: MySQL 8.0+
- **ORM**: Sequelize 6.37
- **Schema**: GUID-based with multi-tenancy
- **Models**: 26 tables total
- **Audit Trail**: Full createdBy/updatedBy tracking
- **Security**: bcrypt password hashing, tenant isolation

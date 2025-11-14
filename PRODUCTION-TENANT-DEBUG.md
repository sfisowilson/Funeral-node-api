# Production Tenant Debugging Guide

## Problem
The production NodeAPI at `https://mizo.co.za` is returning "Tenant context missing" error.

## Root Cause
The tenant middleware extracts the subdomain from the request host. For the base domain `mizo.co.za`, it looks for a tenant with `domain='host'`.

## Steps to Debug

### 1. Connect to Production Database
```bash
ssh root@102.211.206.197
mysql -u your_db_user -p your_database_name
```

### 2. Run the Diagnostic Script
```bash
# From your local machine, copy the script to the server
scp check-tenant-production.sql root@102.211.206.197:/tmp/

# On the server, execute it
mysql -u your_db_user -p your_database_name < /tmp/check-tenant-production.sql
```

### 3. Expected Results

**If host tenant exists:**
- You should see a tenant with `domain='host'` and `isActive=1`

**If host tenant is missing:**
- Run the INSERT statement to create it (uncomment in the SQL file)

## Quick Fix: Create Host Tenant

If the host tenant doesn't exist, run this on production:

```sql
INSERT INTO Tenants (id, name, domain, subdomain, isActive, createdAt, updatedAt)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Host Tenant',
    'host',
    'host',
    1,
    NOW(),
    NOW()
);
```

## How Tenant Middleware Works

From `tenantMiddleware.ts`, the middleware:

1. Gets the host from request (e.g., `mizo.co.za` or `tenant1.mizo.co.za`)
2. Extracts the subdomain:
   - `mizo.co.za` → subdomain = `host`
   - `tenant1.mizo.co.za` → subdomain = `tenant1`
3. Queries database for tenant where `domain = subdomain`
4. If not found, returns 400 error "Tenant context missing"

## Verification

After creating/fixing the host tenant, test with:

```bash
curl -H "X-Tenant-ID: 00000000-0000-0000-0000-000000000001" \
     https://mizo.co.za/api/TenantSetting/TenantSetting_GetCurrentTenantSettings
```

Or check in browser DevTools:
- Visit `https://mizo.co.za`
- Open Network tab
- Look for API calls
- They should succeed instead of returning 400

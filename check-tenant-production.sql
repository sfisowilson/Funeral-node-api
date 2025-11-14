-- ============================================
-- Production Tenant Debugging Script
-- Run each command separately from command line
-- ============================================

-- Command 1: Check all tenants
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT id, name, domain, subdomain, isActive, createdAt FROM Tenants ORDER BY isActive DESC, createdAt DESC;"

-- Command 2: Check specifically for 'host' tenant
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT id, name, domain, subdomain, isActive FROM Tenants WHERE domain = 'host';"

-- Command 3: Count tenants
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT COUNT(*) as total_tenants, SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active_tenants FROM Tenants;"

-- Command 4: Check TenantSettings for host tenant
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT * FROM TenantSettings WHERE tenantId = (SELECT id FROM Tenants WHERE domain = 'host');"

-- ============================================
-- FIXES: Only run these if host tenant is missing
-- ============================================

-- Fix 1: Create host tenant (if it doesn't exist)
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "INSERT INTO Tenants (id, name, domain, subdomain, isActive, createdAt, updatedAt) VALUES ('00000000-0000-0000-0000-000000000001', 'Host Tenant', 'host', 'host', 1, NOW(), NOW());"

-- Fix 2: Update existing tenant to be host (replace TENANT_ID with actual ID)
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "UPDATE Tenants SET domain = 'host', subdomain = 'host', isActive = 1 WHERE id = 'TENANT_ID_HERE';"

-- Fix 3: Create TenantSettings for host tenant (after creating tenant)
-- mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "INSERT INTO TenantSettings (id, tenantId, siteName, logoUrl, primaryColor, secondaryColor, createdAt, updatedAt) VALUES (UUID(), '00000000-0000-0000-0000-000000000001', 'Mizo Funeral Services', NULL, '#1976d2', '#dc004e', NOW(), NOW());"

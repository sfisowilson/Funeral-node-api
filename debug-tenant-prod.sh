#!/bin/bash
# ============================================
# Production Tenant Debugging Commands
# SSH into server and run these commands
# ============================================

echo "=== Checking all tenants ==="
mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT id, name, domain, subdomain, isActive, createdAt FROM Tenants ORDER BY isActive DESC, createdAt DESC;"

echo ""
echo "=== Checking for 'host' tenant ==="
mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT id, name, domain, subdomain, isActive FROM Tenants WHERE domain = 'host';"

echo ""
echo "=== Tenant count ==="
mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT COUNT(*) as total_tenants, SUM(CASE WHEN isActive = 1 THEN 1 ELSE 0 END) as active_tenants FROM Tenants;"

echo ""
echo "=== TenantSettings for host ==="
mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e "SELECT * FROM TenantSettings WHERE tenantId = (SELECT id FROM Tenants WHERE domain = 'host');"

echo ""
echo "=== If host tenant is missing, uncomment and run one of these: ==="
echo "# Create new host tenant:"
echo "# mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e \"INSERT INTO Tenants (id, name, domain, subdomain, isActive, createdAt, updatedAt) VALUES ('00000000-0000-0000-0000-000000000001', 'Host Tenant', 'host', 'host', 1, NOW(), NOW());\""
echo ""
echo "# Create TenantSettings for host:"
echo "# mysql -u funeral_user -p'Funeral@2025Secure' funeral_db -e \"INSERT INTO TenantSettings (id, tenantId, siteName, logoUrl, primaryColor, secondaryColor, createdAt, updatedAt) VALUES (UUID(), '00000000-0000-0000-0000-000000000001', 'Mizo Funeral Services', NULL, '#1976d2', '#dc004e', NOW(), NOW());\""

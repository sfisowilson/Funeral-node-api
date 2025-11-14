# ============================================
# Fix Production Tenant Issue
# Run this script to check and create host tenant
# ============================================

Write-Host "Connecting to production server..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if host tenant exists
Write-Host "Step 1: Checking for host tenant..." -ForegroundColor Yellow
ssh root@102.211.206.197 "mysql -u funeral_user -p funeral_db -e 'SELECT id, name, domain, subdomain, isActive FROM Tenants WHERE domain = ''host'';'"

Write-Host ""
Write-Host "Did you see a host tenant above? (If not, we need to create it)" -ForegroundColor Yellow
$response = Read-Host "Do you want to create the host tenant? (y/n)"

if ($response -eq 'y') {
    Write-Host ""
    Write-Host "Step 2: Creating host tenant..." -ForegroundColor Yellow
    ssh root@102.211.206.197 "mysql -u funeral_user -p funeral_db -e 'INSERT INTO Tenants (id, name, domain, subdomain, isActive, createdAt, updatedAt) VALUES (''00000000-0000-0000-0000-000000000001'', ''Host Tenant'', ''host'', ''host'', 1, NOW(), NOW());'"
    
    Write-Host ""
    Write-Host "Step 3: Creating TenantSettings for host tenant..." -ForegroundColor Yellow
    ssh root@102.211.206.197 "mysql -u funeral_user -p funeral_db -e 'INSERT INTO TenantSettings (id, tenantId, siteName, logoUrl, primaryColor, secondaryColor, createdAt, updatedAt) VALUES (UUID(), ''00000000-0000-0000-0000-000000000001'', ''Mizo Funeral Services'', NULL, ''#1976d2'', ''#dc004e'', NOW(), NOW());'"
    
    Write-Host ""
    Write-Host "Step 4: Verifying host tenant was created..." -ForegroundColor Yellow
    ssh root@102.211.206.197 "mysql -u funeral_user -p funeral_db -e 'SELECT id, name, domain, subdomain, isActive FROM Tenants WHERE domain = ''host'';'"
    
    Write-Host ""
    Write-Host "Done! Host tenant should now be created." -ForegroundColor Green
    Write-Host "Try accessing https://mizo.co.za again in your browser." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Skipping tenant creation." -ForegroundColor Yellow
    Write-Host "If the tenant doesn't exist, the API will continue to fail." -ForegroundColor Red
}

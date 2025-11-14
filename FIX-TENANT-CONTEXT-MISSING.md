# Fix for "Tenant context missing" on Production

## Root Cause
The `BASE_DOMAIN` environment variable is not set in production, so the tenant middleware can't correctly identify when accessing the base domain (mizo.co.za).

## Solution

SSH into production and add `BASE_DOMAIN` to the environment:

```bash
ssh root@102.211.206.197
cd /var/www/mizo-api
```

Create or update `.env` file:
```bash
nano .env
```

Add this line:
```
BASE_DOMAIN=mizo.co.za
```

Then restart PM2:
```bash
pm2 restart mizo-api
```

## Verification

Test the API:
```bash
curl https://mizo.co.za/api/TenantSetting/TenantSetting_GetCurrentTenantSettings
```

Should return tenant settings instead of "Tenant context missing".

## How It Works

The tenant middleware checks:
1. If hostname is `mizo.co.za` (base domain), it uses tenant `'host'`
2. If hostname is `tenant1.mizo.co.za`, it extracts `tenant1` as the subdomain
3. It queries the database for a tenant with that domain name

Without `BASE_DOMAIN` set, the middleware doesn't know `mizo.co.za` is the base domain, so it can't resolve the tenant correctly.

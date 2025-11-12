// This script ensures the main/host tenant exists in the database.
// Usage: npx ts-node src/ensure-main-tenant.ts

import Tenant from './models/tenant';

const MAIN_TENANT_NAME = 'Host Tenant';
const MAIN_TENANT_DOMAIN = 'host.local';

(async () => {
  try {
    // Ensure DB connection
    await (Tenant as any).sequelize.authenticate();
    await Tenant.sync();

    // Check if main tenant exists
    let tenant = await Tenant.findOne({ where: { domain: MAIN_TENANT_DOMAIN } });
    if (!tenant) {
      tenant = await Tenant.create({ name: MAIN_TENANT_NAME, domain: MAIN_TENANT_DOMAIN });
      console.log('Main/host tenant created:', tenant.toJSON());
    } else {
      console.log('Main/host tenant already exists:', tenant.toJSON());
    }
    process.exit(0);
  } catch (err) {
    console.error('Error ensuring main tenant:', err);
    process.exit(1);
  }
})();

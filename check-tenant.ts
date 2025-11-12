import { connectToDatabase } from './src/db/database';
import Tenant from './src/models/tenant';

const checkTenant = async () => {
  try {
    await connectToDatabase();
    
    const tenant = await Tenant.findOne({
      where: { domain: 'host' },
      raw: true,
      attributes: ['id', 'domain', 'name']
    });
    
    console.log('Host tenant:');
    console.log(tenant);
    
    const fileOwnerTenant = await Tenant.findOne({
      where: { id: 'de21fa8b-63ce-4291-9558-1f0b4e80b664' },
      raw: true,
      attributes: ['id', 'domain', 'name']
    });
    
    console.log('\nFile owner tenant:');
    console.log(fileOwnerTenant);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkTenant();

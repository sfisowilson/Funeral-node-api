import { connectToDatabase } from './src/db/database';
import FileMetadata from './src/models/fileMetadata';

const checkFiles = async () => {
  try {
    await connectToDatabase();
    
    const files = await FileMetadata.findAll({
      limit: 20,
      raw: true,
      attributes: ['id', 'fileName', 'filePath', 'tenantId', 'userId', 'contentType', 'size', 'createdAt']
    });
    
    console.log('Files in database:');
    console.table(files);
    
    if (files.length === 0) {
      console.log('\n❌ No files found in database');
    } else {
      console.log(`\n✅ Found ${files.length} files`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkFiles();

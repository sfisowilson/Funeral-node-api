const { Sequelize } = require('sequelize');
const db = new Sequelize('funeral_db', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});

db.authenticate()
  .then(async () => {
    const [results] = await db.query('SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA="funeral_db" ORDER BY TABLE_NAME');
    console.log('\n✓ Database Tables Summary\n');
    console.log(`Total tables: ${results.length}\n`);
    results.forEach(r => console.log(`  ✓ ${r.TABLE_NAME}`));
    console.log('\n');
    process.exit(0);
  })
  .catch(e => {
    console.log('Error:', e.message);
    process.exit(1);
  });

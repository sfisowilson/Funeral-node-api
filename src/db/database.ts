
import { Sequelize } from 'sequelize';
import { dbConfig } from '../config/config';

const { host, user, password, database } = dbConfig;

const sequelize = new Sequelize(
  database,
  user,
  password,
  {
    host: host,
    dialect: 'mysql'
  }
);

export const createDatabaseIfNotExists = async () => {
  const tempSequelize = new Sequelize('', user, password, { host, dialect: 'mysql' });
  try {
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log('Database created or already exists.');
  } catch (error) {
    console.error('Error creating the database:', error);
  } finally {
    await tempSequelize.close();
  }
};

export const connectToDatabase = async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default sequelize;

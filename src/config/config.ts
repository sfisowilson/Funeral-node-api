
export const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'funeral_db'
};

// Use environment variable for base domain, fallback to localhost for dev
export const baseDomain = process.env.BASE_DOMAIN || 'localhost';

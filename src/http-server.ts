console.log('Starting HTTP server...');
require('dotenv').config();
import http from 'http';
const app = require('./index');

const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () => {
  console.log(`✅ HTTP API Server running on http://localhost:${port}`);
});

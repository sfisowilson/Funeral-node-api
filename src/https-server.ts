console.log('Starting HTTPS server...');
import fs from 'fs';
import path from 'path';
import https from 'https';
const app = require('./index');

const port = process.env.PORT || 3000;
const sslKeyPath = process.env.SSL_KEY_PATH || path.join(__dirname, '../certs/key.pem');
const sslCertPath = process.env.SSL_CERT_PATH || path.join(__dirname, '../certs/cert.pem');

const options = {
  key: fs.readFileSync(sslKeyPath),
  cert: fs.readFileSync(sslCertPath)
};

https.createServer(options, app).listen(port, () => {
  console.log(`✅ HTTPS API Server running on https://localhost:${port}`);
});

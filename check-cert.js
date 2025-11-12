#!/usr/bin/env node
/**
 * Check certificate information
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certDir = path.join(__dirname, 'certs');
const certFile = path.join(certDir, 'cert.pem');
const keyFile = path.join(certDir, 'key.pem');

console.log('🔐 Certificate Status Check\n');

// Check if files exist
if (!fs.existsSync(certFile)) {
  console.log('❌ Certificate file not found:', certFile);
} else {
  console.log('✅ Certificate file exists:', certFile);
}

if (!fs.existsSync(keyFile)) {
  console.log('❌ Key file not found:', keyFile);
} else {
  console.log('✅ Key file exists:', keyFile);
}

console.log('\n📋 Certificate Information:\n');

try {
  // Try to display certificate info using node-forge
  try {
    const forge = require('node-forge');
    const pem = fs.readFileSync(certFile, 'utf8');
    const cert = forge.pki.certificateFromPem(pem);
    
    console.log(`Subject: ${JSON.stringify(cert.subject.attributes, null, 2)}`);
    console.log(`Issuer: ${JSON.stringify(cert.issuer.attributes, null, 2)}`);
    console.log(`Valid From: ${cert.validity.notBefore}`);
    console.log(`Valid Until: ${cert.validity.notAfter}`);
    console.log(`Serial: ${cert.serialNumber}`);
    
  } catch (forgeError) {
    console.log('(node-forge not available for detailed info)');
    
    // Try OpenSSL if available (on WSL or Git Bash)
    try {
      const output = execSync(`wsl openssl x509 -in "${certFile}" -text -noout`, { encoding: 'utf8' });
      const lines = output.split('\n').filter(line => 
        line.includes('Subject:') || 
        line.includes('Issuer:') || 
        line.includes('Not Before:') ||
        line.includes('Not After:')
      );
      lines.forEach(line => console.log(line.trim()));
    } catch (opensslError) {
      console.log('Certificate file size:', fs.statSync(certFile).size, 'bytes');
      console.log('Key file size:', fs.statSync(keyFile).size, 'bytes');
    }
  }
  
} catch (error) {
  console.log('Error reading certificate:', error.message);
}

console.log('\n💡 To generate trusted certificates:');
console.log('   Install mkcert: winget install FiloSottile.mkcert');
console.log('   Then run: mkcert -install');
console.log('   Then run: mkcert -key-file certs/key.pem -cert-file certs/cert.pem localhost 127.0.0.1');
console.log('\n📖 See HTTPS_CERTIFICATE_SOLUTIONS.md for full details\n');

#!/usr/bin/env node
/**
 * Generate self-signed SSL certificates for development
 * Uses Node.js crypto module (no external dependencies)
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function generateCertificates() {
  console.log('🔐 Generating self-signed certificates...\n');

  const certDir = path.join(__dirname, 'certs');
  const keyFile = path.join(certDir, 'key.pem');
  const certFile = path.join(certDir, 'cert.pem');

  // Create certs directory if it doesn't exist
  if (!fs.existsSync(certDir)) {
    console.log(`📁 Creating ${certDir} directory...`);
    fs.mkdirSync(certDir, { recursive: true });
  }

  // Check if certificates already exist
  if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    console.log('⚠️  Certificates already exist:');
    console.log(`   - ${keyFile}`);
    console.log(`   - ${certFile}`);
    console.log('\nSkipping generation. Delete the files to regenerate.\n');
    return;
  }

  try {
    // Try using the 'pem' library if available
    try {
      const pem = require('pem');
      console.log('📦 Using pem library to generate certificates...\n');
      
      const promisifiedCreateCertificate = (options) => {
        return new Promise((resolve, reject) => {
          pem.createCertificate(options, (err, keys) => {
            if (err) reject(err);
            else resolve(keys);
          });
        });
      };

      const keys = await promisifiedCreateCertificate({
        days: 365,
        selfSigned: true,
        commonName: 'localhost',
        altNames: ['localhost', '127.0.0.1', '::1']
      });

      // Write files
      fs.writeFileSync(keyFile, keys.serviceKey);
      fs.writeFileSync(certFile, keys.certificate);

      console.log('✅ Certificate generated successfully!\n');
      console.log('📄 Certificate details:');
      console.log(`   Valid for: 365 days`);
      console.log(`   Subject: CN=localhost`);
      console.log(`   SANs: localhost, 127.0.0.1, ::1\n`);
      console.log('📂 Files created:');
      console.log(`   - ${keyFile}`);
      console.log(`   - ${certFile}\n`);

    } catch (pemError) {
      // Fallback: Try using mkcert if available
      console.log('📦 pem library not available, trying mkcert...\n');
      
      try {
        await execAsync('mkcert --version');
        console.log('✅ Found mkcert, generating certificate...\n');
        
        // Create certificate with mkcert
        await execAsync(`mkcert -key-file "${keyFile}" -cert-file "${certFile}" localhost 127.0.0.1 ::1`);
        
        console.log('✅ Certificate generated successfully with mkcert!\n');
        console.log('📂 Files created:');
        console.log(`   - ${keyFile}`);
        console.log(`   - ${certFile}\n`);

      } catch (mkcertError) {
        // Fallback: Try PowerShell command
        console.log('📦 mkcert not available, trying PowerShell...\n');
        
        // This would use the New-SelfSignedCertificate PowerShell cmdlet
        console.log('ℹ️  Run this PowerShell command as Administrator:\n');
        console.log(`$cert = New-SelfSignedCertificate -DnsName localhost, 127.0.0.1 -CertStoreLocation "cert:\\CurrentUser\\My" -FriendlyName "localhost" -NotAfter (Get-Date).AddYears(1)`);
        console.log(`$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText`);
        console.log(`Export-PfxCertificate -Cert $cert -FilePath "certs\\localhost.pfx" -Password $pwd`);
        console.log(`$cert | Export-Certificate -FilePath "certs\\cert.pem" -Type CERT`);
        console.log(`\nOr visit: https://github.com/FiloSottile/mkcert/releases to install mkcert\n`);
        
        throw new Error('No certificate generation tools available');
      }
    }

  } catch (error) {
    console.error('❌ Error generating certificate:', error.message);
    console.log('\n⚠️  Browser Trust Warning:');
    console.log('   If you see "ERR_CERT_AUTHORITY_INVALID", do one of:');
    console.log('   1. Click Advanced → "Proceed anyway"');
    console.log('   2. Type "thisisunsafe" in Chrome to bypass');
    console.log('   3. Install mkcert for trusted certificates');
    console.log('   4. Use PowerShell to generate a trusted cert\n');
    process.exit(1);
  }
}

// Run the function
generateCertificates().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

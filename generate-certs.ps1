# PowerShell script to generate self-signed HTTPS certificates for development

$certPath = "certs"
$certName = "localhost"
$certFile = Join-Path $certPath "cert.pem"
$keyFile = Join-Path $certPath "key.pem"

# Create certs directory if it doesn't exist
if (-not (Test-Path $certPath)) {
    Write-Host "Creating $certPath directory..."
    New-Item -ItemType Directory -Path $certPath | Out-Null
}

# Check if certificates already exist
if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
    Write-Host "⚠️  Certificates already exist at:"
    Write-Host "   - $certFile"
    Write-Host "   - $keyFile"
    $response = Read-Host "Regenerate certificates? (y/n)"
    if ($response -ne 'y') {
        Write-Host "Skipping certificate generation"
        exit 0
    }
}

Write-Host "🔐 Generating self-signed certificate for $certName..."

# Generate private key and certificate valid for 365 days
# Using OpenSSL if available, otherwise show instructions
$opensslPath = Get-Command openssl -ErrorAction SilentlyContinue

if ($opensslPath) {
    Write-Host "✅ Found OpenSSL at: $($opensslPath.Source)"
    Write-Host "Generating certificate..."
    
    # Generate with Subject Alternative Names for both localhost and 127.0.0.1
    openssl req -x509 -newkey rsa:2048 -nodes -keyout $keyFile -out $certFile -days 365 `
        -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=Funeral/CN=$certName" `
        -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1,IP:::1"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Certificate generated successfully!"
        Write-Host ""
        Write-Host "Certificate details:"
        openssl x509 -in $certFile -text -noout | Select-String "Subject:|Issuer:|Not Before|Not After|DNS:" | ForEach-Object { Write-Host "   $_" }
        Write-Host ""
        Write-Host "Files created:"
        Write-Host "   - $certFile"
        Write-Host "   - $keyFile"
        Write-Host ""
        Write-Host "⚠️  Browser Trust Warning:"
        Write-Host "   This is a self-signed certificate. When you first load the app:"
        Write-Host "   1. Browser will show 'Not Secure' warning"
        Write-Host "   2. Click 'Advanced' or similar option"
        Write-Host "   3. Click 'Proceed to localhost' or 'Continue anyway'"
        Write-Host "   OR in Chrome: Type 'thisisunsafe' to bypass the warning"
        Write-Host ""
        Write-Host "✅ To install in Windows Trusted Root (optional):"
        Write-Host "   Run as Administrator:"
        Write-Host "   certutil -addstore -f ""Root"" $certFile"
    }
    else {
        Write-Host "❌ Failed to generate certificate with OpenSSL"
        exit 1
    }
}
else {
    Write-Host "❌ OpenSSL not found!"
    Write-Host ""
    Write-Host "To install OpenSSL, choose one of these options:"
    Write-Host ""
    Write-Host "Option 1: Git Bash (if you have Git installed)"
    Write-Host "   - Git includes OpenSSL"
    Write-Host "   - Run from Git Bash or configure Git Bash's openssl in PATH"
    Write-Host ""
    Write-Host "Option 2: Windows Subsystem for Linux (WSL)"
    Write-Host "   wsl apt-get update"
    Write-Host "   wsl apt-get install openssl"
    Write-Host ""
    Write-Host "Option 3: Use pre-built OpenSSL binaries"
    Write-Host "   Download from: https://slproweb.com/products/Win32OpenSSL.html"
    Write-Host "   Or: https://github.com/openssl/openssl/releases"
    Write-Host ""
    Write-Host "Option 4: Use Node.js crypto module (alternative)"
    Write-Host "   Install node-forge: npm install -g node-forge"
    Write-Host "   Then modify this script to use Node.js for certificate generation"
    Write-Host ""
    Write-Host "For now, here's how to manually generate with OpenSSL:"
    Write-Host "   openssl req -x509 -newkey rsa:2048 -nodes -keyout certs/key.pem -out certs/cert.pem -days 365 -subj '/CN=localhost'"
    exit 1
}

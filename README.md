# Funeral Management System - Node.js Backend API

Enterprise-grade REST API for the Funeral Management System built with Express.js, Sequelize ORM, and MySQL.

## Features

- **Multi-tenant Architecture**: Subdomain-based tenant isolation with X-Tenant-ID header support
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **File Management**: Upload and download with tenant scoping and size limits (50MB)
- **Swagger Documentation**: Auto-generated API documentation
- **Database Migrations**: Sequelize-based schema management
- **CORS Support**: Configurable cross-origin requests
- **HTTPS Ready**: Production SSL/TLS certificate support

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **MySQL**: v8.0 or higher
- **npm**: v10.0.0 or higher
- **PM2**: For production process management (optional)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sfisowilson/Funeral-node-api.git
cd Funeral-node-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=funeral_user
DB_PASSWORD=your_secure_password
DB_NAME=funeral_db

# API
API_PORT=3000
API_URL=https://mizo.co.za
NODE_ENV=production

# JWT
JWT_SECRET=your_32_character_secret_key_here

# File Upload
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=https://mizo.co.za
```

### 4. Database Setup

Create the MySQL database and run migrations:

```bash
# Create database (run in MySQL)
CREATE DATABASE funeral_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user and grant permissions
CREATE USER 'funeral_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON funeral_db.* TO 'funeral_user'@'localhost';
FLUSH PRIVILEGES;

# Run Sequelize sync
npm run db:sync
```

## Development

### Start Development Server

```bash
npm run start
```

Server will run on `http://localhost:3000` with hot reload via nodemon.

### Swagger API Documentation

Access the interactive API docs at: `http://localhost:3000/api-docs`

## Production Deployment

### 1. Start with PM2

```bash
pm2 start npm --name "mizo-api" -- start
```

### 2. Enable Auto-restart on Reboot

```bash
pm2 startup systemd -u root --hp /root
pm2 save
```

### 3. Monitor Processes

```bash
pm2 logs mizo-api          # View logs
pm2 status                 # List processes
pm2 restart mizo-api       # Restart
pm2 stop mizo-api          # Stop
```

### 4. Nginx Configuration

The API is served behind Nginx reverse proxy on port 3000:

```nginx
upstream mizo_backend {
    server 127.0.0.1:3000;
}

server {
    listen 443 ssl http2;
    server_name *.mizo.co.za mizo.co.za;
    
    ssl_certificate /etc/letsencrypt/live/mizo.co.za/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mizo.co.za/privkey.pem;
    
    client_max_body_size 50M;
    
    location / {
        proxy_pass http://mizo_backend;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh authentication token

### File Upload
- `POST /api/FileUpload/File_UploadFile` - Upload file (requires JWT)
- `GET /api/FileUpload/File_DownloadFile/:id` - Download file (public)

### Dashboard Widgets
- `GET /api/DashboardWidget` - List widgets
- `POST /api/DashboardWidget` - Create widget
- `PUT /api/DashboardWidget/:id` - Update widget
- `DELETE /api/DashboardWidget/:id` - Delete widget

### Tenant Settings
- `GET /api/TenantSettings` - Get tenant configuration
- `POST /api/TenantSettings` - Create tenant settings
- `PUT /api/TenantSettings/:id` - Update tenant settings

See `/src/swagger.ts` for complete OpenAPI specification.

## Project Structure

```
Funeral-node-api/
├── src/
│   ├── controllers/         # Express route handlers
│   ├── models/              # Sequelize data models
│   ├── services/            # Business logic
│   ├── middleware/          # Express middleware (auth, tenant, etc.)
│   ├── interfaces/          # TypeScript interfaces
│   ├── db/
│   │   ├── config.ts        # Database connection
│   │   ├── migrations.ts    # Schema migrations
│   │   └── sync.ts          # Schema sync utility
│   ├── https-server.ts      # Main Express server entry point
│   └── swagger.ts           # Swagger/OpenAPI configuration
├── uploads/                 # File upload storage (tenant-scoped)
├── .env                     # Environment configuration (not in git)
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## Multi-Tenancy

### Tenant Identification

Tenants are identified via:

1. **Subdomain** (Primary): `tenant-name.mizo.co.za`
2. **X-Tenant-ID Header** (Fallback): `X-Tenant-ID: tenant-name`

### Tenant-Scoped Operations

- File uploads are stored in `uploads/{tenantId}/` directories
- Database queries filter by `tenantId`
- API responses include only tenant-specific data

### Adding a New Tenant

1. Create DNS A record in Cloudflare: `tenant-name.mizo.co.za → 102.211.206.197`
2. User registers via landing page or API
3. Tenant data automatically isolated in database
4. Files uploaded to tenant-specific directory

## Database Schema

Key tables:
- `users` - User accounts with tenant association
- `dashboard_widgets` - Landing page widget configurations
- `file_uploads` - File metadata with tenant scoping
- `tenant_settings` - Tenant-specific configuration

Run `npm run db:sync` to create or update tables automatically.

## Security

- ✅ JWT Bearer token authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS configured for production domain
- ✅ File upload size limit (50MB)
- ✅ File type validation (images, documents)
- ✅ Tenant isolation at middleware level
- ✅ HTTPS/TLS with Let's Encrypt certificates

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL is running and credentials in `.env` are correct.

```bash
# Linux
sudo systemctl status mysql

# Or check if server is accessible
mysql -h localhost -u funeral_user -p
```

### JWT Token Issues

```
Error: invalid signature / jwt malformed
```

**Solution**: Ensure JWT_SECRET in `.env` matches the value used during token generation.

### Port 3000 Already in Use

```bash
# Find and kill process using port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run start
```

### File Upload Permission Denied

```bash
# Ensure uploads directory exists and is writable
sudo mkdir -p /var/www/mizo-api/uploads
sudo chown -R node:node /var/www/mizo-api/uploads
sudo chmod -R 755 /var/www/mizo-api/uploads
```

## Performance Optimization

- Enable database query caching
- Use connection pooling (Sequelize default: 5 connections)
- Compress API responses with gzip
- Implement request rate limiting
- Use CDN for static file delivery

## Monitoring

### PM2 Monitoring Dashboard

```bash
pm2 monit              # Real-time monitoring
pm2 web                # Web dashboard on port 9615
```

### Log Analysis

```bash
pm2 logs mizo-api --lines 100      # Last 100 lines
pm2 logs mizo-api --err            # Error logs only
pm2 flush                          # Clear all logs
```

## Deployment Checklist

- [ ] Environment variables configured in `.env`
- [ ] Database created and migrated
- [ ] HTTPS certificates installed (`/etc/letsencrypt/live/mizo.co.za/`)
- [ ] Nginx reverse proxy configured
- [ ] PM2 process started and saved
- [ ] SSL auto-renewal scheduled (Let's Encrypt)
- [ ] Backup strategy implemented
- [ ] Monitoring and alerting configured

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## License

ISC

## Support

For issues, questions, or contributions, please open an issue on GitHub:
https://github.com/sfisowilson/Funeral-node-api/issues

## Environment (Production)

- **Hosting**: Absolute Hosting VPS (CentOS/RHEL)
- **VPS IP**: 102.211.206.197
- **Domain**: mizo.co.za
- **SSL**: Let's Encrypt (auto-renewing)
- **Reverse Proxy**: Nginx
- **Process Manager**: PM2
- **Node Version**: 20.x LTS
- **Database**: MySQL 8.0+

---

**Last Updated**: November 12, 2025

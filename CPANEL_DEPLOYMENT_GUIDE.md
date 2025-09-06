# CinePrivé - cPanel Deployment Guide

## Table of Contents
1. [Pre-deployment Requirements](#pre-deployment-requirements)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [File Structure & Upload](#file-structure--upload)
5. [Node.js Application Setup](#nodejs-application-setup)
6. [SSL Configuration](#ssl-configuration)
7. [Domain & DNS Configuration](#domain--dns-configuration)
8. [Environment Variables](#environment-variables)
9. [Production Build Process](#production-build-process)
10. [Deployment Steps](#deployment-steps)
11. [Post-deployment Verification](#post-deployment-verification)
12. [Maintenance & Updates](#maintenance--updates)
13. [Troubleshooting](#troubleshooting)

---

## Pre-deployment Requirements

### Server Requirements
- **Node.js**: Version 20.x or higher
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 5GB available space
- **cPanel Version**: Latest version with Node.js support
- **Database**: PostgreSQL 13+ or MySQL 8.0+

### Domain & Hosting
- Registered domain name
- cPanel hosting account with Node.js support
- SSL certificate (Let's Encrypt or commercial)
- Database access privileges

### Required Tools
- FTP/SFTP client (FileZilla, WinSCP)
- Text editor for configuration files
- Terminal access (if available)

---

## Environment Setup

### 1. Enable Node.js in cPanel
```bash
# Navigate to cPanel → Software → Node.js
# Create new Node.js app:
Node.js Version: 20.x
Application Mode: Production
Application Root: /public_html/cineprive
Application URL: privcelebrations.com
```

### 2. Required Environment Variables
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/cineprive_db
WHATSAPP_BUSINESS_NUMBER=+1234567890
SESSION_SECRET=your-super-secure-session-secret-here
DOMAIN=https://privcelebrations.com
```

---

## Database Configuration

### PostgreSQL Setup (Recommended)
```sql
-- Create database
CREATE DATABASE cineprive_db;

-- Create user
CREATE USER cineprive_user WITH ENCRYPTED PASSWORD 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cineprive_db TO cineprive_user;
GRANT ALL ON SCHEMA public TO cineprive_user;

-- Enable required extensions
\c cineprive_db;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### MySQL Alternative Setup
```sql
-- Create database
CREATE DATABASE cineprive_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'cineprive_user'@'localhost' IDENTIFIED BY 'secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON cineprive_db.* TO 'cineprive_user'@'localhost';
FLUSH PRIVILEGES;
```

### Database Schema Migration
```bash
# Run after deployment
npm run db:push
```

---

## File Structure & Upload

### Project Structure for cPanel
```
/public_html/cineprive/
├── dist/                     # Built application files
│   ├── client/              # Frontend build
│   └── server/              # Backend build
├── node_modules/            # Dependencies (auto-installed)
├── package.json             # Dependencies & scripts
├── package-lock.json        # Locked dependencies
├── .env                     # Environment variables
├── startup.js               # Application entry point
└── .htaccess               # Apache configuration
```

### Required Files for Upload
1. **Built application** (`dist/` folder)
2. **Package files** (`package.json`, `package-lock.json`)
3. **Environment configuration** (`.env`)
4. **Server startup** (`startup.js`)
5. **Web server config** (`.htaccess`)

---

## Node.js Application Setup

### 1. Create startup.js
```javascript
// startup.js - Application entry point for cPanel
const { spawn } = require('child_process');
const path = require('path');

const startApp = () => {
  const appPath = path.join(__dirname, 'dist', 'index.js');
  
  const app = spawn('node', [appPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: process.env.PORT || 3000
    }
  });

  app.on('error', (err) => {
    console.error('Failed to start application:', err);
    process.exit(1);
  });

  app.on('close', (code) => {
    console.log(`Application exited with code ${code}`);
    if (code !== 0) {
      setTimeout(startApp, 5000); // Restart after 5 seconds
    }
  });
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startApp();
```

### 2. Update package.json for Production
```json
{
  "name": "cineprive-production",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node startup.js",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "db:push": "drizzle-kit push",
    "postinstall": "npm run build"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

---

## SSL Configuration

### 1. Let's Encrypt SSL (Free)
```bash
# In cPanel → Security → SSL/TLS → Let's Encrypt
# Enable for:
# - Main domain: privcelebrations.com
# - Subdomain: www.privcelebrations.com
```

### 2. Force HTTPS Redirect
```apache
# .htaccess file
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Node.js app proxy
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:"
```

---

## Domain & DNS Configuration

### DNS Records Setup
```dns
# A Record
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600

# CNAME Record (www)
Type: CNAME
Name: www
Value: privcelebrations.com
TTL: 3600

# MX Record (if email needed)
Type: MX
Name: @
Value: mail.privcelebrations.com
Priority: 10
TTL: 3600
```

### Subdomain Configuration
```bash
# Main domain configuration in cPanel
Domain: privcelebrations.com
Document Root: /public_html/privcelebrations/dist/client
```

---

## Environment Variables

### Production .env File
```bash
# Application
NODE_ENV=production
PORT=3000
DOMAIN=https://privcelebrations.com

# Database
DATABASE_URL=postgresql://cineprive_user:secure_password@localhost:5432/cineprive_db

# Session Security
SESSION_SECRET=your-super-secure-32-character-secret-key-here

# WhatsApp Integration
WHATSAPP_BUSINESS_NUMBER=+1234567890

# Security
CORS_ORIGIN=https://privcelebrations.com
TRUST_PROXY=true

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/cineprive/app.log

# Performance
MAX_CONNECTIONS=100
REQUEST_TIMEOUT=30000
```

---

## Production Build Process

### Local Build Commands
```bash
# 1. Install dependencies
npm ci --production=false

# 2. Build application
npm run build

# 3. Create deployment package
tar -czf cineprive-deploy.tar.gz dist/ package.json package-lock.json startup.js .htaccess

# 4. Upload to server
# Use FTP/SFTP to upload cineprive-deploy.tar.gz
```

### Server Setup Commands
```bash
# 1. Extract deployment package
cd /public_html/cineprive
tar -xzf cineprive-deploy.tar.gz

# 2. Install production dependencies
npm ci --production

# 3. Set permissions
chmod 755 startup.js
chmod 644 .htaccess
chown -R username:username /public_html/cineprive

# 4. Run database migrations
npm run db:push
```

---

## Deployment Steps

### Step 1: Prepare Local Environment
```bash
# Build production version
npm run build

# Test production build locally
NODE_ENV=production npm start
```

### Step 2: Upload Files
```bash
# Create deployment archive
tar -czf deploy.tar.gz dist/ package.json package-lock.json startup.js .htaccess .env

# Upload via FTP/SFTP to /public_html/cineprive/
```

### Step 3: Server Configuration
```bash
# Extract files
tar -xzf deploy.tar.gz

# Install dependencies
npm ci --production

# Set file permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
chmod 755 startup.js
```

### Step 4: Database Setup
```bash
# Run migrations
npm run db:push

# Verify database connection
node -e "console.log('Testing DB connection...'); process.exit(0);"
```

### Step 5: Start Application
```bash
# Start via cPanel Node.js interface or manually
node startup.js

# Verify process is running
ps aux | grep node
```

---

## Post-deployment Verification

### Health Check Endpoints
```bash
# Test application endpoints
curl -I https://privcelebrations.com/
curl -I https://privcelebrations.com/api/theatres
curl -I https://privcelebrations.com/api/packages

# Expected responses: HTTP 200 OK
```

### Performance Testing
```bash
# Load testing with curl
for i in {1..10}; do
  curl -w "%{time_total}\n" -o /dev/null -s https://privcelebrations.com/
done

# Database connection test
curl https://privcelebrations.com/api/theatres
```

### Security Verification
```bash
# SSL certificate check
openssl s_client -connect privcelebrations.com:443 -servername privcelebrations.com

# Security headers check
curl -I https://privcelebrations.com/
```

---

## Maintenance & Updates

### Regular Maintenance Tasks
```bash
# Weekly tasks
1. Check application logs
2. Monitor disk usage
3. Update SSL certificates (auto-renewal)
4. Database backup
5. Performance monitoring

# Monthly tasks
1. Security updates
2. Dependency updates
3. Database optimization
4. Log rotation
```

### Update Deployment Process
```bash
# 1. Build new version locally
npm run build

# 2. Create backup of current deployment
cp -r /public_html/cineprive /backup/cineprive-$(date +%Y%m%d)

# 3. Upload new build
# Replace dist/ folder with new build

# 4. Restart application
# Via cPanel Node.js interface

# 5. Verify deployment
curl -I https://privcelebrations.com/
```

### Database Backup Strategy
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump cineprive_db > /backup/db/cineprive_backup_$DATE.sql
gzip /backup/db/cineprive_backup_$DATE.sql

# Keep only last 7 days
find /backup/db/ -name "cineprive_backup_*.sql.gz" -mtime +7 -delete
```

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Application Won't Start
```bash
# Check Node.js version
node --version  # Should be 20.x+

# Check startup script
node startup.js  # Run manually to see errors

# Check file permissions
ls -la startup.js  # Should be 755

# Check environment variables
cat .env  # Verify all required vars are set
```

#### 2. Database Connection Issues
```bash
# Test database connection
psql -h localhost -U cineprive_user -d cineprive_db

# Check database URL format
echo $DATABASE_URL

# Verify database exists
psql -l | grep cineprive
```

#### 3. 502 Bad Gateway Error
```bash
# Check if Node.js app is running
ps aux | grep node

# Check port configuration
netstat -tlnp | grep 3000

# Restart application
pkill -f startup.js
node startup.js &
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
openssl x509 -in /path/to/cert.pem -text -noout

# Renew Let's Encrypt certificate
# Via cPanel SSL/TLS interface

# Force HTTPS redirect check
curl -I http://privcelebrations.com/
```

#### 5. Performance Issues
```bash
# Check memory usage
free -h

# Check disk space
df -h

# Monitor application logs
tail -f /var/log/cineprive/app.log

# Database performance
# Run EXPLAIN ANALYZE on slow queries
```

### Log Monitoring
```bash
# Application logs
tail -f logs/app.log

# Error logs
tail -f logs/error.log

# Access logs
tail -f /var/log/apache2/access.log

# System logs
tail -f /var/log/syslog
```

### Emergency Procedures
```bash
# Quick restart
pkill -f startup.js && node startup.js &

# Rollback to previous version
cp -r /backup/cineprive-YYYYMMDD/* /public_html/cineprive/

# Database restore
psql cineprive_db < /backup/db/cineprive_backup_YYYYMMDD.sql

# Emergency maintenance mode
# Create maintenance.html in document root
```

---

## Security Considerations

### File Permissions
```bash
# Set secure permissions
find /public_html/cineprive -type f -exec chmod 644 {} \;
find /public_html/cineprive -type d -exec chmod 755 {} \;
chmod 600 .env
chmod 755 startup.js
```

### Firewall Configuration
```bash
# Allow only necessary ports
# 80 (HTTP) - redirect to HTTPS
# 443 (HTTPS) - main application
# 22 (SSH) - administrative access
# Database port - localhost only
```

### Regular Security Updates
```bash
# Update Node.js dependencies
npm audit
npm update

# System updates (if root access available)
apt update && apt upgrade  # Ubuntu/Debian
yum update                 # CentOS/RHEL
```

---

## Performance Optimization

### Caching Strategy
```javascript
// Add to server configuration
app.use(express.static('dist/client', {
  maxAge: '1d',  // Cache static assets for 1 day
  etag: true,
  lastModified: true
}));
```

### Database Optimization
```sql
-- Add indexes for better performance
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_theatre ON bookings(theatre_id);
CREATE INDEX idx_bookings_status ON bookings(status);
```

### CDN Configuration
```bash
# Consider using CDN for static assets
# Cloudflare, AWS CloudFront, or similar
# Configure caching rules for:
# - Images: Cache for 30 days
# - CSS/JS: Cache for 7 days
# - HTML: Cache for 1 hour
```

---

## Monitoring & Analytics

### Application Monitoring
```javascript
// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

### Log Analysis
```bash
# Setup log rotation
# /etc/logrotate.d/cineprive
/var/log/cineprive/*.log {
  daily
  missingok
  rotate 30
  compress
  delaycompress
  notifempty
  create 644 www-data www-data
}
```

---

## Contact & Support

### Technical Support Contacts
- **Hosting Provider**: Your cPanel hosting support
- **Domain Registrar**: Your domain provider support
- **SSL Certificate**: Let's Encrypt or certificate provider
- **Database**: PostgreSQL or MySQL support documentation

### Documentation Resources
- [Node.js Official Docs](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [cPanel Documentation](https://docs.cpanel.net/)
- [Let's Encrypt Docs](https://letsencrypt.org/docs/)

---

## Appendix

### Sample Configuration Files

#### nginx.conf (if available)
```nginx
server {
    listen 80;
    server_name privcelebrations.com www.privcelebrations.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name privcelebrations.com www.privcelebrations.com;
    
    ssl_certificate /path/to/certificate.pem;
    ssl_certificate_key /path/to/private_key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### pm2.config.js (Alternative Process Manager)
```javascript
module.exports = {
  apps: [{
    name: 'cineprive',
    script: 'startup.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

---

*This deployment guide ensures a production-ready deployment of the CinePrivé application on cPanel hosting. Follow each section carefully and test thoroughly before going live.*
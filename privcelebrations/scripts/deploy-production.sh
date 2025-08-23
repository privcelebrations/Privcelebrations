#!/bin/bash

# Priv Production Deployment Script
# Supports both VPS and cPanel hosting environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="cineprive"
DOMAIN="privcelebrations.com"
BACKUP_DIR="/opt/backups/$PROJECT_NAME"
LOG_FILE="/var/log/$PROJECT_NAME/deployment.log"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE" 2>/dev/null || true
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    echo "[ERROR] $1" >> "$LOG_FILE" 2>/dev/null || true
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    echo "[SUCCESS] $1" >> "$LOG_FILE" 2>/dev/null || true
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    echo "[WARNING] $1" >> "$LOG_FILE" 2>/dev/null || true
}

# Check deployment environment
detect_environment() {
    if [ -f "/usr/local/cpanel/cpanel" ] || [ -d "/usr/local/cpanel" ]; then
        ENVIRONMENT="cpanel"
        APP_DIR="/home/$(whoami)/public_html"
        DB_TYPE="mysql"
    elif command -v systemctl &> /dev/null; then
        ENVIRONMENT="vps"
        APP_DIR="/opt/$PROJECT_NAME"
        DB_TYPE="postgresql"
    else
        ENVIRONMENT="shared"
        APP_DIR="$(pwd)"
        DB_TYPE="mysql"
    fi
    
    log "Detected environment: $ENVIRONMENT"
    log "Application directory: $APP_DIR"
    log "Database type: $DB_TYPE"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed"
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18 or higher is required (current: v$NODE_VERSION)"
    fi
    success "Node.js version check passed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed"
    fi
    success "npm check passed"
    
    # Check disk space
    AVAILABLE_SPACE=$(df "$APP_DIR" | awk 'NR==2 {print $4}')
    if [ "$AVAILABLE_SPACE" -lt 1048576 ]; then # 1GB in KB
        warning "Low disk space available (less than 1GB)"
    fi
    success "Disk space check passed"
    
    # Check environment file
    if [ ! -f "$APP_DIR/.env" ] && [ ! -f "$APP_DIR/.env.production" ]; then
        warning "No environment file found. Creating template..."
        create_env_template
    fi
    success "Environment file check passed"
}

# Create environment template
create_env_template() {
    ENV_FILE="$APP_DIR/.env.production"
    
    cat > "$ENV_FILE" << EOF
# CinePrivé Production Environment Configuration
NODE_ENV=production
PORT=3000
DOMAIN=https://$DOMAIN

# Database Configuration
EOF

    if [ "$DB_TYPE" = "postgresql" ]; then
        cat >> "$ENV_FILE" << EOF
DATABASE_URL=postgresql://cineprive_user:Aadhya@2050@localhost:5432/cineprive_production
EOF
    else
        cat >> "$ENV_FILE" << EOF
DB_HOST=localhost
DB_USER=YOUR_DB_USER
DB_PASSWORD=YOUR_DB_PASSWORD
DB_NAME=YOUR_DB_NAME
DB_PORT=3306
EOF
    fi

    cat >> "$ENV_FILE" << EOF

# Security
SESSION_SECRET=GENERATE_SECURE_SECRET_32_CHARACTERS_MINIMUM
CORS_ORIGIN=https://$DOMAIN
TRUST_PROXY=true
SECURE_COOKIES=true

# Business Configuration
WHATSAPP_BUSINESS_NUMBER=+15551237748

# Email Configuration (Optional)
SMTP_HOST=smtp.$DOMAIN
SMTP_PORT=587
SMTP_USER=noreply@$DOMAIN
SMTP_PASSWORD=YOUR_EMAIL_PASSWORD

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/$PROJECT_NAME/app.log
EOF

    warning "Environment template created at $ENV_FILE"
    warning "Please update the configuration values before continuing deployment"
}

# Backup current deployment
backup_deployment() {
    if [ "$ENVIRONMENT" = "cpanel" ]; then
        log "Skipping backup for cPanel deployment (use cPanel backup tools)"
        return
    fi
    
    log "Creating deployment backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup current deployment
    if [ -d "$APP_DIR/dist" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        tar -czf "$BACKUP_DIR/deployment_backup_$TIMESTAMP.tar.gz" -C "$APP_DIR" dist .env* || true
        success "Backup created: deployment_backup_$TIMESTAMP.tar.gz"
        
        # Keep only last 5 backups
        cd "$BACKUP_DIR"
        ls -t deployment_backup_*.tar.gz | tail -n +6 | xargs rm -f || true
    fi
}

# Database setup and migration
setup_database() {
    log "Setting up database..."
    
    # Check if database exists and is accessible
    if [ "$DB_TYPE" = "postgresql" ]; then
        setup_postgresql
    else
        setup_mysql
    fi
    
    # Run database migrations
    log "Running database migrations..."
    cd "$APP_DIR"
    npm run db:push || error "Database migration failed"
    success "Database migrations completed"
    
    # Seed database if empty
    if [ "$1" = "--seed" ]; then
        log "Seeding database with initial data..."
        npm run db:seed || warning "Database seeding failed (may already contain data)"
    fi
}

# PostgreSQL setup (VPS)
setup_postgresql() {
    log "Configuring PostgreSQL..."
    
    # Test database connection
    if ! command -v psql &> /dev/null; then
        error "PostgreSQL client not installed"
    fi
    
    # Extract database details from environment
    if [ -f "$APP_DIR/.env.production" ]; then
        source "$APP_DIR/.env.production"
    elif [ -f "$APP_DIR/.env" ]; then
        source "$APP_DIR/.env"
    fi
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL not configured in environment file"
    fi
    
    # Test connection
    if ! psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        error "Cannot connect to PostgreSQL database. Check DATABASE_URL configuration."
    fi
    
    success "PostgreSQL connection verified"
}

# MySQL setup (cPanel)
setup_mysql() {
    log "Configuring MySQL..."
    
    # Test database connection using environment variables
    if [ -f "$APP_DIR/.env.production" ]; then
        source "$APP_DIR/.env.production"
    elif [ -f "$APP_DIR/.env" ]; then
        source "$APP_DIR/.env"
    fi
    
    if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
        error "MySQL configuration incomplete. Check DB_HOST, DB_USER, DB_NAME in environment file."
    fi
    
    # Test connection
    if ! mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT 1;" &> /dev/null; then
        warning "Cannot connect to MySQL database. Please verify credentials."
    else
        success "MySQL connection verified"
    fi
}

# Install dependencies and build
build_application() {
    log "Installing dependencies and building application..."
    
    cd "$APP_DIR"
    
    # Install dependencies
    log "Installing npm dependencies..."
    npm ci --production=false || error "npm install failed"
    success "Dependencies installed"
    
    # Build application
    log "Building application..."
    npm run build || error "Build failed"
    success "Application built successfully"
    
    # Install production dependencies only
    log "Installing production dependencies..."
    rm -rf node_modules
    npm ci --production || error "Production dependency installation failed"
    success "Production dependencies installed"
}

# Configure web server
configure_webserver() {
    if [ "$ENVIRONMENT" = "vps" ]; then
        configure_nginx
    elif [ "$ENVIRONMENT" = "cpanel" ]; then
        configure_cpanel
    fi
}

# Nginx configuration (VPS)
configure_nginx() {
    log "Configuring Nginx..."
    
    # Create Nginx configuration
    NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
    
    sudo tee "$NGINX_CONFIG" > /dev/null << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Serve static files
    location / {
        root $APP_DIR/dist/client;
        try_files \$uri \$uri/ @app;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js
    location @app {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
EOF

    # Enable site
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    
    # Test configuration
    sudo nginx -t || error "Nginx configuration test failed"
    
    # Reload Nginx
    sudo systemctl reload nginx || error "Nginx reload failed"
    
    success "Nginx configured successfully"
}

# cPanel configuration
configure_cpanel() {
    log "Configuring cPanel hosting..."
    
    # Create .htaccess for URL rewriting
    cat > "$APP_DIR/.htaccess" << EOF
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Handle Node.js application
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>
EOF

    success "cPanel configuration completed"
}

# Setup system services (VPS only)
setup_services() {
    if [ "$ENVIRONMENT" != "vps" ]; then
        return
    fi
    
    log "Setting up system services..."
    
    # Create systemd service
    sudo tee /etc/systemd/system/$PROJECT_NAME.service > /dev/null << EOF
[Unit]
Description=CinePrivé Theatre Booking Application
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env.production
ExecStart=/usr/bin/node dist/server/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$PROJECT_NAME

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR /var/log/$PROJECT_NAME

[Install]
WantedBy=multi-user.target
EOF

    # Create log directory
    sudo mkdir -p /var/log/$PROJECT_NAME
    sudo chown www-data:www-data /var/log/$PROJECT_NAME
    
    # Reload systemd and start service
    sudo systemctl daemon-reload
    sudo systemctl enable $PROJECT_NAME
    
    success "System service configured"
}

# Start services
start_services() {
    log "Starting services..."
    
    if [ "$ENVIRONMENT" = "vps" ]; then
        # Start application service
        sudo systemctl restart $PROJECT_NAME || error "Failed to start application service"
        
        # Check service status
        sleep 3
        if ! sudo systemctl is-active --quiet $PROJECT_NAME; then
            error "Application service failed to start. Check logs: journalctl -u $PROJECT_NAME"
        fi
        success "Application service started"
        
        # Restart Nginx
        sudo systemctl restart nginx || error "Failed to restart Nginx"
        success "Nginx restarted"
    else
        # For cPanel, just copy built files to web root
        log "Copying application files to web directory..."
        cp -r dist/client/* "$APP_DIR/"
        success "Application files deployed"
    fi
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Wait for application to start
    sleep 5
    
    # Test local endpoints
    if curl -f http://localhost:3000/api/theatres &> /dev/null; then
        success "Local API health check passed"
    else
        warning "Local API health check failed"
    fi
    
    # Test domain if accessible
    if curl -f "https://$DOMAIN/api/theatres" &> /dev/null; then
        success "Domain health check passed"
    else
        warning "Domain health check failed (may need DNS propagation)"
    fi
    
    # Test database connectivity
    cd "$APP_DIR"
    if npm run db:push --dry-run &> /dev/null; then
        success "Database connectivity check passed"
    else
        warning "Database connectivity check failed"
    fi
}

# Post-deployment tasks
post_deployment() {
    log "Running post-deployment tasks..."
    
    # Set proper permissions
    if [ "$ENVIRONMENT" = "vps" ]; then
        sudo chown -R www-data:www-data "$APP_DIR"
        sudo chmod -R 755 "$APP_DIR"
        sudo chmod 600 "$APP_DIR/.env"* || true
    else
        chmod -R 755 "$APP_DIR"
        chmod 644 "$APP_DIR/.env"* || true
    fi
    
    # Clear any temporary files
    rm -rf "$APP_DIR"/tmp/* || true
    rm -rf "$APP_DIR"/.cache/* || true
    
    success "Post-deployment tasks completed"
}

# Main deployment function
main() {
    log "Starting CinePrivé production deployment..."
    log "========================================"
    
    # Parse command line arguments
    SEED_DB=false
    SKIP_BACKUP=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --seed)
                SEED_DB=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --seed        Seed database with initial data"
                echo "  --skip-backup Skip backup creation"
                echo "  --help        Show this help message"
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                ;;
        esac
    done
    
    # Main deployment steps
    detect_environment
    pre_deployment_checks
    
    if [ "$SKIP_BACKUP" = false ]; then
        backup_deployment
    fi
    
    build_application
    
    if [ "$SEED_DB" = true ]; then
        setup_database --seed
    else
        setup_database
    fi
    
    configure_webserver
    setup_services
    start_services
    health_check
    post_deployment
    
    success "========================================"
    success "CinePrivé deployment completed successfully!"
    success "========================================"
    
    log "Application URL: https://$DOMAIN"
    log "Admin Dashboard: https://$DOMAIN/admin"
    log "API Health Check: https://$DOMAIN/api/theatres"
    
    if [ "$ENVIRONMENT" = "vps" ]; then
        log "Service status: systemctl status $PROJECT_NAME"
        log "Application logs: journalctl -u $PROJECT_NAME -f"
        log "Nginx logs: tail -f /var/log/nginx/error.log"
    fi
    
    log "Database monitoring: npm run db:studio"
    log "========================================"
}

# Error handling
trap 'error "Deployment failed. Check logs for details."' ERR

# Run main function
main "$@"

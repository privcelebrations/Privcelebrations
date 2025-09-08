# 🗄️ Complete Database Production Setup Guide
## CinePrivé Database Implementation for VPS & cPanel Hosting

---

## 📋 Table of Contents

1. [Database Architecture Overview](#database-architecture)
2. [PostgreSQL Installation on VPS](#postgresql-vps-setup)
3. [MySQL Setup for cPanel Hosting](#mysql-cpanel-setup)
4. [Database Schema Implementation](#schema-implementation)
5. [Environment Configuration](#environment-setup)
6. [Migration & Deployment](#migration-deployment)
7. [Security & Performance](#security-performance)
8. [Backup & Recovery](#backup-recovery)
9. [Monitoring & Maintenance](#monitoring-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Database Architecture Overview {#database-architecture}

### Current Implementation
- **Development**: In-memory storage with interface-based design
- **Production**: PostgreSQL/MySQL with Drizzle ORM
- **Migration Path**: Seamless transition from memory to persistent storage

### Database Schema Structure
```sql
-- Core Tables
├── theatres (venue information)
├── packages (add-on services)
├── bookings (customer reservations)
├── contacts (customer inquiries)
└── booking_packages (many-to-many relationship)
```

### Technology Stack
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Connection Pooling**: Built-in connection pooling for performance
- **Type Safety**: Full TypeScript integration

---

## 🖥️ PostgreSQL Installation on VPS {#postgresql-vps-setup}

### Option 1: Ubuntu/Debian VPS Setup

#### 1. Install PostgreSQL
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL and contrib packages
sudo apt install postgresql postgresql-contrib postgresql-client -y

# Install Node.js 20 (required for the application)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y

# Verify installations
psql --version
node --version
npm --version
```

#### 2. Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create application database and user
CREATE DATABASE cineprive_production;
CREATE USER cineprive_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE cineprive_production TO cineprive_user;
GRANT CREATE ON SCHEMA public TO cineprive_user;
ALTER USER cineprive_user CREATEDB;

# Exit PostgreSQL
\q
```

#### 3. Configure PostgreSQL for Remote Access
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add/modify these lines:
listen_addresses = '*'
port = 5432
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
```

```bash
# Edit client authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line for application access:
host    cineprive_production    cineprive_user    0.0.0.0/0    md5
```

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

# Configure firewall
sudo ufw allow 5432/tcp
```

#### 4. Test Database Connection
```bash
# Test local connection
psql -h localhost -U cineprive_user -d cineprive_production

# Test remote connection (from your local machine)
psql -h YOUR_VPS_IP -U cineprive_user -d cineprive_production
```

### Option 2: CentOS/RHEL VPS Setup

#### 1. Install PostgreSQL
```bash
# Install PostgreSQL repository
sudo dnf install -y postgresql-server postgresql-contrib

# Initialize database
sudo postgresql-setup --initdb

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Follow similar configuration steps as Ubuntu setup above

### VPS Environment Variables
```bash
# Create environment file
sudo nano /opt/cineprive/.env.production

# Add database configuration
DATABASE_URL=postgresql://cineprive_user:your_secure_password_here@localhost:5432/cineprive_production
PGHOST=localhost
PGPORT=5432
PGUSER=cineprive_user
PGPASSWORD=your_secure_password_here
PGDATABASE=cineprive_production
NODE_ENV=production
PORT=3000
```

---

## 🏢 MySQL Setup for cPanel Hosting {#mysql-cpanel-setup}

### 1. Create MySQL Database via cPanel

#### Access cPanel MySQL Databases
1. Login to your cPanel hosting account
2. Navigate to **"MySQL Databases"** section
3. Create new database and user

#### Database Creation Steps
```sql
-- Database details (via cPanel interface):
Database Name: yourusername_cineprive
Database User: yourusername_cineprive_user
Password: [Generate secure password]
Privileges: ALL PRIVILEGES
```

#### Alternative: Manual Database Creation
```sql
-- If you have direct MySQL access:
CREATE DATABASE cineprive_production 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

CREATE USER 'cineprive_user'@'localhost' 
IDENTIFIED BY 'your_secure_password_here';

GRANT ALL PRIVILEGES ON cineprive_production.* 
TO 'cineprive_user'@'localhost';

FLUSH PRIVILEGES;
```

### 2. Configure MySQL for Production

#### Update Drizzle Configuration for MySQL
```typescript
// server/db-mysql.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from "@shared/schema";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export const db = drizzle(connection, { schema, mode: 'default' });
```

#### MySQL Schema Adaptation
```typescript
// shared/schema-mysql.ts
import { mysqlTable, varchar, text, int, decimal, datetime, json } from 'drizzle-orm/mysql-core';

export const theatres = mysqlTable('theatres', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  capacity: int('capacity').notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  amenities: json('amenities').$type<string[]>().notNull(),
  rating: varchar('rating', { length: 10 }).notNull(),
  duration: varchar('duration', { length: 100 }).notNull(),
});

export const bookings = mysqlTable('bookings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  theatreId: varchar('theatre_id', { length: 36 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  partySize: int('party_size').notNull(),
  bookingDate: varchar('booking_date', { length: 20 }).notNull(),
  bookingTime: varchar('booking_time', { length: 20 }).notNull(),
  specialRequests: text('special_requests'),
  packageIds: json('package_ids').$type<string[]>(),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});
```

### 3. cPanel Environment Configuration

#### Create .env File via File Manager
```bash
# Access cPanel → File Manager → public_html
# Create .env file with content:

NODE_ENV=production
PORT=3000

# MySQL Database Configuration
DB_HOST=localhost
DB_USER=yourusername_cineprive_user
DB_PASSWORD=your_database_password
DB_NAME=yourusername_cineprive
DB_PORT=3306

# Application Configuration
DOMAIN=https://privcelebrations.com
CORS_ORIGIN=https://privcelebrations.com
SESSION_SECRET=your_super_secure_session_secret_here
WHATSAPP_BUSINESS_NUMBER=+15551237748

# Security
TRUST_PROXY=true
SECURE_COOKIES=true
```

---

## 📊 Database Schema Implementation {#schema-implementation}

### 1. Update Shared Schema for Production

```typescript
// shared/schema.ts - Enhanced for production
import { pgTable, text, integer, decimal, timestamp, uuid, json, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Theatres table
export const theatres = pgTable('theatres', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  capacity: integer('capacity').notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  amenities: json('amenities').$type<string[]>().notNull(),
  rating: varchar('rating', { length: 10 }).notNull(),
  duration: varchar('duration', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Packages table
export const packages = pgTable('packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  icon: varchar('icon', { length: 100 }).notNull(),
  features: json('features').$type<string[]>().notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Bookings table
export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  theatreId: uuid('theatre_id').notNull().references(() => theatres.id),
  customerName: varchar('customer_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }),
  partySize: integer('party_size').notNull(),
  bookingDate: varchar('booking_date', { length: 20 }).notNull(),
  bookingTime: varchar('booking_time', { length: 20 }).notNull(),
  specialRequests: text('special_requests'),
  totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paymentStatus: varchar('payment_status', { length: 50 }).default('pending'),
  confirmationCode: varchar('confirmation_code', { length: 20 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Booking packages junction table
export const bookingPackages = pgTable('booking_packages', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  packageId: uuid('package_id').notNull().references(() => packages.id),
  quantity: integer('quantity').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contacts table
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('new'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const theatresRelations = relations(theatres, ({ many }) => ({
  bookings: many(bookings),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  bookingPackages: many(bookingPackages),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  theatre: one(theatres, {
    fields: [bookings.theatreId],
    references: [theatres.id],
  }),
  bookingPackages: many(bookingPackages),
}));

export const bookingPackagesRelations = relations(bookingPackages, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingPackages.bookingId],
    references: [bookings.id],
  }),
  package: one(packages, {
    fields: [bookingPackages.packageId],
    references: [packages.id],
  }),
}));

// Schema validation
export const insertTheatreSchema = createInsertSchema(theatres);
export const selectTheatreSchema = createSelectSchema(theatres);
export const insertPackageSchema = createInsertSchema(packages);
export const selectPackageSchema = createSelectSchema(packages);
export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export const insertContactSchema = createInsertSchema(contacts);
export const selectContactSchema = createSelectSchema(contacts);

// Types
export type Theatre = typeof theatres.$inferSelect;
export type InsertTheatre = typeof theatres.$inferInsert;
export type Package = typeof packages.$inferSelect;
export type InsertPackage = typeof packages.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
export type BookingPackage = typeof bookingPackages.$inferSelect;
export type InsertBookingPackage = typeof bookingPackages.$inferInsert;
```

### 2. Database Storage Implementation

```typescript
// server/storage-db.ts - Production database storage
import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { theatres, packages, bookings, contacts, bookingPackages } from "@shared/schema";
import type { Theatre, Package, Booking, Contact, InsertTheatre, InsertPackage, InsertBooking, InsertContact } from "@shared/schema";

export class DatabaseStorage implements IStorage {
  // Theatres
  async getTheatres(): Promise<Theatre[]> {
    return await db.select().from(theatres).where(eq(theatres.isActive, true));
  }

  async getTheatre(id: string): Promise<Theatre | undefined> {
    const [theatre] = await db.select().from(theatres).where(eq(theatres.id, id));
    return theatre || undefined;
  }

  async createTheatre(theatre: InsertTheatre): Promise<Theatre> {
    const [created] = await db.insert(theatres).values(theatre).returning();
    return created;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages).where(eq(packages.isActive, true));
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [package] = await db.select().from(packages).where(eq(packages.id, id));
    return package || undefined;
  }

  async createPackage(package: InsertPackage): Promise<Package> {
    const [created] = await db.insert(packages).values(package).returning();
    return created;
  }

  // Bookings
  async createBooking(booking: InsertBooking, packageIds?: string[]): Promise<Booking> {
    return await db.transaction(async (tx) => {
      // Create booking
      const [created] = await tx.insert(bookings).values(booking).returning();
      
      // Add packages if provided
      if (packageIds && packageIds.length > 0) {
        const bookingPackageData = packageIds.map(packageId => ({
          bookingId: created.id,
          packageId,
          quantity: 1
        }));
        await tx.insert(bookingPackages).values(bookingPackageData);
      }
      
      return created;
    });
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking | undefined> {
    const [updated] = await db
      .update(bookings)
      .set({ status, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();
    return updated || undefined;
  }

  // Contacts
  async createContact(contact: InsertContact): Promise<Contact> {
    const [created] = await db.insert(contacts).values(contact).returning();
    return created;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const [updated] = await db
      .update(contacts)
      .set({ status, isRead: true, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
```

---

## ⚙️ Environment Configuration {#environment-setup}

### 1. Development Environment
```bash
# .env.development
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/cineprive_dev
```

### 2. Production Environment Variables
```bash
# .env.production
NODE_ENV=production
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://cineprive_user:secure_password@localhost:5432/cineprive_production

# Alternative MySQL Configuration for cPanel
# DB_HOST=localhost
# DB_USER=username_cineprive
# DB_PASSWORD=secure_password
# DB_NAME=username_cineprive_db
# DB_PORT=3306

# Application Security
SESSION_SECRET=your_ultra_secure_session_secret_here_minimum_32_characters
CORS_ORIGIN=https://privcelebrations.com
TRUST_PROXY=true
SECURE_COOKIES=true

# Business Configuration
DOMAIN=https://privcelebrations.com
WHATSAPP_BUSINESS_NUMBER=+15551237748

# Email Configuration (Optional)
SMTP_HOST=smtp.privcelebrations.com
SMTP_PORT=587
SMTP_USER=noreply@privcelebrations.com
SMTP_PASSWORD=email_password

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/cineprive/app.log

# Performance
MAX_CONNECTIONS=20
CONNECTION_TIMEOUT=30000
QUERY_TIMEOUT=10000
```

### 3. Environment Security
```bash
# Set proper file permissions
chmod 600 .env.production
chown app_user:app_group .env.production

# For cPanel hosting
chmod 644 .env
```

---

## 🚀 Migration & Deployment {#migration-deployment}

### 1. Database Migration Scripts

#### Initialize Database Schema
```bash
# Run initial migration
npm run db:push

# Alternative: Generate and run migrations
npm run db:generate
npm run db:migrate
```

#### Seed Production Data
```typescript
// scripts/seed-production.ts
import { db } from '../server/db';
import { theatres, packages } from '../shared/schema';

const seedData = async () => {
  console.log('🌱 Seeding production database...');
  
  // Insert theatres
  const theatreData = [
    {
      name: "Imperial Suite",
      description: "Our premium suite featuring 12 luxury recliners, personal wait service, and champagne bar",
      capacity: 12,
      basePrice: "899.00",
      imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      amenities: ["Up to 12 guests", "3-hour experience", "Premium catering included"],
      rating: "5.0",
      duration: "3-hour experience"
    },
    // ... more theatre data
  ];

  await db.insert(theatres).values(theatreData);
  
  // Insert packages
  const packageData = [
    {
      name: "Birthday Celebration",
      description: "Make their special day unforgettable with personalized decorations and birthday treats",
      price: "199.00",
      icon: "fas fa-birthday-cake",
      features: ["Custom birthday decorations", "Special birthday cake", "Personalized playlist", "Party favors for guests"]
    },
    // ... more package data
  ];

  await db.insert(packages).values(packageData);
  
  console.log('✅ Database seeded successfully!');
};

seedData().catch(console.error);
```

### 2. Deployment Scripts

#### VPS Deployment Script
```bash
#!/bin/bash
# deploy-vps.sh

set -e

echo "🚀 Starting CinePrivé deployment..."

# Update system
sudo apt update

# Navigate to application directory
cd /opt/cineprive

# Backup current deployment
sudo cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Run database migrations
npm run db:push

# Seed database (only on first deployment)
# npm run db:seed

# Restart application services
sudo systemctl restart cineprive
sudo systemctl restart nginx

# Health check
sleep 5
curl -f http://localhost:3000/api/theatres || {
  echo "❌ Health check failed"
  exit 1
}

echo "✅ Deployment completed successfully!"
```

#### cPanel Deployment Script
```bash
#!/bin/bash
# deploy-cpanel.sh

echo "📦 Preparing cPanel deployment package..."

# Build application locally
npm run build

# Create deployment package
tar -czf cineprive-deployment.tar.gz \
  dist/ \
  package.json \
  package-lock.json \
  .env.production \
  drizzle.config.ts

echo "📤 Upload cineprive-deployment.tar.gz to cPanel File Manager"
echo "📂 Extract to public_html directory"
echo "🔧 Run: npm install --production"
echo "🗄️ Run: npm run db:push"
echo "✅ Deployment package ready!"
```

### 3. Database Migration Commands

```bash
# Generate migration files
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Push schema changes directly (development)
npm run db:push

# Reset database (development only)
npm run db:reset

# Seed database with initial data
npm run db:seed
```

---

## 🔒 Security & Performance {#security-performance}

### 1. Database Security

#### PostgreSQL Security Configuration
```sql
-- Create read-only user for monitoring
CREATE USER monitoring_user WITH PASSWORD 'monitor_password';
GRANT CONNECT ON DATABASE cineprive_production TO monitoring_user;
GRANT USAGE ON SCHEMA public TO monitoring_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitoring_user;

-- Create backup user
CREATE USER backup_user WITH PASSWORD 'backup_password';
GRANT CONNECT ON DATABASE cineprive_production TO backup_user;
GRANT USAGE ON SCHEMA public TO backup_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;
```

#### Connection Security
```typescript
// server/db-secure.ts
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });
```

### 2. Performance Optimization

#### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_theatre_id ON bookings(theatre_id);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_contacts_status ON contacts(status);

-- Composite indexes for common queries
CREATE INDEX idx_bookings_status_date ON bookings(status, booking_date);
CREATE INDEX idx_theatres_active ON theatres(is_active) WHERE is_active = true;
```

#### Connection Pooling
```typescript
// Optimized connection configuration
const connectionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Connection pool settings
  min: 2,
  max: 20,
  acquireTimeoutMillis: 60000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 600000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
};
```

---

## 💾 Backup & Recovery {#backup-recovery}

### 1. Automated Backup Scripts

#### PostgreSQL Backup
```bash
#!/bin/bash
# backup-postgres.sh

BACKUP_DIR="/opt/backups/cineprive"
DB_NAME="cineprive_production"
DB_USER="cineprive_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/cineprive_backup_$TIMESTAMP.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME -f $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "cineprive_backup_*.sql.gz" -mtime +7 -delete

echo "✅ Backup completed: ${BACKUP_FILE}.gz"
```

#### MySQL Backup (cPanel)
```bash
#!/bin/bash
# backup-mysql.sh

BACKUP_DIR="/home/username/backups"
DB_NAME="username_cineprive"
DB_USER="username_cineprive_user"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

mysqldump -u $DB_USER -p $DB_NAME > "$BACKUP_DIR/cineprive_backup_$TIMESTAMP.sql"
gzip "$BACKUP_DIR/cineprive_backup_$TIMESTAMP.sql"

echo "✅ MySQL backup completed"
```

### 2. Cron Job Configuration
```bash
# Add to crontab (crontab -e)
# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup-postgres.sh

# Weekly cleanup at 3 AM on Sundays
0 3 * * 0 /opt/scripts/cleanup-old-backups.sh
```

### 3. Recovery Procedures

#### PostgreSQL Recovery
```bash
# Restore from backup
gunzip cineprive_backup_YYYYMMDD_HHMMSS.sql.gz
psql -h localhost -U cineprive_user -d cineprive_production < cineprive_backup_YYYYMMDD_HHMMSS.sql
```

#### Point-in-Time Recovery Setup
```bash
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /opt/backups/wal/%f'
```

---

## 📊 Monitoring & Maintenance {#monitoring-maintenance}

### 1. Database Monitoring Script
```bash
#!/bin/bash
# monitor-database.sh

echo "📊 CinePrivé Database Status Report"
echo "=================================="

# PostgreSQL connection test
psql -h localhost -U cineprive_user -d cineprive_production -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection: OK"
else
    echo "❌ Database connection: FAILED"
fi

# Database size
DB_SIZE=$(psql -h localhost -U cineprive_user -d cineprive_production -t -c "SELECT pg_size_pretty(pg_database_size('cineprive_production'));")
echo "💾 Database size: $DB_SIZE"

# Active connections
CONNECTIONS=$(psql -h localhost -U cineprive_user -d cineprive_production -t -c "SELECT count(*) FROM pg_stat_activity;")
echo "🔗 Active connections: $CONNECTIONS"

# Recent bookings count
RECENT_BOOKINGS=$(psql -h localhost -U cineprive_user -d cineprive_production -t -c "SELECT count(*) FROM bookings WHERE created_at > NOW() - INTERVAL '24 hours';")
echo "📅 Bookings (24h): $RECENT_BOOKINGS"

# Table sizes
echo "📋 Table sizes:"
psql -h localhost -U cineprive_user -d cineprive_production -c "
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### 2. Performance Monitoring
```sql
-- Monitor slow queries
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor table statistics
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
```

### 3. Maintenance Commands
```bash
# Vacuum and analyze tables
psql -h localhost -U cineprive_user -d cineprive_production -c "VACUUM ANALYZE;"

# Reindex tables for performance
psql -h localhost -U cineprive_user -d cineprive_production -c "REINDEX DATABASE cineprive_production;"

# Update table statistics
psql -h localhost -U cineprive_user -d cineprive_production -c "ANALYZE;"
```

---

## 🛠️ Troubleshooting {#troubleshooting}

### Common Issues & Solutions

#### 1. Connection Issues
```bash
# Test database connectivity
telnet DB_HOST DB_PORT

# Check PostgreSQL status
sudo systemctl status postgresql

# Check logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 2. Permission Issues
```sql
-- Grant proper permissions
GRANT ALL PRIVILEGES ON DATABASE cineprive_production TO cineprive_user;
GRANT ALL ON SCHEMA public TO cineprive_user;
GRANT ALL ON ALL TABLES IN SCHEMA public TO cineprive_user;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO cineprive_user;
```

#### 3. Performance Issues
```sql
-- Check for locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Monitor active queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

#### 4. Migration Issues
```bash
# Reset migrations (development only)
npm run db:reset

# Force push schema changes
npm run db:push --force

# Check migration status
npm run db:status
```

### Deployment Checklist

#### Pre-deployment
- [ ] Backup current database
- [ ] Test migrations on staging
- [ ] Verify environment variables
- [ ] Check disk space
- [ ] Validate SSL certificates

#### During deployment
- [ ] Enable maintenance mode
- [ ] Stop application services
- [ ] Run database migrations
- [ ] Deploy new application code
- [ ] Start application services
- [ ] Verify health checks

#### Post-deployment
- [ ] Test critical functionality
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify backup systems
- [ ] Update documentation

---

## 📚 Additional Resources

### Documentation Links
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Monitoring Tools
- **Database**: pgAdmin, phpMyAdmin, DBeaver
- **Application**: PM2, Winston Logger, New Relic
- **Server**: Prometheus, Grafana, htop

### Support Contacts
- **Technical Support**: admin@privcelebrations.com
- **Database Issues**: db-support@privcelebrations.com
- **Emergency**: +1 (555) 123-7748

---

*Last Updated: January 2025 | CinePrivé Production Database Guide v2.0*
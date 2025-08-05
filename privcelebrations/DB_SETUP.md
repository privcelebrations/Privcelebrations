*** Begin Patch
*** Add File: privcelebrations/DB_SETUP.md
+# Database setup (Neon / Postgres) — Privcelebrations
+
+This file explains how to configure a Postgres database for local development and production,
+run Drizzle schema push/migrations, and seed the database using the repo's seed script.
+
+--- 
+## 1) Provision a Postgres-compatible database
+
+- **Neon (recommended)**: create a project at https://neon.tech and copy the connection string.
+- **Local Postgres (Docker)**:
+
+```bash
+docker run --name privcelebrations-db -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=priv -e POSTGRES_DB=privcelebrations -p 5432:5432 -d postgres:15
+```
+
+## 2) Create a `.env` file
+
+Copy the example and fill values:
+
```bash
cp .env.example .env
# Edit .env and set DATABASE_URL and VITE_API_URL

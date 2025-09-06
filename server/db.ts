import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Ensure DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to configure your local PostgreSQL?");
}

// Create a pg Pool (connection pool)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize drizzle with pg pool and schema
export const db = drizzle(pool, { schema });


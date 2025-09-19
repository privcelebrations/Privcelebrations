import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config(); // ensure .env is loaded

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Please set it in your .env file");
}

export default defineConfig({
  schema: "./shared/schema.ts",   // correct relative path
  out: "./drizzle",               // keep migrations in a clean folder
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});

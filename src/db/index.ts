import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // tvoja schema fajl


const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is missing");

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || connectionString.includes('neon.tech') || connectionString.includes('supabase')
    ? { rejectUnauthorized: false }
    : false
});

export const db = drizzle(pool, { schema });
export { schema };
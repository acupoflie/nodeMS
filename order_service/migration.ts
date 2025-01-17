import { Pool } from "pg";
import { DB_URL } from "./src/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import ENV from './src/config/env'

async function runMigration() {
  try {
    console.log("migration start...");
    const pool = new Pool({ connectionString: ENV.DB_URL });
    const db = drizzle(pool);
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("migration was succesful");
    await pool.end();
  } catch (err) {
    console.log("migration error", err);
  }
}

runMigration();

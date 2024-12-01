import * as schema from "./schema";
import { Pool } from "pg";
import ENV from "../config/env";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
  connectionString: ENV.DB_URL,
});

export const DB: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

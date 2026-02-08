import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

import { serverEnv } from "@/lib/env/server";
import * as schema from "./schema";

// WebSocket support for local development and some environments
neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: serverEnv.DATABASE_URL });

export const db = drizzle({ client: pool, schema });

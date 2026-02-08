import "server-only";

import { z } from "zod/v4";

const serverEnvSchema = z.object({
  DATABASE_URL: z.url(),
  AUTH_SECRET: z.string().min(1),
  AUTH_GITHUB_ID: z.string().min(1),
  AUTH_GITHUB_SECRET: z.string().min(1),
  AUTH_GOOGLE_ID: z.string().min(1),
  AUTH_GOOGLE_SECRET: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

export const serverEnv = serverEnvSchema.parse(process.env);

import { z } from "zod/v4";

const clientEnvSchema = z.object({
  // Phase 1에서는 NEXT_PUBLIC_ 변수 없음. 구조만 세팅.
});

export const clientEnv = clientEnvSchema.parse({});

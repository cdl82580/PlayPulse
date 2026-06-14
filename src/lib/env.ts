import { z } from "zod";

/**
 * Centralized, validated environment access. Importing this module throws
 * early (at boot) if a required variable is missing or malformed, so we never
 * ship a build that silently points at the wrong database or Redis.
 */
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // PostgreSQL (Neon). DATABASE_URL is the pooled URL used at runtime;
  // DIRECT_URL is the unpooled URL used by Prisma Migrate.
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),

  // Redis (Upstash) — cache + realtime pub/sub.
  REDIS_URL: z.string().url(),

  // Public base URL of the deployed app (per environment).
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

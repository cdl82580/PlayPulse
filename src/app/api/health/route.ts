import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe. Confirms the app can reach both Postgres and
 * Redis. Used by deploy smoke checks and uptime monitoring.
 */
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    db: "error",
    redis: "error",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.db = "ok";
  } catch {
    // leave as error
  }

  try {
    await redis.ping();
    checks.redis = "ok";
  } catch {
    // leave as error
  }

  const healthy = Object.values(checks).every((c) => c === "ok");
  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 },
  );
}

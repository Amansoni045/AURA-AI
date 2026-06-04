import { NextResponse } from "next/server";
import { prisma, databaseUrl } from "@/lib/prisma";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const googleId = process.env.AUTH_GOOGLE_ID || "";
  const googleSecret = process.env.AUTH_GOOGLE_SECRET || "";
  const authSecret = process.env.AUTH_SECRET || "";

  let dbConnectionStatus = "untested";
  let dbError = null;

  try {
    // Attempt a simple raw query to test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbConnectionStatus = "success";
  } catch (error: any) {
    dbConnectionStatus = "failed";
    dbError = error.message || error.toString();
  }

  return NextResponse.json({
    has_auth_secret: !!authSecret,
    auth_secret_has_quotes: authSecret.startsWith('"') || authSecret.endsWith('"'),
    has_database_url: !!dbUrl,
    database_url_prefix: dbUrl ? dbUrl.slice(0, 15) : null,
    prisma_resolved_databaseUrl: databaseUrl,
    has_turso_auth_token: !!process.env.TURSO_AUTH_TOKEN,
    has_auth_google_id: !!googleId,
    google_id_has_quotes: googleId.startsWith('"') || googleId.endsWith('"'),
    has_auth_google_secret: !!googleSecret,
    google_secret_has_quotes: googleSecret.startsWith('"') || googleSecret.endsWith('"'),
    db_connection_status: dbConnectionStatus,
    db_error: dbError,
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  return NextResponse.json({
    has_auth_secret: !!process.env.AUTH_SECRET,
    has_database_url: !!dbUrl,
    database_url_prefix: dbUrl ? dbUrl.slice(0, 15) : null,
    has_turso_auth_token: !!process.env.TURSO_AUTH_TOKEN,
    has_auth_google_id: !!process.env.AUTH_GOOGLE_ID,
    has_auth_google_secret: !!process.env.AUTH_GOOGLE_SECRET,
  });
}

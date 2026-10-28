import { NextRequest, NextResponse } from "next/server";
import {
  clearAdminSession,
  createAdminSession,
  hashClientAddress,
  hasAdminSession,
  isSameOriginRequest,
  verifyAdminPassword,
} from "@/lib/admin-auth";
import { ensureDatabaseSchema } from "@/lib/database";

export const runtime = "nodejs";

function clientAddress(request: NextRequest) {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function GET() {
  return NextResponse.json({ authenticated: await hasAdminSession() });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || !("password" in body) || typeof body.password !== "string") {
      return NextResponse.json({ error: "Passwort fehlt." }, { status: 400 });
    }

    const sql = await ensureDatabaseSchema();
    const addressHash = hashClientAddress(clientAddress(request));
    await sql`DELETE FROM nexus_admin_login_attempts WHERE attempted_at < NOW() - INTERVAL '1 day'`;
    const attempts = await sql`
      SELECT COUNT(*)::int AS count FROM nexus_admin_login_attempts
      WHERE address_hash = ${addressHash} AND attempted_at > NOW() - INTERVAL '15 minutes'
    `;
    if (Number(attempts[0].count) >= 5) {
      return NextResponse.json({ error: "Zu viele Versuche. Bitte warte 15 Minuten." }, { status: 429 });
    }

    let passwordMatches = false;
    try {
      passwordMatches = verifyAdminPassword(body.password);
    } catch (error) {
      console.error("Admin password is not configured.", error);
      return NextResponse.json({ error: "Adminpasswort oder Sitzungsschlüssel fehlen in der Vercel-Konfiguration." }, { status: 503 });
    }
    if (!passwordMatches) {
      await sql`INSERT INTO nexus_admin_login_attempts (address_hash) VALUES (${addressHash})`;
      return NextResponse.json({ error: "Passwort ist falsch." }, { status: 401 });
    }

    await sql`DELETE FROM nexus_admin_login_attempts WHERE address_hash = ${addressHash}`;
    await createAdminSession();
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Admin sign-in failed.", error);
    return NextResponse.json({ error: "Adminzugang nicht konfiguriert oder Datenbank nicht erreichbar. Vercel-Variablen prüfen." }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });
  }
  await clearAdminSession();
  return NextResponse.json({ authenticated: false });
}

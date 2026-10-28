import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ensureDatabaseSchema } from "@/lib/database";

export const runtime = "nodejs";

const downloads: Record<string, string> = {
  "nexus-hud": "nexus-hud-1.0.0.zip",
  "nexus-inventory": "nexus-inventory-1.0.0.zip",
  "nexus-garage": "nexus-garage-1.0.0.zip",
  "nexus-bot-v1": "nexus-bot-v1-1.0.0.zip",
  "nexus-ticket-system": "nexus-ticket-system-1.0.0.zip",
  "nexus-roblox-admin": "nexus-admin-moderation-1.0.0.zip",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
    return NextResponse.json({ error: "Download nicht gefunden." }, { status: 404 });
  }
  try {
    const sql = await ensureDatabaseSchema();
    let filename = downloads[slug];
    let targetUrl: string | undefined;
    if (!filename) {
      const resources = await sql`SELECT download_url FROM nexus_resources WHERE id = ${slug}`;
      if (!resources[0]) return NextResponse.json({ error: "Download nicht gefunden." }, { status: 404 });
      const downloadUrl = String(resources[0].download_url);
      if (/^\/downloads\/[a-zA-Z0-9._-]+\.zip$/.test(downloadUrl)) {
        filename = downloadUrl.slice("/downloads/".length);
      } else {
        targetUrl = downloadUrl;
      }
    }

    if (filename) {
      const filePath = path.join(process.cwd(), "public", "downloads", filename);
      let file: Buffer;
      try {
        file = await readFile(filePath);
      } catch {
        return NextResponse.json({ error: "ZIP-Datei ist derzeit nicht verfügbar." }, { status: 404 });
      }
      await sql`
        INSERT INTO nexus_download_stats (slug, downloads)
        VALUES (${slug}, 1)
        ON CONFLICT (slug)
        DO UPDATE SET downloads = nexus_download_stats.downloads + 1, updated_at = NOW()
      `;
      return new NextResponse(new Uint8Array(file), {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    await sql`
      INSERT INTO nexus_download_stats (slug, downloads)
      VALUES (${slug}, 1)
      ON CONFLICT (slug)
      DO UPDATE SET downloads = nexus_download_stats.downloads + 1, updated_at = NOW()
    `;
    if (!targetUrl || new URL(targetUrl).protocol !== "https:") {
      return NextResponse.json({ error: "Download-Link ist ungültig." }, { status: 400 });
    }
    return NextResponse.redirect(targetUrl, 302);
  } catch (error) {
    console.error(`Could not serve download for ${slug}.`, error);
    return NextResponse.json({ error: "Download konnte nicht bereitgestellt werden." }, { status: 503 });
  }
}

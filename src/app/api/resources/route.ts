import { NextRequest, NextResponse } from "next/server";
import { ensureDatabaseSchema } from "@/lib/database";

export const runtime = "nodejs";

type Locale = "de" | "en" | "fr";

const defaultCopy = {
  de: { title: "Ohne Titel", description: "Keine Beschreibung angegeben.", features: [] as string[] },
  en: { title: "Untitled", description: "No description provided.", features: [] as string[] },
  fr: { title: "Sans titre", description: "Aucune description fournie.", features: [] as string[] },
};

const builtInResources = [
  "nexus-hud",
  "nexus-inventory",
  "nexus-garage",
  "nexus-bot-v1",
  "nexus-ticket-system",
  "nexus-roblox-admin",
];

function getLocale(value: string | null): Locale {
  return value === "en" || value === "fr" ? value : "de";
}

export async function GET(request: NextRequest) {
  try {
    const sql = await ensureDatabaseSchema();
    const locale = getLocale(request.nextUrl.searchParams.get("lang"));
    const rows = await sql`
      SELECT id, category, translations, author, tags, version, requirement, page_url
      FROM nexus_resources
      ORDER BY created_at DESC
    `;
    const downloadRows = await sql`
      SELECT slug, downloads
      FROM nexus_download_stats
    `;
    const downloadCounts = Object.fromEntries([
      ...builtInResources.map((slug) => [slug, 0] as const),
      ...downloadRows.map((row) => [row.slug, Number(row.downloads)] as const),
    ]);
    const resources = rows.map((row) => {
      const translations = row.translations as Partial<Record<Locale, typeof defaultCopy.de>>;
      const copy = translations[locale] ?? translations.de ?? defaultCopy[locale];
      return {
        id: row.id,
        title: copy.title,
        description: copy.description,
        features: copy.features,
        author: row.author,
        category: row.category,
        accent: row.category === "Discord Bots" ? "electric" : row.category === "Roblox" ? "blue" : "cyan",
        tags: row.tags,
        version: row.version,
        requirement: row.requirement,
        href: row.page_url,
        downloadUrl: `/api/download/${encodeURIComponent(row.id)}`,
        downloads: downloadCounts[row.id] ?? 0,
      };
    });
    return NextResponse.json({ resources, downloads: downloadCounts });
  } catch (error) {
    console.error("Could not load marketplace resources from Neon.", error);
    return NextResponse.json({ error: "Datenbank nicht erreichbar. DATABASE_URL/POSTGRES_URL in Vercel prüfen." }, { status: 503 });
  }
}

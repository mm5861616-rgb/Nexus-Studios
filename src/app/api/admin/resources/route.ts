import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { hasAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { ensureDatabaseSchema } from "@/lib/database";

export const runtime = "nodejs";

const locales = ["de", "en", "fr"] as const;
type Locale = (typeof locales)[number];
type ResourceCopy = { title: string; description: string; features: string[] };
type ResourceInput = {
  category: string;
  translations: Record<Locale, ResourceCopy>;
  author: string;
  tags: string[];
  version: string;
  requirement: string;
  downloadUrl: string;
  pageUrl?: string;
};

function isCopy(value: unknown): value is ResourceCopy {
  if (typeof value !== "object" || value === null) return false;
  const copy = value as Record<string, unknown>;
  return typeof copy.title === "string" && copy.title.trim().length > 0 && copy.title.length <= 100
    && typeof copy.description === "string" && copy.description.trim().length > 0 && copy.description.length <= 600
    && Array.isArray(copy.features) && copy.features.length <= 8
    && copy.features.every((feature) => typeof feature === "string" && feature.trim().length > 0 && feature.length <= 180);
}

function isResourceInput(value: unknown): value is ResourceInput {
  if (typeof value !== "object" || value === null) return false;
  const input = value as Record<string, unknown>;
  if (!["FiveM", "Discord Bots", "Roblox"].includes(String(input.category))) return false;
  if (typeof input.translations !== "object" || input.translations === null) return false;
  const translations = input.translations as Record<string, unknown>;
  if (!locales.every((locale) => isCopy(translations[locale]))) return false;
  if (typeof input.author !== "string" || input.author.trim().length < 1 || input.author.length > 80) return false;
  if (!Array.isArray(input.tags) || input.tags.length > 8 || !input.tags.every((tag) => typeof tag === "string" && tag.trim().length > 0 && tag.length <= 30)) return false;
  if (typeof input.version !== "string" || input.version.trim().length < 1 || input.version.length > 30) return false;
  if (typeof input.requirement !== "string" || input.requirement.trim().length < 1 || input.requirement.length > 140) return false;
  if (typeof input.downloadUrl !== "string" || input.downloadUrl.length > 300) return false;
  if (input.pageUrl !== undefined && (typeof input.pageUrl !== "string" || input.pageUrl.length > 300)) return false;
  return true;
}

function safeUrl(value: string) {
  if (/^\/downloads\/[a-zA-Z0-9._-]+\.zip$/.test(value)) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function createSlug(title: string) {
  const normalized = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const slug = normalized.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
  return `${slug || "resource"}-${randomUUID().slice(0, 8)}`;
}

export async function GET() {
  if (!await hasAdminSession()) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  try {
    const sql = await ensureDatabaseSchema();
    const rows = await sql`
      SELECT id, category, translations, author, tags, version, requirement, download_url, page_url, created_at
      FROM nexus_resources ORDER BY created_at DESC
    `;
    return NextResponse.json({ resources: rows });
  } catch (error) {
    console.error("Could not list admin resources.", error);
    return NextResponse.json({ error: "Ressourcen konnten nicht geladen werden." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });
  if (!await hasAdminSession()) return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });

  try {
    const body: unknown = await request.json();
    if (!isResourceInput(body) || !safeUrl(body.downloadUrl) || (body.pageUrl && !safeUrl(body.pageUrl))) {
      return NextResponse.json({ error: "Bitte prüfe Pflichtfelder, Übersetzungen und HTTPS- oder ZIP-Links." }, { status: 400 });
    }
    const sql = await ensureDatabaseSchema();
    const id = createSlug(body.translations.de.title);
    await sql.begin(async (transaction) => {
      await transaction`
        INSERT INTO nexus_resources (id, category, translations, author, tags, version, requirement, download_url, page_url)
        VALUES (
          ${id},
          ${body.category},
          ${JSON.stringify(body.translations)}::jsonb,
          ${body.author.trim()},
          ${JSON.stringify(body.tags.map((tag) => tag.trim()))}::jsonb,
          ${body.version.trim()},
          ${body.requirement.trim()},
          ${body.downloadUrl},
          ${body.pageUrl || null}
        )
      `;
      await transaction`INSERT INTO nexus_download_stats (slug) VALUES (${id})`;
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Could not save admin resource.", error);
    return NextResponse.json({ error: "Ressource konnte nicht gespeichert werden." }, { status: 503 });
  }
}

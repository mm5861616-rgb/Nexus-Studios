import postgres from "postgres";

declare global {
  var nexusSql: ReturnType<typeof postgres> | undefined;
  var nexusSchemaReady: Promise<void> | undefined;
}

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) {
    throw new Error("Set DATABASE_URL or POSTGRES_URL to the connection string from your Neon project.");
  }

  globalThis.nexusSql ??= postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: "require",
  });
  return globalThis.nexusSql;
}

export async function ensureDatabaseSchema() {
  if (!globalThis.nexusSchemaReady) {
    const sql = getDatabase();
    globalThis.nexusSchemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS nexus_download_stats (
          slug TEXT PRIMARY KEY,
          downloads BIGINT NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS nexus_resources (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL CHECK (category IN ('FiveM', 'Discord Bots', 'Roblox')),
          translations JSONB NOT NULL,
          author TEXT NOT NULL,
          tags JSONB NOT NULL,
          version TEXT NOT NULL,
          requirement TEXT NOT NULL,
          download_url TEXT NOT NULL,
          page_url TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS nexus_admin_login_attempts (
          address_hash TEXT NOT NULL,
          attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS nexus_admin_login_attempts_recent
        ON nexus_admin_login_attempts (address_hash, attempted_at DESC)
      `;
    })().catch((error: unknown) => {
      globalThis.nexusSchemaReady = undefined;
      throw error;
    });
  }
  await globalThis.nexusSchemaReady;
  return getDatabase();
}

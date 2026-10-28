"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import { useLocale, type Locale } from "@/lib/locale";

type AdminResource = {
  id: string;
  category: string;
  translations: Record<Locale, { title: string; description: string; features: string[] }>;
  author: string;
  tags: string[];
  version: string;
  requirement: string;
  download_url: string;
};

type CopyDraft = { title: string; description: string; features: string };
type ResourceDraft = {
  category: string;
  author: string;
  tags: string;
  version: string;
  requirement: string;
  downloadUrl: string;
  pageUrl: string;
  translations: Record<Locale, CopyDraft>;
};

const localeOrder: Locale[] = ["de", "en", "fr"];
const builtInResourceNames: Record<string, Record<Locale, string>> = {
  "nexus-hud": { de: "Nexus HUD", en: "Nexus HUD", fr: "Nexus HUD" },
  "nexus-inventory": { de: "Nexus Inventory", en: "Nexus Inventory", fr: "Nexus Inventory" },
  "nexus-garage": { de: "Nexus Garage", en: "Nexus Garage", fr: "Nexus Garage" },
  "nexus-bot-v1": { de: "Nexus Bot V1 Script", en: "Nexus Bot V1 Script", fr: "Script Nexus Bot V1" },
  "nexus-ticket-system": { de: "Nexus Ticket System", en: "Nexus Ticket System", fr: "Nexus Ticket System" },
  "nexus-roblox-admin": { de: "Nexus Admin & Moderation", en: "Nexus Admin & Moderation", fr: "Nexus Admin & Modération" },
};
const labels = {
  de: {
    back: "← Marketplace", title: "Ressourcenverwaltung", intro: "Neue Angebote werden dauerhaft in Neon gespeichert und erscheinen im Marketplace.",
    login: "Admin-Anmeldung", password: "Adminpasswort", signIn: "Anmelden", signOut: "Abmelden",
    config: "Adminzugang oder Datenbank nicht konfiguriert. Richte DATABASE_URL, NEXUS_ADMIN_PASSWORD und NEXUS_ADMIN_SESSION_SECRET in Vercel ein.",
    category: "Kategorie", fivem: "FiveM", discord: "Discord Bots", roblox: "Roblox", author: "Autor",
    tags: "Tags (durch Komma trennen)", version: "Version", requirement: "Voraussetzungen",
    downloadUrl: "Download-URL (HTTPS oder /downloads/datei.zip)", pageUrl: "Optionale Detailseite (HTTPS)",
    titleField: "Name", description: "Beschreibung", features: "Funktionen (je eine pro Zeile)",
    add: "Ressource speichern", saving: "Wird gespeichert...", added: "Ressource wurde gespeichert.",
    languages: "Übersetzung", catalog: "Gespeicherte Ressourcen", noResources: "Noch keine zusätzlichen Ressourcen.",
    stats: "Download-Aufrufe", total: "Gesamt", downloads: "Downloads", dbError: "Daten konnten nicht geladen werden.",
    validation: "Bitte alle Übersetzungen und Pflichtfelder ausfüllen; jede Sprache braucht Titel, Beschreibung und mindestens eine Funktion.",
  },
  en: {
    back: "← Marketplace", title: "Resource management", intro: "New listings are stored persistently in Neon and appear in the marketplace.",
    login: "Admin sign in", password: "Admin password", signIn: "Sign in", signOut: "Sign out",
    config: "Admin access or database is not configured. Set DATABASE_URL, NEXUS_ADMIN_PASSWORD, and NEXUS_ADMIN_SESSION_SECRET in Vercel.",
    category: "Category", fivem: "FiveM", discord: "Discord Bots", roblox: "Roblox", author: "Author",
    tags: "Tags (comma-separated)", version: "Version", requirement: "Requirements",
    downloadUrl: "Download URL (HTTPS or /downloads/file.zip)", pageUrl: "Optional details page (HTTPS)",
    titleField: "Title", description: "Description", features: "Features (one per line)",
    add: "Save resource", saving: "Saving...", added: "Resource saved.",
    languages: "Translation", catalog: "Saved resources", noResources: "No additional resources yet.",
    stats: "Download requests", total: "Total", downloads: "Downloads", dbError: "Could not load data.",
    validation: "Complete all translations and required fields; every language needs a title, description, and at least one feature.",
  },
  fr: {
    back: "← Ressources", title: "Gestion des ressources", intro: "Les nouvelles offres sont enregistrées dans Neon et apparaissent dans le catalogue.",
    login: "Connexion admin", password: "Mot de passe admin", signIn: "Se connecter", signOut: "Se déconnecter",
    config: "Accès admin ou base de données non configurés. Définissez DATABASE_URL, NEXUS_ADMIN_PASSWORD et NEXUS_ADMIN_SESSION_SECRET dans Vercel.",
    category: "Catégorie", fivem: "FiveM", discord: "Bots Discord", roblox: "Roblox", author: "Auteur",
    tags: "Tags (séparés par des virgules)", version: "Version", requirement: "Prérequis",
    downloadUrl: "URL de téléchargement (HTTPS ou /downloads/fichier.zip)", pageUrl: "Page de détails facultative (HTTPS)",
    titleField: "Titre", description: "Description", features: "Fonctionnalités (une par ligne)",
    add: "Enregistrer la ressource", saving: "Enregistrement...", added: "Ressource enregistrée.",
    languages: "Traduction", catalog: "Ressources enregistrées", noResources: "Aucune ressource supplémentaire.",
    stats: "Demandes de téléchargement", total: "Total", downloads: "Téléchargements", dbError: "Impossible de charger les données.",
    validation: "Complétez les traductions et champs requis ; chaque langue doit avoir un titre, une description et une fonctionnalité.",
  },
} satisfies Record<Locale, Record<string, string>>;

function emptyDraft(): ResourceDraft {
  const copy = (): CopyDraft => ({ title: "", description: "", features: "" });
  return {
    category: "FiveM",
    author: "Nexus Development",
    tags: "",
    version: "1.0.0",
    requirement: "",
    downloadUrl: "",
    pageUrl: "",
    translations: { de: copy(), en: copy(), fr: copy() },
  };
}

export default function AdminPage() {
  const { locale } = useLocale();
  const text = labels[locale];
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [downloads, setDownloads] = useState<Record<string, number>>({});
  const [draft, setDraft] = useState<ResourceDraft>(emptyDraft);
  const [activeLocale, setActiveLocale] = useState<Locale>("de");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [adminResponse, publicResponse] = await Promise.all([
      fetch("/api/admin/resources"),
      fetch(`/api/resources?lang=${locale}`),
    ]);
    if (adminResponse.status === 401) {
      setAuthenticated(false);
      return;
    }
    const adminBody = await adminResponse.json();
    const publicBody = await publicResponse.json();
    if (!adminResponse.ok || !publicResponse.ok) {
      throw new Error(adminBody.error ?? publicBody.error ?? text.dbError);
    }
    setResources(adminBody.resources);
    setDownloads(publicBody.downloads);
  }, [locale, text.dbError]);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then(async (result: { authenticated: boolean }) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) await loadDashboard();
      })
      .catch((error: unknown) => {
        console.error("Could not check admin session.", error);
        setStatus(text.dbError);
      });
  }, [loadDashboard, text.dbError]);

  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? text.config);
      setPassword("");
      setAuthenticated(true);
      await loadDashboard();
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : text.dbError);
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/admin/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Die Admin-Sitzung konnte nicht beendet werden.");
      setAuthenticated(false);
      setResources([]);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : text.dbError);
    }
  };

  const addResource = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const translations = Object.fromEntries(localeOrder.map((language) => [
      language,
      {
        title: draft.translations[language].title.trim(),
        description: draft.translations[language].description.trim(),
        features: draft.translations[language].features.split("\n").map((feature) => feature.trim()).filter(Boolean),
      },
    ]));
    const hasAllTranslations = localeOrder.every((language) => {
      const copy = translations[language];
      return copy.title && copy.description && copy.features.length > 0;
    });
    if (!hasAllTranslations) {
      setStatus(text.validation);
      setBusy(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: draft.category,
          author: draft.author,
          tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          version: draft.version,
          requirement: draft.requirement,
          downloadUrl: draft.downloadUrl.trim(),
          pageUrl: draft.pageUrl.trim() || undefined,
          translations,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? text.dbError);
      setDraft(emptyDraft());
      await loadDashboard();
      setStatus(text.added);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : text.dbError);
    } finally {
      setBusy(false);
    }
  };

  const totalDownloads = Object.values(downloads).reduce((total, count) => total + count, 0);

  return (
    <main className="admin-page">
      <header className="admin-header">
      <Link className="admin-brand" href="/"><span className="preview-logo" aria-hidden="true">N</span><span><b>NEXUS DEVELOPMENT</b><small>Build. Share. Develop.</small></span></Link>
      <div className="admin-header-actions"><LocaleSwitcher /><Link href="/">{text.back}</Link></div>
      </header>
      <div className="admin-content">
        <div className="admin-heading"><p className="preview-eyebrow"><i /> NEXUS · ADMIN</p><h1>{text.title}<span>.</span></h1><p>{text.intro}</p></div>

        {!authenticated ? (
          <form className="admin-card admin-login" onSubmit={login}>
            <h2>{text.login}</h2>
            <label>{text.password}<input type="password" autoComplete="current-password" minLength={16} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <button className="admin-primary" type="submit" disabled={busy}>{busy ? "…" : text.signIn}</button>
            <p className="admin-hint">{text.config}</p>
            {status && <p className="admin-status" role="status">{status}</p>}
          </form>
        ) : (
          <>
            <div className="admin-dashboard-bar">
              <div><span>{text.total}</span><b>{totalDownloads.toLocaleString()}</b><small>{text.stats}</small></div>
              <button className="admin-secondary" type="button" onClick={logout}>{text.signOut}</button>
            </div>
            <form className="admin-card admin-resource-form" onSubmit={addResource}>
              <h2>{text.add}</h2>
              <div className="admin-form-grid">
                <label>{text.category}<select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option value="FiveM">{text.fivem}</option><option value="Discord Bots">{text.discord}</option><option value="Roblox">{text.roblox}</option></select></label>
                <label>{text.author}<input value={draft.author} maxLength={80} onChange={(event) => setDraft({ ...draft, author: event.target.value })} required /></label>
                <label>{text.tags}<input value={draft.tags} maxLength={250} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} /></label>
                <label>{text.version}<input value={draft.version} maxLength={30} onChange={(event) => setDraft({ ...draft, version: event.target.value })} required /></label>
                <label>{text.requirement}<input value={draft.requirement} maxLength={140} onChange={(event) => setDraft({ ...draft, requirement: event.target.value })} required /></label>
                <label>{text.downloadUrl}<input type="text" inputMode="url" value={draft.downloadUrl} onChange={(event) => setDraft({ ...draft, downloadUrl: event.target.value })} placeholder="https://… oder /downloads/datei.zip" required /></label>
                <label className="admin-wide">{text.pageUrl}<input type="url" value={draft.pageUrl} onChange={(event) => setDraft({ ...draft, pageUrl: event.target.value })} placeholder="https://…" /></label>
              </div>
              <div className="admin-locale-tabs" aria-label={text.languages}>
                {localeOrder.map((language) => <button className={activeLocale === language ? "active" : ""} key={language} type="button" onClick={() => setActiveLocale(language)}>{language.toUpperCase()}</button>)}
              </div>
              <label>{text.titleField}<input value={draft.translations[activeLocale].title} maxLength={100} onChange={(event) => setDraft({ ...draft, translations: { ...draft.translations, [activeLocale]: { ...draft.translations[activeLocale], title: event.target.value } } })} required /></label>
              <label>{text.description}<textarea value={draft.translations[activeLocale].description} maxLength={600} rows={3} onChange={(event) => setDraft({ ...draft, translations: { ...draft.translations, [activeLocale]: { ...draft.translations[activeLocale], description: event.target.value } } })} required /></label>
              <label>{text.features}<textarea value={draft.translations[activeLocale].features} maxLength={1200} rows={4} onChange={(event) => setDraft({ ...draft, translations: { ...draft.translations, [activeLocale]: { ...draft.translations[activeLocale], features: event.target.value } } })} required /></label>
              <button className="admin-primary" type="submit" disabled={busy}>{busy ? text.saving : text.add}</button>
              {status && <p className="admin-status" role="status">{status}</p>}
            </form>
            <section className="admin-card">
              <h2>{text.catalog}</h2>
              {Object.keys(downloads).length === 0 && resources.length === 0 ? <p className="admin-hint">{text.noResources}</p> : (
                <div className="admin-resource-list">
                  {Object.entries(downloads).map(([id, count]) => {
                    const addedResource = resources.find((resource) => resource.id === id);
                    const builtinName = builtInResourceNames[id]?.[locale];
                    if (!addedResource && !builtinName) return null;
                    return (
                      <article key={id}>
                        <span><b>{addedResource?.translations[locale]?.title ?? addedResource?.translations.de.title ?? builtinName}</b><small>{addedResource?.category ?? "Nexus Development"}</small></span>
                        <strong>{count.toLocaleString()} {text.downloads}</strong>
                      </article>
                    );
                  })}
                  {resources.length === 0 && <p className="admin-hint">{text.noResources}</p>}
                </div>
              )}
              {status && <p className="admin-status" role="status">{status}</p>}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

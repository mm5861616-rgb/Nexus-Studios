"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import LocaleSwitcher from "@/components/locale-switcher";
import { useLocale } from "@/lib/locale";
import { marketplaceCopy, resourceTranslations } from "@/lib/translations";

type Category = "FiveM" | "Discord Bots" | "Roblox";
type Theme = "nexus" | "black";
type IconName =
  | "arrow"
  | "bookmark"
  | "check"
  | "discord"
  | "grid"
  | "layers"
  | "roblox"
  | "search"
  | "shield"
  | "x";

type Resource = {
  id: string;
  title: string;
  author: string;
  category: Category;
  description: string;
  accent: string;
  tags: string[];
  version: string;
  requirement: string;
  features: string[];
  downloads?: number;
  href?: string | null;
  downloadUrl?: string;
};

const resources: Resource[] = [
  {
    id: "nexus-hud",
    title: "Nexus HUD",
    author: "Nexus Development",
    category: "FiveM",
    description: "Ein modernes FiveM-HUD für QBCore und ESX mit Spieler-ID, Datum, Statusanzeigen und dynamischem Tacho.",
    accent: "cyan",
    tags: ["HUD", "QBCore", "ESX"],
    version: "1.0.0",
    requirement: "QBCore oder ESX",
    features: ["QBCore-/ESX-Status und automatische Framework-Erkennung", "Spielername, Server-ID, Datum, Uhrzeit und Straßenname", "Fahrzeug-Tacho mit Geschwindigkeit, Tank und Motor"],
  },
  {
    id: "nexus-inventory",
    title: "Nexus Inventory",
    author: "Nexus Development",
    category: "FiveM",
    description: "Ein FiveM-Inventar im Nexus-Design mit Live-Items, Suche, Gewichtsanzeige und serverseitig validierten Item-Drops für ox_inventory.",
    accent: "cyan",
    tags: ["FiveM", "ox_inventory"],
    version: "1.0.0",
    requirement: "ox_inventory erforderlich",
    features: ["Live-Inventar, Gewicht und Items aus ox_inventory", "Items über ox_inventory benutzen und serverseitig sicher ablegen", "QBCore-/ESX-Server mit ox_inventory-Bridge"],
  },
  {
    id: "nexus-garage",
    title: "Nexus Garage",
    author: "Nexus Development",
    category: "FiveM",
    description: "Eine persistente Fahrzeuggarage für QBCore und ESX mit eigener NUI, Datenbankstatus und serverseitiger Eigentumsprüfung.",
    accent: "blue",
    tags: ["FiveM", "QBCore", "ESX"],
    version: "1.0.0",
    requirement: "QBCore oder ESX · oxmysql",
    features: ["Eigene Fahrzeuge über eine dunkle NUI ein- und ausparken", "Fahrzeugbesitz und Parkstatus werden serverseitig geprüft", "Tank, Motorzustand und Karosserie werden beim Einparken gespeichert"],
  },
  {
    id: "nexus-bot-v1",
    title: "Nexus Bot V1 Script",
    author: "Nexus Development",
    category: "Discord Bots",
    description: "Ein Discord.js-Script mit /commands, Moderation und privatem Ticket-System. Kein Bot-Hosting enthalten.",
    accent: "electric",
    tags: ["Discord.js", "Moderation"],
    version: "1.0.0",
    requirement: "Discord.js-kompatible Script-Umgebung",
    features: ["/commands und Moderationsbefehle mit Berechtigungsprüfungen", "/ticket-panel für private Support-Tickets", "Kein Hosting enthalten – nur der Bot-Script-Code"],
  },
  {
    id: "nexus-ticket-system",
    title: "Nexus Ticket System",
    author: "Nexus Development",
    category: "Discord Bots",
    description: "Erweiterungsscript für Discord.js-Bots: Support-Panel mit privaten Tickets für Support, Bugmeldungen und sonstige Anfragen.",
    accent: "electric",
    tags: ["Discord.js", "Tickets"],
    version: "1.0.0",
    requirement: "Discord.js 14 · bestehender Bot",
    features: ["Ticket-Panel mit Support-, Bug- und Anfrage-Buttons", "Private Kanäle nur für Ersteller, Support-Team und Bot", "Ticket durch Ersteller, Support-Rolle oder Administration schließen"],
  },
  {
    id: "nexus-roblox-admin",
    title: "Nexus Admin & Moderation",
    author: "Nexus Development",
    category: "Roblox",
    description: "Roblox-Studio-Adminscript mit servergeprüften Rollen, Kick, dauerhaften Bans, Unban, Warnungen, Moderationsprotokoll und Ingame-Panel.",
    accent: "blue",
    tags: ["Roblox Studio", "Moderation"],
    version: "1.0.0",
    requirement: "Roblox Studio · DataStore",
    features: ["Adminzugriff per Gruppenrang oder User-ID-Allowlist", "Serverseitig validierter Kick, Ban, Unban und Warn mit DataStore", "Ingame-Panel mit Online-Spielern und Moderationsprotokoll"],
  },
];

const categories: { name: Category; icon: IconName }[] = [
  { name: "FiveM", icon: "layers" },
  { name: "Discord Bots", icon: "discord" },
  { name: "Roblox", icon: "roblox" },
];

const resourcePages: Record<string, string> = {
  "nexus-hud": "/hud-preview",
  "nexus-inventory": "/inventory-preview",
  "nexus-garage": "/fivem-garage",
  "nexus-ticket-system": "/nexus-ticket-system",
  "nexus-roblox-admin": "/roblox-admin",
  "nexus-bot-v1": "/nexus-bot",
};

const preferenceListeners = new Set<() => void>();

function subscribeToPreferences(listener: () => void) {
  preferenceListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    preferenceListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getThemeSnapshot() {
  return window.localStorage.getItem("nexus-theme");
}

function getSavedResourcesSnapshot() {
  return window.localStorage.getItem("nexus-saved-resources");
}

function getPreferenceServerSnapshot() {
  return null;
}

function savePreference(key: string, value: string) {
  window.localStorage.setItem(key, value);
  preferenceListeners.forEach((listener) => listener());
}

function parseSavedResources(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((id: unknown): id is string => typeof id === "string")) return parsed;
    throw new Error("Die gespeicherte Merkliste hat ein ungültiges Format.");
  } catch (error) {
    console.error("Die gespeicherten Merkliste-Einträge konnten nicht geladen werden.", error);
    return [];
  }
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shared = {
    "aria-hidden": true as const,
    fill: "none",
    height: size,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.7,
    viewBox: "0 0 24 24",
    width: size,
  };

  const drawings: Record<IconName, ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    bookmark: <><path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-4-6 4z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    discord: <><path d="M8.2 8.1a9.3 9.3 0 0 1 7.6 0" /><path d="M7.4 16.2c2.8 1.7 6.4 1.7 9.2 0" /><path d="M8 8.2 6.5 6.7C5 8.5 4.2 10.8 4.1 14c1.5 1.8 3.3 2.8 5.4 3.3l.8-1.4" /><path d="m16 8.2 1.5-1.5c1.5 1.8 2.3 4.1 2.4 7.3-1.5 1.8-3.3 2.8-5.4 3.3l-.8-1.4" /><circle cx="9" cy="12" r=".7" fill="currentColor" /><circle cx="15" cy="12" r=".7" fill="currentColor" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>,
    roblox: <><path d="m5 7 12-3 3 12-12 3L5 7Z" /><path d="m11 10 4-1 1 4-4 1-1-4Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    x: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
  };

  return <svg {...shared}>{drawings[name]}</svg>;
}

function NexusLogo({ small = false }: { small?: boolean }) {
  return (
    <span className={`nexus-logo${small ? " nexus-logo-small" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <path d="M8 28V8l20 20V8" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="bevel" />
        <path d="M4 4h28v28H4z" stroke="currentColor" strokeOpacity=".22" />
      </svg>
    </span>
  );
}

function ResourceArtwork({ resource }: { resource: Resource }) {
  return (
    <div className="resource-art" aria-hidden="true">
      <span className="resource-cover-mark"><NexusLogo /></span>
      <span className="resource-cover-brand">NEXUS DEVELOPMENT</span>
      <span className="resource-cover-title">{resource.title}</span>
      <span className="resource-cover-type">{resource.category.toUpperCase()} · RESOURCE</span>
    </div>
  );
}

function ResourceCard({
  resource,
  saved,
  onSave,
  onOpen,
  copy,
}: {
  resource: Resource;
  saved: boolean;
  onSave: (id: string) => void;
  onOpen: (resource: Resource) => void;
  copy: Record<string, string>;
}) {
  return (
    <article className={`resource-card accent-${resource.accent}`}>
      <div className="resource-art-wrap">
        <ResourceArtwork resource={resource} />
        <span className="resource-category">{resource.category}</span>
        <button
          type="button"
          className={`save-button${saved ? " is-saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onSave(resource.id);
          }}
          aria-label={saved ? `${resource.title} – ${copy.unsave}` : `${resource.title} – ${copy.saved}`}
          title={saved ? copy.unsave : copy.saved}
        >
          <Icon name="bookmark" size={17} />
        </button>
      </div>
      <div className="resource-info">
        <div className="resource-title-row">
          <button type="button" className="resource-title" onClick={() => onOpen(resource)}>{resource.title}</button>
          <span className="resource-price">{copy.free}</span>
        </div>
        <p className="resource-author">{copy.author} <span>{resource.author}</span></p>
        <p className="resource-description">{resource.description}</p>
        <div className="resource-tags">{resource.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="resource-footer"><span><Icon name="check" size={13} />{resource.category === "FiveM" ? "FiveM" : resource.category === "Roblox" ? "Roblox" : "Discord"}</span><span>{resource.requirement}</span></div>
        {resource.downloads !== undefined && <p className="resource-download-count">{resource.downloads.toLocaleString()} {copy.downloads}</p>}
      </div>
    </article>
  );
}

export default function Home() {
  const { locale } = useLocale();
  const copy = marketplaceCopy[locale];
  const [addedResources, setAddedResources] = useState<Resource[]>([]);
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});
  const [catalogError, setCatalogError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "Alle">("Alle");
  const storedTheme = useSyncExternalStore(subscribeToPreferences, getThemeSnapshot, getPreferenceServerSnapshot);
  const storedResources = useSyncExternalStore(subscribeToPreferences, getSavedResourcesSnapshot, getPreferenceServerSnapshot);
  const theme: Theme = storedTheme === "black" ? "black" : "nexus";
  const savedIds = useMemo(() => parseSavedResources(storedResources), [storedResources]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/resources?lang=${locale}`, { signal: controller.signal })
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) {
          const message = typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : copy.dbError;
          throw new Error(message);
        }
        return result as { resources: Resource[]; downloads: Record<string, number> };
      })
      .then((result) => {
        setAddedResources(result.resources);
        setDownloadCounts(result.downloads);
        setCatalogError("");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Marketplace catalog request failed.", error);
        setCatalogError(copy.dbError);
      });
    return () => controller.abort();
  }, [locale, copy.dbError]);

  const marketplaceResources = useMemo(() => {
    const localizedStatic = resources.map((resource) => {
      const translation = resourceTranslations[resource.id]?.[locale];
      return {
        ...resource,
        ...translation,
        downloads: downloadCounts[resource.id],
      };
    });
    return [...localizedStatic, ...addedResources.map((resource) => ({
      ...resource,
      downloads: downloadCounts[resource.id] ?? resource.downloads,
    }))];
  }, [addedResources, downloadCounts, locale]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  useEffect(() => {
    if (!selectedResource) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedResource(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previouslyFocused?.focus();
    };
  }, [selectedResource]);

  const filteredResources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    return marketplaceResources.filter((resource) => {
      const matchesCategory = category === "Alle" || resource.category === category;
      const searchable = `${resource.title} ${resource.author} ${resource.category} ${resource.description} ${resource.tags.join(" ")}`.toLocaleLowerCase(locale);
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [category, locale, marketplaceResources, query]);

  const updateSaved = (id: string) => {
    const updatedIds = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
    savePreference("nexus-saved-resources", JSON.stringify(updatedIds));
  };

  return (
    <main className="marketplace">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Nexus Development Marketplace">
          <NexusLogo />
          <span className="brand-copy"><b>NEXUS <strong>DEVELOPMENT</strong></b><small>Build. Share. Develop.</small></span>
        </a>
        <div className="theme-switch" aria-label="Farbschema wählen">
          <button type="button" className={theme === "nexus" ? "active" : ""} onClick={() => savePreference("nexus-theme", "nexus")}>Nexus Blue</button>
          <button type="button" className={theme === "black" ? "active" : ""} onClick={() => savePreference("nexus-theme", "black")}>Black</button>
        </div>
        <nav className="top-navigation" aria-label={copy.resources}>
          <a className="nav-active" href="#marketplace">{copy.resources}</a>
          <a href="/admin">Admin</a>
        </nav>
        <LocaleSwitcher />
      </header>

      <div className="workspace" id="home">
        <aside className="sidebar" aria-label="Marketplace-Filter">
          <div className="sidebar-section">
            <div className="sidebar-heading"><span>{copy.resourceHeading}</span></div>
            <button type="button" className={`sidebar-link${category === "Alle" ? " selected" : ""}`} onClick={() => setCategory("Alle")}>
              <span className="sidebar-link-icon"><Icon name="grid" size={17} /></span><span>{copy.all}</span><b>{marketplaceResources.length}</b>
            </button>
            {categories.map((item) => (
              <button type="button" key={item.name} className={`sidebar-link${category === item.name ? " selected" : ""}`} onClick={() => setCategory(item.name)}>
                <span className="sidebar-link-icon"><Icon name={item.icon} size={17} /></span><span>{item.name}</span><b>{marketplaceResources.filter((resource) => resource.category === item.name).length}</b>
              </button>
            ))}
          </div>
        </aside>

        <section className="market-content" id="marketplace" aria-labelledby="market-title">
          <div className="welcome-row">
            <div>
              <p className="overline">NEXUS DEVELOPMENT · {copy.marketplace}</p>
              <h1 id="market-title">{copy.title}</h1>
              <p className="welcome-subtitle">{copy.subtitle}</p>
            </div>
            <div className="welcome-mark" aria-hidden="true"><NexusLogo /></div>
          </div>

          <div className="market-toolbar">
            <label className="search-field">
              <Icon name="search" size={19} />
              <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.searchAria} />
              {query && <button type="button" aria-label="Suche leeren" onClick={() => { setQuery(""); searchRef.current?.focus(); }}><Icon name="x" size={16} /></button>}
              {!query && <kbd>Ctrl K</kbd>}
            </label>
          </div>

          <div className="listing-heading">
            <div><h2>{category === "Alle" ? copy.listing : category}</h2><span>{filteredResources.length} {locale === "en" ? "resources" : locale === "fr" ? "ressources" : "Ressourcen"}</span></div>
            {(category !== "Alle" || query) && <button type="button" className="filter-reset" onClick={() => { setCategory("Alle"); setQuery(""); }}>{copy.reset}</button>}
          </div>

          {catalogError && <p className="catalog-status" role="status">{copy.dbError}</p>}
          {filteredResources.length > 0 ? (
            <div className="resource-grid">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} saved={savedIds.includes(resource.id)} onSave={updateSaved} onOpen={setSelectedResource} copy={copy} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span><Icon name="search" size={24} /></span>
              <h3>{copy.none}</h3>
              <p>{copy.tryAgain}</p>
              <button type="button" onClick={() => { setQuery(""); setCategory("Alle"); }}>{copy.showAll}</button>
            </div>
          )}

          <footer className="market-footer"><a className="footer-brand" href="#home"><NexusLogo small /> NEXUS DEVELOPMENT</a><span>Build. Share. Develop.</span><a href="/admin">Admin</a></footer>
        </section>
      </div>

      {selectedResource && (
        <div className="modal-backdrop" onClick={() => setSelectedResource(null)}>
          <section className={`resource-modal accent-${selectedResource.accent}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
              <button ref={modalCloseRef} type="button" className="modal-close" onClick={() => setSelectedResource(null)} aria-label="Dialog schließen"><Icon name="x" size={18} /></button>
            <ResourceArtwork resource={selectedResource} />
            <div className="modal-body">
              <span className="modal-category">{selectedResource.category}</span>
              <h2 id="modal-title">{selectedResource.title}</h2>
              <p className="modal-author">{copy.author} <b>{selectedResource.author}</b></p>
              <p className="modal-description">{selectedResource.description}</p>
              <div className="modal-stats">
                <span>{copy.free} · {selectedResource.requirement}</span>
                <span>Version {selectedResource.version}</span>
                {selectedResource.downloads !== undefined && <span>{selectedResource.downloads.toLocaleString()} {copy.downloads}</span>}
              </div>
              <div className="modal-feature-list">
                <h3>{copy.features}</h3>
                {selectedResource.features.map((feature) => <p key={feature}><Icon name="check" size={16} />{feature}</p>)}
              </div>
              <div className="modal-actions">
                <a
                  className="modal-primary"
                  href={selectedResource.href ?? resourcePages[selectedResource.id] ?? selectedResource.downloadUrl ?? "#"}
                  target={selectedResource.href?.startsWith("https://") ? "_blank" : undefined}
                  rel={selectedResource.href?.startsWith("https://") ? "noopener noreferrer" : undefined}
                >
                  {selectedResource.href ? copy.view : resourcePages[selectedResource.id] ? copy.preview : copy.download}<Icon name="arrow" size={17} />
                </a>
                {selectedResource.downloadUrl && (selectedResource.href || resourcePages[selectedResource.id]) && (
                  <a className="modal-secondary" href={selectedResource.downloadUrl}>{copy.download}<Icon name="arrow" size={17} /></a>
                )}
              </div>
              <p className="modal-disclaimer"><Icon name="shield" size={14} />{selectedResource.category === "Discord Bots" ? copy.scriptOnly : selectedResource.category === "Roblox" ? copy.robloxVerified : copy.secure}</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

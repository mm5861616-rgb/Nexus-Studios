"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LocaleSwitcher from "@/components/locale-switcher";

const linkCenterUrl = "https://link-center.net/9914283/bdrktgauIbST";
const inventoryDownloadUrl = "/api/download/nexus-inventory";

type ItemCategory = "Verbrauch" | "Ausrüstung" | "Materialien" | "Sonstiges";
type InventoryItem = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  amount: number;
  weight: number;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic";
  usable?: boolean;
};

const initialItems: InventoryItem[] = [
  { id: "water", name: "Wasser", description: "Eine Flasche frisches Wasser. Löscht den Durst und gehört in jedes Inventar.", category: "Verbrauch", amount: 5, weight: 0.5, icon: "◉", rarity: "common", usable: true },
  { id: "sandwich", name: "Sandwich", description: "Ein frisch belegtes Sandwich für die kleine Pause unterwegs.", category: "Verbrauch", amount: 3, weight: 0.4, icon: "▰", rarity: "common", usable: true },
  { id: "medkit", name: "Erste-Hilfe-Set", description: "Ein kompaktes medizinisches Set zur Versorgung kleiner Verletzungen.", category: "Verbrauch", amount: 2, weight: 1.2, icon: "✚", rarity: "uncommon", usable: true },
  { id: "bandage", name: "Verband", description: "Steriler Verband, einzeln verpackt und jederzeit griffbereit.", category: "Verbrauch", amount: 8, weight: 0.1, icon: "▤", rarity: "common", usable: true },
  { id: "phone", name: "Smartphone", description: "Dein Mobiltelefon für Anrufe, Nachrichten und wichtige Kontakte.", category: "Ausrüstung", amount: 1, weight: 0.3, icon: "▯", rarity: "uncommon", usable: true },
  { id: "radio", name: "Funkgerät", description: "Tragbares Funkgerät für die Kommunikation mit deinem Team.", category: "Ausrüstung", amount: 1, weight: 0.7, icon: "▥", rarity: "uncommon", usable: true },
  { id: "lockpick", name: "Dietrich", description: "Ein Werkzeug für geübte Hände. Nicht für jedes Schloss geeignet.", category: "Ausrüstung", amount: 2, weight: 0.2, icon: "⌁", rarity: "rare", usable: true },
  { id: "pistol", name: "Pistole", description: "Eine kompakte Seitenwaffe. Sicher und verantwortungsvoll aufbewahren.", category: "Ausrüstung", amount: 1, weight: 1.4, icon: "⌑", rarity: "rare" },
  { id: "ammo", name: "Munition", description: "Standardmunition in einer handlichen Packung.", category: "Ausrüstung", amount: 24, weight: 0.02, icon: "▮", rarity: "common" },
  { id: "repairkit", name: "Reparaturset", description: "Grundausstattung für kleinere Reparaturen an deinem Fahrzeug.", category: "Ausrüstung", amount: 1, weight: 2.5, icon: "⚙", rarity: "uncommon", usable: true },
  { id: "metalscrap", name: "Metallschrott", description: "Wiederverwertbare Metallteile aus verschiedenen Legierungen.", category: "Materialien", amount: 12, weight: 0.3, icon: "⬡", rarity: "common" },
  { id: "copper", name: "Kupferdraht", description: "Aufgewickelter Kupferdraht für Handwerk und Reparatur.", category: "Materialien", amount: 6, weight: 0.2, icon: "〰", rarity: "uncommon" },
  { id: "plastic", name: "Kunststoff", description: "Leichte Kunststoffteile, vielseitig einsetzbar.", category: "Materialien", amount: 9, weight: 0.15, icon: "⬢", rarity: "common" },
  { id: "key", name: "Fahrzeugschlüssel", description: "Der Schlüssel zu deinem aktuellen Fahrzeug.", category: "Sonstiges", amount: 1, weight: 0.05, icon: "⚿", rarity: "epic" },
  { id: "cash", name: "Bargeld", description: "Bargeld in deiner Brieftasche.", category: "Sonstiges", amount: 1250, weight: 0, icon: "$", rarity: "common" },
];

const categories = ["Alle", "Verbrauch", "Ausrüstung", "Materialien", "Sonstiges"] as const;
const maxWeight = 40;

function formatWeight(weight: number) {
  return `${weight.toLocaleString("de-DE", { maximumFractionDigits: 1 })} kg`;
}

export default function InventoryPreviewClient() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>("water");
  const [category, setCategory] = useState<(typeof categories)[number]>("Alle");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [notice, setNotice] = useState("Klicke ein Item an, um Details und Aktionen zu sehen.");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [linkCenterOpened, setLinkCenterOpened] = useState(false);

  const filteredItems = useMemo(() => items.filter((item) =>
    (category === "Alle" || item.category === category) &&
    (!query.trim() || `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase("de").includes(query.trim().toLocaleLowerCase("de")))
  ), [category, items, query]);
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;
  const currentWeight = items.reduce((total, item) => total + item.amount * item.weight, 0);
  const weightPercent = Math.min(100, currentWeight / maxWeight * 100);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (downloadDialogOpen) setDownloadDialogOpen(false);
      else setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [downloadDialogOpen]);

  const consumeItem = (item: InventoryItem) => {
    if (!item.usable) {
      setNotice(`${item.name} kann in dieser Vorschau nicht benutzt werden.`);
      return;
    }
    setItems((current) => current.flatMap((entry) => entry.id !== item.id ? [entry] : entry.amount > 1 ? [{ ...entry, amount: entry.amount - 1 }] : []));
    setNotice(`${item.name} benutzt.`);
    if (item.amount <= 1) setSelectedId(null);
  };

  const dropItem = (item: InventoryItem) => {
    setItems((current) => current.flatMap((entry) => entry.id !== item.id ? [entry] : entry.amount > 1 ? [{ ...entry, amount: entry.amount - 1 }] : []));
    setNotice(`${item.name} abgelegt.`);
    if (item.amount <= 1) setSelectedId(null);
  };

  return (
    <main className="inventory-preview-page">
      <header className="preview-header">
        <Link href="/" className="preview-brand"><span className="preview-logo"><svg viewBox="0 0 36 36"><path d="M8 28V8l20 20V8" /></svg></span><span><b>NEXUS DEVELOPMENT</b><small>Build. Share. Develop.</small></span></Link>
        <Link className="back-marketplace" href="/">← Zurück zum Marketplace</Link>
        <LocaleSwitcher />
      </header>
      <div className="inventory-preview-content">
        <div className="preview-heading inventory-heading">
          <p className="preview-eyebrow"><i /> FIVEM · OX_INVENTORY · QBCORE & ESX</p>
          <h1>Nexus Inventory <span>im Spiel.</span></h1>
          <p>Ein passendes Gegenstück zum Nexus HUD mit schneller Suche, Gewichtsanzeige und direkter Item-Aktion. Probiere das Bedienkonzept aus.</p>
        </div>

        <div className="inventory-preview-notice"><span aria-hidden="true">!</span><p><b>Website-Demo · Keine Live-Serverdaten</b><small>Alle Items, Gewichte und Aktionen sind simuliert. Die FiveM-Ressource liest echte Inventardaten aus ox_inventory.</small></p><span className="release-status">DEMO</span></div>
        <section className={`inventory-scene${isOpen ? "" : " inventory-scene-closed"}`} aria-label="Interaktive Inventar-Vorschau">
          <div className="scene-city"><i /><i /><i /><i /><i /></div>
          <div className="scene-ground" />
          <div className="scene-player"><i /><b /><span /><span /></div>
          {isOpen ? (
            <div className="inventory-window">
              <header className="inventory-topbar">
                <div className="inventory-brand-mark">N</div>
                <div className="inventory-title"><b>INVENTAR</b><small>LOS SANTOS · BÜRGER-ID 0042</small></div>
                <div className="inventory-topbar-spacer" />
                <div className="inventory-weight"><span>TRAGLAST</span><b>{formatWeight(currentWeight)} <small>/ {maxWeight} kg</small></b><i><i style={{ width: `${weightPercent}%` }} /></i></div>
                <button className="inventory-close" type="button" onClick={() => setIsOpen(false)} aria-label="Inventar schließen">×</button>
              </header>

              <div className="inventory-body">
                <nav className="inventory-categories" aria-label="Itemkategorien">
                  {categories.map((entry, index) => (
                    <button type="button" key={entry} className={category === entry ? "selected" : ""} onClick={() => setCategory(entry)}>
                      <span>{["▦", "✚", "◈", "⬡", "⋯"][index]}</span>{entry}
                      {entry === "Alle" && <b>{items.length}</b>}
                    </button>
                  ))}
                  <div className="inventory-help"><span>TIP</span><p>Items auswählen, um Aktionen und Details zu öffnen.</p></div>
                </nav>

                <div className="inventory-items-panel">
                  <div className="inventory-items-heading">
                    <div><b>DEINE ITEMS</b><span>{filteredItems.length} Gegenstände</span></div>
                    <label className="inventory-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Inventar durchsuchen" aria-label="Inventar durchsuchen" /></label>
                  </div>
                  <div className="inventory-grid" aria-label="Inventar-Slots">
                    {filteredItems.map((item, index) => (
                      <button type="button" key={item.id} className={`inventory-slot rarity-${item.rarity}${selectedId === item.id ? " is-selected" : ""}`} onClick={() => setSelectedId(item.id)} aria-label={`${item.name}, Menge ${item.amount}, ${formatWeight(item.weight * item.amount)}`} aria-pressed={selectedId === item.id}>
                        <span className="slot-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className={`item-glyph item-glyph-${item.id}`}>{item.icon}</span>
                        <span className="slot-name">{item.name}</span>
                        {item.amount > 1 && <b className="slot-count">x{item.amount}</b>}
                        <span className="slot-weight">{formatWeight(item.weight * item.amount)}</span>
                      </button>
                    ))}
                    {Array.from({ length: Math.max(0, 20 - filteredItems.length) }, (_, index) => <div className="inventory-slot empty-slot" key={`empty-${index}`} aria-hidden="true"><span className="slot-index">{String(filteredItems.length + index + 1).padStart(2, "0")}</span><span className="empty-plus">+</span></div>)}
                  </div>
                  <div className="inventory-grid-footer"><span><i />{filteredItems.length} / 20 SLOTS BELEGT</span><span>ITEM AUSWÄHLEN FÜR DETAILS</span></div>
                </div>

                <aside className="inventory-item-details" aria-label="Itemdetails">
                  {selectedItem ? (
                    <>
                      <div className={`details-item-art rarity-${selectedItem.rarity}`}><span>{selectedItem.icon}</span><i>{selectedItem.rarity === "epic" ? "★" : selectedItem.rarity.toUpperCase()}</i></div>
                      <span className="details-label">ITEM-DETAILS</span>
                      <h2>{selectedItem.name}</h2>
                      <p>{selectedItem.description}</p>
                      <div className="details-properties"><span>KATEGORIE<b>{selectedItem.category}</b></span><span>GEWICHT<b>{formatWeight(selectedItem.weight)}</b></span><span>IM BESITZ<b>{selectedItem.amount} Stück</b></span></div>
                      <div className="details-actions">
                        <button type="button" className="inventory-use-button" onClick={() => consumeItem(selectedItem)} disabled={!selectedItem.usable}>{selectedItem.usable ? "Benutzen" : "Nicht benutzbar"}<span>↗</span></button>
                        <button type="button" className="inventory-drop-button" onClick={() => dropItem(selectedItem)}>1 ablegen</button>
                      </div>
                    </>
                  ) : (
                    <div className="inventory-no-selection"><span>◈</span><b>Kein Item ausgewählt</b><p>Wähle einen Gegenstand aus deinem Inventar.</p></div>
                  )}
                </aside>
              </div>
              <footer className="inventory-hotbar">
                <span className="hotbar-title">SCHNELLZUGRIFF</span>
                {["Wasser", "Funkgerät", "Erste-Hilfe-Set", "—", "—"].map((name, index) => (
                  <button type="button" key={index} className="hotbar-slot" onClick={() => { const item = items.find((entry) => entry.name === name); if (item) setSelectedId(item.id); }}>
                    <kbd>{index + 1}</kbd><span>{name === "—" ? "—" : items.find((item) => item.name === name)?.icon ?? "—"}</span><small>{name}</small>
                  </button>
                ))}
                <span className="hotbar-hint">ESC <small>Schließen</small></span>
              </footer>
            </div>
          ) : (
            <button className="inventory-reopen" type="button" onClick={() => setIsOpen(true)}>Inventar öffnen <kbd>ESC</kbd></button>
          )}
          <div className="inventory-scene-caption"><span><i />INTERAKTIVE VORSCHAU</span><span>SIMULIERTE ITEMS · KEINE SERVERDATEN</span></div>
          <div className="inventory-toast" role="status" aria-live="polite">{notice}</div>
        </section>

        <section className="inventory-download-release">
          <span className="release-lock" aria-hidden="true">↓</span>
          <span><b>Nexus Inventory für FiveM herunterladen</b><small>Öffne zuerst den Link-Center-Werbeschritt und kehre danach hierher zurück.</small></span>
          <button className="release-download-button" type="button" onClick={() => { setLinkCenterOpened(false); setDownloadDialogOpen(true); }}>Download</button>
        </section>
        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/">Marketplace ↗</Link></footer>
      </div>
      {downloadDialogOpen && (
        <div className="download-overlay">
          <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="inventory-download-title" aria-describedby="inventory-download-description">
            <button className="download-close" type="button" aria-label="Downloadfenster schließen" onClick={() => setDownloadDialogOpen(false)}>×</button>
            <span className="download-dialog-icon" aria-hidden="true">↗</span>
            <p className="preview-eyebrow"><i /> FIVEM · OX_INVENTORY</p>
            <h2 id="inventory-download-title">Nexus Inventory herunterladen</h2>
            <p id="inventory-download-description">Öffne Link-Center in einem neuen Tab. Kehre nach dem Werbeschritt zu dieser Seite zurück, um die FiveM-Ressource herunterzuladen.</p>
            <a className="download-linkvertise-button" href={linkCenterUrl} target="_blank" rel="noopener noreferrer" onClick={() => setLinkCenterOpened(true)}>
              Weiter zu Link-Center <span aria-hidden="true">↗</span>
            </a>
            {linkCenterOpened ? (
              <a className="download-resource-button" href={inventoryDownloadUrl} download="nexus-inventory-1.0.0.zip">Zurück zur Website – Inventar herunterladen</a>
            ) : (
              <p className="download-return-hint">Der Download-Button erscheint, sobald du Link-Center geöffnet hast.</p>
            )}
            <p className="download-notice">Hinweis: Die Website kann nicht automatisch prüfen, ob der Link-Center-Werbeschritt abgeschlossen wurde.</p>
          </section>
        </div>
      )}
    </main>
  );
}

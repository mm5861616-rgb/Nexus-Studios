"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import LocaleSwitcher from "@/components/locale-switcher";

const linkvertiseUrl = "https://direct-link.net/9914283/VLbkHodlvvUh";
const hudDownloadUrl = "/api/download/nexus-hud";

type HudValues = {
  health: number;
  armor: number;
  hunger: number;
  thirst: number;
  stamina: number;
  speed: number;
  fuel: number;
  engine: number;
  inVehicle: boolean;
  talking: boolean;
};

const initialValues: HudValues = {
  health: 87,
  armor: 64,
  hunger: 72,
  thirst: 48,
  stamina: 91,
  speed: 74,
  fuel: 76,
  engine: 94,
  inVehicle: false,
  talking: false,
};

const buildings = [
  { left: 0, width: 10, height: 31, delay: 1 },
  { left: 8, width: 8, height: 49, delay: 3 },
  { left: 15, width: 12, height: 37, delay: 2 },
  { left: 25, width: 9, height: 63, delay: 4 },
  { left: 33, width: 13, height: 43, delay: 1 },
  { left: 44, width: 8, height: 56, delay: 5 },
  { left: 51, width: 14, height: 35, delay: 2 },
  { left: 64, width: 10, height: 52, delay: 3 },
  { left: 73, width: 12, height: 40, delay: 1 },
  { left: 84, width: 9, height: 60, delay: 4 },
  { left: 92, width: 12, height: 34, delay: 2 },
];

const meters: { key: keyof Pick<HudValues, "health" | "armor" | "hunger" | "thirst" | "stamina">; label: string; symbol: string }[] = [
  { key: "health", label: "GESUNDHEIT", symbol: "+" },
  { key: "armor", label: "RÜSTUNG", symbol: "⬡" },
  { key: "hunger", label: "HUNGER", symbol: "◈" },
  { key: "thirst", label: "DURST", symbol: "⌁" },
  { key: "stamina", label: "AUSDAUER", symbol: "ϟ" },
];

function HudMeter({ label, symbol, value, tone }: { label: string; symbol: string; value: number; tone: string }) {
  const circumference = 119.38;
  return (
    <div className={`demo-meter demo-meter-${tone}`} aria-label={`${label}: ${value}%`} title={`${label}: ${value}%`}>
      <svg className="demo-meter-ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="demo-ring-track" cx="24" cy="24" r="19" />
        <circle className="demo-ring-progress" cx="24" cy="24" r="19" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} />
      </svg>
      <span className="demo-meter-symbol">{symbol}</span>
      <b className="demo-meter-value">{value}</b>
    </div>
  );
}

function HudSimulator({ values }: { values: HudValues }) {
  return (
    <div className={`sim-screen${values.inVehicle ? " is-driving" : " is-on-foot"}`}>
      <div className="sim-sky" />
      <div className="sim-glow" />
      <div className="sim-horizon" />
      <div className="sim-buildings" aria-hidden="true">
        {buildings.map((building, index) => (
          <i key={index} style={{ left: `${building.left}%`, width: `${building.width}%`, height: `${building.height}%`, animationDelay: `${building.delay * -1}s` }} />
        ))}
      </div>
      <div className="sim-road"><i /><i /><i /></div>
      {values.inVehicle ? (
        <div className="sim-dashboard" aria-hidden="true"><i className="dashboard-display" /><i className="dashboard-vent" /><i className="dashboard-wheel" /></div>
      ) : (
        <div className="sim-person" aria-hidden="true"><i className="person-head" /><i className="person-body" /><i className="person-leg person-leg-left" /><i className="person-leg person-leg-right" /></div>
      )}
      <div className="sim-player-info">
        <span className="sim-player-mark">N</span>
        <span className="sim-player-copy"><b><span>Nexus Citizen</span><i className="sim-player-id">ID 0042</i></b><small><i /> 04.10.2026 <em /> 21:48</small></span>
        <b className="sim-direction">NW</b>
        <small className="sim-street">VINEWOOD BOULEVARD</small>
      </div>
      <div className="sim-hud-bottom">
        <div className="sim-minimap" aria-label="Vorschau der Spiel-Minimap">
          <span className="minimap-compass">N</span>
          <svg viewBox="0 0 130 82" aria-hidden="true">
            <path className="map-water" d="M0 57 26 49 38 54 50 43 65 48 79 38 93 43 109 28 130 33v49H0z" />
            <path className="map-road-thin" d="m-5 16 44 12 26-8 24 13 47-8M12 84 37 61l10-33m32 56 7-29 28-17m-70 1 26 19 31 1 34 15" />
            <path className="map-road-main" d="m-5 75 38-19 18-25 30-4 17-21m-2 80-6-28 14-21 28-5" />
            <circle className="map-player-dot" cx="66" cy="42" r="3.2" />
            <path className="map-player-arrow" d="m66 35-3 6h6z" />
          </svg>
          <span className="minimap-street">VINEWOOD</span>
        </div>
        <div className="sim-status">
          <div className={`demo-meter demo-meter-voice${values.talking ? " is-talking" : ""}`} aria-label={values.talking ? "Mikrofon sendet" : "Mikrofon bereit"}>
            <span className="demo-mic-icon"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0m-7 7v3m-4 0h8"/></svg></span>
            <span className="demo-voice-dot" />
          </div>
          {meters.map(({ key, label, symbol }) => (
            <HudMeter key={key} label={label} symbol={symbol} value={values[key]} tone={key} />
          ))}
        </div>
      </div>
      {values.inVehicle && (
        <div className="sim-speed-panel">
          <span className="sim-location"><i />VINEWOOD BOULEVARD</span>
          <span className="sim-gear"><small>GANG</small><b>{values.speed > 0 ? "3" : "N"}</b><small>MOTOR</small><i><i style={{ width: `${values.engine}%` }} /></i></span>
          <span className="sim-speed-ring" style={{ "--speed-progress": `${Math.min(100, values.speed / 2.4)}%` } as CSSProperties & { "--speed-progress": string }}><b>{values.speed}</b><small>KM/H</small></span>
          <span className="sim-fuel"><b>⌁</b><i><i style={{ width: `${values.fuel}%` }} /></i><small>{values.fuel}%</small></span>
        </div>
      )}
      <span className="sim-build-label">NEXUS HUD <i /> DEMO-ANSICHT</span>
    </div>
  );
}

export default function HudPreviewClient() {
  const [values, setValues] = useState(initialValues);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [linkvertiseOpened, setLinkvertiseOpened] = useState(false);
  const updateValue = (key: keyof HudValues, value: number | boolean) => setValues((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (!downloadDialogOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDownloadDialogOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [downloadDialogOpen]);

  return (
    <main className="hud-preview">
      <header className="preview-header">
        <Link href="/" className="preview-brand"><span className="preview-logo"><svg viewBox="0 0 36 36"><path d="M8 28V8l20 20V8" /></svg></span><span><b>NEXUS DEVELOPMENT</b><small>Build. Share. Develop.</small></span></Link>
        <Link className="back-marketplace" href="/">← Zurück zum Marketplace</Link>
        <LocaleSwitcher />
      </header>
      <div className="preview-content">
        <div className="preview-heading">
          <p className="preview-eyebrow"><i /> FIVEM · QBCORE & ESX</p>
          <h1>Nexus HUD <span>im Spiel.</span></h1>
          <p>Spieler-ID und Datum oben, kreisförmige Statusringe neben der Minimap. Wechsle die Szene und probier das HUD aus.</p>
        </div>

        <div className="inventory-preview-notice"><span aria-hidden="true">!</span><p><b>Website-Demo · Keine Live-Serverdaten</b><small>Alle angezeigten Werte, Szenen und Schalter sind simuliert. Die tatsächliche FiveM-Ressource liest Spielwerte im Spiel.</small></p><span className="release-status">DEMO</span></div>
        <div className="preview-layout">
          <section className="preview-stage" aria-label="Interaktive HUD-Vorschau">
            <div className="stage-topline">
              <span><i /> INTERAKTIVE DEMO</span>
              <div className="scene-switch" aria-label="HUD-Szene auswählen">
                <button type="button" aria-pressed={!values.inVehicle} className={!values.inVehicle ? "active" : ""} onClick={() => updateValue("inVehicle", false)}>Zu Fuß</button>
                <button type="button" aria-pressed={values.inVehicle} className={values.inVehicle ? "active" : ""} onClick={() => updateValue("inVehicle", true)}>Im Auto</button>
              </div>
            </div>
            <HudSimulator values={values} />
            <div className="stage-caption"><span><i />DEMO-ANSICHT</span><span>Simulierte Spielwerte</span></div>
          </section>

          <aside className="preview-controls">
            <div className="controls-heading"><span className="controls-icon">⌘</span><span><b>Demo steuern</b><small>Simulierte Anzeige anpassen</small></span></div>
            <div className="control-toggle">
              <span><b>Fahrzeugmodus</b><small>Tacho, Tank und Motor</small></span>
              <button type="button" role="switch" aria-checked={values.inVehicle} aria-label="Fahrzeugmodus umschalten" className={`toggle-switch${values.inVehicle ? " on" : ""}`} onClick={() => updateValue("inVehicle", !values.inVehicle)}><i /></button>
            </div>
            <div className="control-toggle">
              <span><b>Mikrofon aktiv</b><small>Sprachstatus anzeigen</small></span>
              <button type="button" role="switch" aria-checked={values.talking} aria-label="Mikrofon umschalten" className={`toggle-switch${values.talking ? " on" : ""}`} onClick={() => updateValue("talking", !values.talking)}><i /></button>
            </div>
            <div className="control-divider" />
            <label className="range-control"><span><b>Geschwindigkeit</b><strong>{values.speed} <small>km/h</small></strong></span><input type="range" min="0" max="240" value={values.speed} onChange={(event) => updateValue("speed", Number(event.target.value))} /></label>
            <label className="range-control"><span><b>Kraftstoff</b><strong>{values.fuel}<small>%</small></strong></span><input type="range" min="0" max="100" value={values.fuel} onChange={(event) => updateValue("fuel", Number(event.target.value))} /></label>
            {meters.map(({ key, label }) => (
              <label key={key} className="range-control"><span><b>{label.charAt(0) + label.slice(1).toLocaleLowerCase("de")}</b><strong>{values[key]}<small>%</small></strong></span><input type="range" min="0" max="100" value={values[key]} onChange={(event) => updateValue(key, Number(event.target.value))} /></label>
            ))}
            <div className="preview-compat"><span>✓</span><p><b>Framework-Ready</b><small>Automatische Erkennung für QBCore und ESX.</small></p></div>
          </aside>
        </div>

        <section className="preview-details">
          <div><span className="detail-icon">◎</span><p><b>Status neben der Minimap</b><small>Gesundheit, Rüstung, Hunger, Durst und Ausdauer als Ringe.</small></p></div>
          <div><span className="detail-icon">↗</span><p><b>Dynamischer Tacho</b><small>Fahrzeugdaten erscheinen genau dann, wenn du fährst.</small></p></div>
          <div><span className="detail-icon">⌘</span><p><b>Du bestimmst</b><small>Per Tastendruck oder /hud ein- und ausblenden.</small></p></div>
        </section>

        <section className="preview-release">
          <span className="release-lock" aria-hidden="true">↓</span>
          <span><b>Nexus HUD kostenlos herunterladen</b><small>Öffne zuerst den Linkvertise-Werbeschritt und kehre danach hierher zurück.</small></span>
          <button className="release-download-button" type="button" onClick={() => { setLinkvertiseOpened(false); setDownloadDialogOpen(true); }}>Download</button>
        </section>
        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/">Marketplace ↗</Link></footer>
      </div>
      {downloadDialogOpen && (
        <div className="download-overlay">
          <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="download-title" aria-describedby="download-description">
            <button className="download-close" type="button" aria-label="Downloadfenster schließen" onClick={() => setDownloadDialogOpen(false)}>×</button>
            <span className="download-dialog-icon" aria-hidden="true">↗</span>
            <p className="preview-eyebrow"><i /> KOSTENLOSER DOWNLOAD</p>
            <h2 id="download-title">Nexus HUD freischalten</h2>
            <p id="download-description">Öffne Linkvertise in einem neuen Tab. Kehre nach dem Werbeschritt zu dieser Seite zurück, um die FiveM-Ressource herunterzuladen.</p>
            <a className="download-linkvertise-button" href={linkvertiseUrl} target="_blank" rel="noopener noreferrer" onClick={() => setLinkvertiseOpened(true)}>
              Weiter zu Linkvertise <span aria-hidden="true">↗</span>
            </a>
            {linkvertiseOpened ? (
              <a className="download-resource-button" href={hudDownloadUrl} download="nexus-hud-1.0.0.zip">Zurück zur Website – HUD herunterladen</a>
            ) : (
              <p className="download-return-hint">Der Download-Button erscheint, sobald du Linkvertise geöffnet hast.</p>
            )}
            <p className="download-notice">Hinweis: Die Website kann nicht automatisch prüfen, ob der Linkvertise-Werbeschritt abgeschlossen wurde.</p>
          </section>
        </div>
      )}
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import LocalizedText from "@/components/localized-text";
import GarageDownload from "./garage-download";

export const metadata: Metadata = {
  title: "Nexus Garage — FiveM QBCore & ESX | Nexus Development",
  description:
    "Persistente FiveM-Fahrzeuggarage für QBCore und ESX mit eigener NUI, oxmysql und serverseitiger Eigentumsprüfung.",
};

const features = [
  {
    title: { de: "Fahrzeugbesitz serverseitig geprüft", en: "Vehicle ownership verified server-side", fr: "Propriété du véhicule vérifiée côté serveur" },
    description: { de: "Die Garage lädt Fahrzeuge aus der jeweiligen Framework-Datenbank und akzeptiert keine Fahrzeugmodelle aus der NUI.", en: "The garage loads vehicles from your framework database and never accepts vehicle models from the NUI.", fr: "Le garage charge les véhicules depuis la base du framework et n’accepte aucun modèle envoyé par la NUI." },
  },
  {
    title: { de: "Persistenter Parkstatus", en: "Persistent stored state", fr: "État de stationnement persistant" },
    description: { de: "Aus- und Einparken aktualisiert den bestehenden Fahrzeugstatus des Frameworks und verhindert doppelte Ausparkvorgänge.", en: "Parking and retrieval update the framework's existing vehicle state and prevent duplicate retrievals.", fr: "Le rangement et la sortie mettent à jour l’état existant du framework et empêchent les sorties en double." },
  },
  {
    title: { de: "Fahrzeugzustand gespeichert", en: "Vehicle condition is saved", fr: "État du véhicule enregistré" },
    description: { de: "Tankfüllung, Motor und Karosserie werden beim Einparken übernommen. Framework-Fahrzeugmods bleiben erhalten.", en: "Fuel, engine, and body health are saved when parking. Framework vehicle modifications are preserved.", fr: "Le carburant, le moteur et la carrosserie sont enregistrés au rangement. Les modifications du framework sont conservées." },
  },
  {
    title: { de: "Nexus-Dark-NUI", en: "Nexus dark NUI", fr: "NUI sombre Nexus" },
    description: { de: "Fahrzeuge werden in einer kompakten Navy-Oberfläche mit Kennzeichen, Modellname, Aktualisieren und Ausparken dargestellt.", en: "Vehicles appear in a compact navy interface with plate, model name, refresh, and retrieval controls.", fr: "Les véhicules s’affichent dans une interface bleu nuit avec plaque, modèle, actualisation et sortie." },
  },
];

const setupSteps = [
  { de: "Kopiere nexus-garage in den Ressourcenordner und passe die Beispielpositionen in config.lua an.", en: "Copy nexus-garage into your resources folder and edit the example locations in config.lua.", fr: "Copiez nexus-garage dans le dossier resources et modifiez les emplacements d’exemple dans config.lua." },
  { de: "Starte oxmysql und dein Framework vor der Garage in der server.cfg.", en: "Start oxmysql and your framework before the garage in server.cfg.", fr: "Démarrez oxmysql et votre framework avant le garage dans server.cfg." },
  { de: "Füge ensure nexus-garage hinzu und starte den Server neu.", en: "Add ensure nexus-garage and restart the server.", fr: "Ajoutez ensure nexus-garage puis redémarrez le serveur." },
  { de: "Drücke E am Garagenmarker oder nutze /nexusgarage bzw. F6.", en: "Press E at the garage marker or use /nexusgarage or F6.", fr: "Appuyez sur E au marqueur ou utilisez /nexusgarage ou F6." },
];

export default function FiveMGaragePage() {
  return (
    <main className="hud-preview bot-page">
      <header className="preview-header">
        <Link href="/" className="preview-brand">
          <span className="preview-logo" aria-hidden="true"><svg viewBox="0 0 36 36"><path d="M8 28V8l20 20V8" /></svg></span>
          <span><b>NEXUS DEVELOPMENT</b><small>Build. Share. Develop.</small></span>
        </Link>
        <Link className="back-marketplace" href="/"><LocalizedText values={{ de: "← Zurück zum Marketplace", en: "← Back to marketplace", fr: "← Retour à la boutique" }} /></Link>
        <LocaleSwitcher />
      </header>

      <div className="preview-content">
        <div className="preview-heading">
          <p className="preview-eyebrow"><i /> FIVEM · QBCORE · ESX</p>
          <h1>Nexus <span>Garage.</span></h1>
          <p><LocalizedText values={{ de: "Eine persistente Fahrzeuggarage, die sich in die Fahrzeugdaten deines vorhandenen QBCore- oder ESX-Servers einfügt.", en: "A persistent vehicle garage that integrates with the vehicle data on your existing QBCore or ESX server.", fr: "Un garage persistant intégré aux données de véhicules de votre serveur QBCore ou ESX." }} /></p>
        </div>

        <div className="inventory-preview-notice bot-security-notice">
          <span aria-hidden="true">!</span>
          <p><b><LocalizedText values={{ de: "Deine Framework-Fahrzeugdatenbank bleibt die Quelle der Wahrheit", en: "Your framework vehicle database remains the source of truth", fr: "La base de véhicules du framework reste la source de référence" }} /></b><small><LocalizedText values={{ de: "Die Ressource nutzt die vorhandenen Spielerfahrzeuge und Parkstatus aus QBCore oder ESX. Kein separates Register und keine erfundenen Fahrzeugdaten.", en: "The resource uses existing owned vehicles and stored states from QBCore or ESX. No second registry and no fabricated vehicle data.", fr: "La ressource utilise les véhicules et statuts existants de QBCore ou ESX. Aucun registre parallèle ni donnée inventée." }} /></small></p>
          <span className="release-status">FIVEM RESOURCE</span>
        </div>

        <div className="bot-command-grid ticket-feature-grid">
          {features.map(({ title, description }) => (
            <section className="bot-command-card" key={title.de}>
              <h2><LocalizedText values={title} /></h2>
              <div className="ticket-feature-copy"><p><LocalizedText values={description} /></p></div>
            </section>
          ))}
        </div>

        <section className="bot-setup-card">
          <div>
            <p className="preview-eyebrow"><i /> <LocalizedText values={{ de: "SCHNELLSTART", en: "QUICK START", fr: "DÉMARRAGE RAPIDE" }} /></p>
            <h2><LocalizedText values={{ de: "In deinen FiveM-Server einbauen", en: "Install on your FiveM server", fr: "Installer sur votre serveur FiveM" }} /></h2>
            <p><LocalizedText values={{ de: "Erfordert QBCore oder ESX, oxmysql und OneSync. Die ZIP enthält die Ressource sowie eine ausführliche deutsche Anleitung.", en: "Requires QBCore or ESX, oxmysql, and OneSync. The ZIP includes the resource and a detailed installation guide.", fr: "Nécessite QBCore ou ESX, oxmysql et OneSync. Le ZIP inclut la ressource et un guide d’installation détaillé." }} /></p>
          </div>
          <ol>
            {setupSteps.map((step) => <li key={step.de}><LocalizedText values={step} /></li>)}
          </ol>
          <pre><code>{`          ensure oxmysql
          ensure qb-core
          ensure nexus-garage`}</code></pre>
                    <p className="bot-readme-note"><LocalizedText values={{ de: "Für ESX: ersetze qb-core durch es_extended. Die Standardkoordinaten sind ein Beispiel für Legion Square. Passe Marker und Fahrzeugspawn an deine Map an; die Tabellen müssen player_vehicles (QBCore) oder owned_vehicles (ESX) sein.", en: "For ESX, replace qb-core with es_extended. Default coordinates are an example for Legion Square. Adjust marker and spawn points to your map; tables must be player_vehicles (QBCore) or owned_vehicles (ESX).", fr: "Pour ESX, remplacez qb-core par es_extended. Les coordonnées sont un exemple pour Legion Square. Adaptez les points à votre carte ; les tables doivent être player_vehicles (QBCore) ou owned_vehicles (ESX)." }} /></p>
        </section>

        <GarageDownload />

        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/"><LocalizedText values={{ de: "Marketplace ↗", en: "Marketplace ↗", fr: "Boutique ↗" }} /></Link></footer>
      </div>
    </main>
  );
}

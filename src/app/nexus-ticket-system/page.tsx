import type { Metadata } from "next";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import LocalizedText from "@/components/localized-text";
import TicketDownload from "./ticket-download";

export const metadata: Metadata = {
  title: "Nexus Ticket System — Discord.js Script | Nexus Development",
  description:
    "Ticket-Erweiterungsscript für bestehende Discord.js-Bots: private Support-, Bug- und Anfragekanäle.",
};

const commands = [
  { name: "/ticket-panel channel support-role [category]", description: { de: "Erstellt ein Support-Panel im gewählten Textkanal.", en: "Creates a support panel in the selected text channel.", fr: "Crée un panneau d’assistance dans le salon texte sélectionné." } },
  { name: "Support", description: { de: "Öffnet einen privaten Kanal für allgemeine Support-Anliegen.", en: "Opens a private channel for general support.", fr: "Ouvre un salon privé pour l’assistance générale." } },
  { name: "Bug melden", description: { de: "Öffnet einen privaten Kanal für Fehlerberichte.", en: "Opens a private channel for bug reports.", fr: "Ouvre un salon privé pour signaler un bug." } },
  { name: "Sonstige Anfrage", description: { de: "Öffnet einen privaten Kanal für andere Anliegen.", en: "Opens a private channel for other requests.", fr: "Ouvre un salon privé pour toute autre demande." } },
  { name: "Ticket schließen", description: { de: "Schließt das Ticket für die eröffnende Person; Support und Administration behalten Zugriff.", en: "Closes the ticket for its creator while support and administrators retain access.", fr: "Ferme le ticket pour son auteur, tandis que l’équipe et les administrateurs conservent l’accès." } },
];

const integrationSteps = [
  { de: "src/ticket-system.js in den src-Ordner deines bestehenden Discord.js-v14-Bots kopieren.", en: "Copy src/ticket-system.js into the src folder of your Discord.js v14 bot.", fr: "Copiez src/ticket-system.js dans le dossier src de votre bot Discord.js v14." },
  { de: "ticketPanelCommand zur Slash-Command-Liste hinzufügen und die Befehle erneut registrieren.", en: "Add ticketPanelCommand to your slash-command list and register the commands again.", fr: "Ajoutez ticketPanelCommand à votre liste de commandes slash et réenregistrez-les." },
  { de: "handleTicketInteraction(interaction) im interactionCreate-Handler vor dem Chat-Command-Filter aufrufen.", en: "Call handleTicketInteraction(interaction) in interactionCreate before the chat-command filter.", fr: "Appelez handleTicketInteraction(interaction) dans interactionCreate avant le filtre des commandes." },
  { de: "Dem Bot die erforderlichen Kanalrechte geben und /ticket-panel mit Textkanal und Support-Rolle ausführen.", en: "Grant the bot required channel permissions and run /ticket-panel with a text channel and support role.", fr: "Accordez au bot les permissions nécessaires et lancez /ticket-panel avec un salon texte et un rôle d’assistance." },
];

export default function NexusTicketSystemPage() {
  return (
    <main className="hud-preview bot-page">
      <header className="preview-header">
        <Link href="/" className="preview-brand">
          <span className="preview-logo" aria-hidden="true"><svg viewBox="0 0 36 36"><path d="M8 28V8l20 20V8" /></svg></span>
          <span><b>NEXUS DEVELOPMENT</b><small>Build. Share. Develop.</small></span>
        </Link>
        <Link className="back-marketplace" href="/">← Zurück zum Marketplace</Link>
        <LocaleSwitcher />
      </header>

      <div className="preview-content">
        <div className="preview-heading">
          <p className="preview-eyebrow"><i /> DISCORD BOTS · ERWEITERUNGSSCRIPT</p>
          <h1>Nexus Ticket <span>System.</span></h1>
          <p><LocalizedText values={{ de: "Füge Support-Tickets zu einem vorhandenen Discord.js-Bot hinzu: mit einem Panel, privaten Ticketkanälen und einer Schließen-Funktion.", en: "Add support tickets to an existing Discord.js bot with a panel, private ticket channels, and a close action.", fr: "Ajoutez des tickets à un bot Discord.js existant avec panneau, salons privés et fermeture." }} /></p>
        </div>

        <div className="inventory-preview-notice bot-security-notice">
          <span aria-hidden="true">!</span>
          <p><b><LocalizedText values={{ de: "Nur ein Add-on-Script – kein Bot und kein Hosting", en: "Add-on script only — no bot or hosting", fr: "Extension uniquement — ni bot ni hébergement" }} /></b><small><LocalizedText values={{ de: "Erfordert einen bestehenden Bot, der benutzerdefinierten Discord.js-v14-Code ausführen kann. Ein Token-Eingabefeld allein unterstützt das Script nicht.", en: "Requires an existing bot runtime that supports custom Discord.js v14 code. A token-only field cannot run this script.", fr: "Nécessite un bot existant compatible avec le code Discord.js v14 personnalisé. Un champ de token seul ne suffit pas." }} /></small></p>
          <span className="release-status">SCRIPT ONLY</span>
        </div>

        <div className="bot-command-grid ticket-feature-grid">
          <section className="bot-command-card">
            <h2><LocalizedText values={{ de: "So funktioniert es", en: "How it works", fr: "Fonctionnement" }} /></h2>
            {commands.map(({ name, description }) => (
              <div className="bot-command-row" key={name}>
                <code>{name}</code>
                <p><LocalizedText values={description} /></p>
              </div>
            ))}
          </section>
          <section className="bot-command-card">
            <h2><LocalizedText values={{ de: "Privat und übersichtlich", en: "Private and organized", fr: "Privé et organisé" }} /></h2>
            <div className="ticket-feature-copy">
              <p><LocalizedText values={{ de: "Nur Ticket-Ersteller, Support-Rolle und Bot erhalten Zugriff auf den neuen Ticketkanal. Pro Person ist ein offenes Ticket gleichzeitig möglich.", en: "Only the ticket creator, support role, and bot can access the channel. Each person may have one open ticket at a time.", fr: "Seuls l’auteur, le rôle d’assistance et le bot accèdent au salon. Une seule demande ouverte par personne." }} /></p>
              <p><LocalizedText values={{ de: "Beim Schließen wird der Kanal für den Ersteller schreibgeschützt. Der Verlauf bleibt im Kanal erhalten; es werden keine externen Transkripte angelegt.", en: "Closing makes the channel read-only for its creator. The conversation stays in the channel; no external transcript is created.", fr: "À la fermeture, le salon devient en lecture seule pour son auteur. L’historique reste dans le salon, sans transcription externe." }} /></p>
              <p><LocalizedText values={{ de: "Das Script braucht keine Datenbank und keine privilegierten Gateway-Intents. Es speichert Ticketstatus und Zugriffsinfos im Kanal-Thema.", en: "The script needs no database or privileged gateway intents. Ticket state and access data are stored in the channel topic.", fr: "Le script ne nécessite ni base de données ni intent privilégié. L’état et les accès sont stockés dans le sujet du salon." }} /></p>
            </div>
          </section>
        </div>

        <section className="bot-setup-card">
          <div>
            <p className="preview-eyebrow"><i /> <LocalizedText values={{ de: "IN EINEN BESTEHENDEN BOT INTEGRIEREN", en: "INTEGRATE WITH AN EXISTING BOT", fr: "INTÉGRER À UN BOT EXISTANT" }} /></p>
            <h2><LocalizedText values={{ de: "Einmal einbinden, dann Panel posten", en: "Integrate once, then post the panel", fr: "Intégrez une fois, puis publiez le panneau" }} /></h2>
            <p><LocalizedText values={{ de: "Kopiere die Moduldatei in den Bot, registriere den Setup-Befehl und rufe den Interaktionshandler in deinem bestehenden Bot auf.", en: "Copy the module into your bot, register the setup command, and call its interaction handler from your existing bot.", fr: "Copiez le module dans votre bot, enregistrez la commande et appelez le gestionnaire d’interactions." }} /></p>
          </div>
          <ol>
            {integrationSteps.map((step) => <li key={step.de}><LocalizedText values={step} /></li>)}
          </ol>
          <pre><code>{`import { ticketPanelCommand } from "./ticket-system.js";
import { handleTicketInteraction } from "./ticket-system.js";

// ticketPanelCommand zu deiner Slash-Command-Liste hinzufügen
// Im interactionCreate-Handler zuerst ausführen:
if (await handleTicketInteraction(interaction)) return;`}</code></pre>
          <p className="bot-readme-note">Voraussetzung: discord.js v14, Node.js 20+, ES-Module (oder angepasste Imports) und Bot-Rechte zum Ansehen/Verwalten von Kanälen, Senden von Nachrichten, Einbetten von Links und Lesen des Verlaufs.</p>
        </section>

        <TicketDownload />

        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/">Marketplace ↗</Link></footer>
      </div>
    </main>
  );
}

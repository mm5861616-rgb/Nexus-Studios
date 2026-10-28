import type { Metadata } from "next";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import LocalizedText from "@/components/localized-text";
import RobloxDownload from "./roblox-download";

export const metadata: Metadata = {
  title: "Nexus Admin & Moderation — Roblox | Nexus Development",
  description:
    "Roblox-Studio-Adminscript mit Ingame-Panel, Gruppenrang-Rechten, Kick, persistenten Bans, Warnungen und Moderationsprotokoll.",
};

const moderationFeatures = [
  ["/kick userId grund", "Kickt einen Spieler, der aktuell auf diesem Server spielt.", "Kicks a player currently in this server.", "Expulse un joueur présent sur ce serveur."],
  ["/ban userId grund", "Bannt online oder offline per numerischer User-ID. Der Ban bleibt gespeichert und wird beim Beitritt geprüft.", "Bans an online or offline user by numeric ID. The ban is saved and checked when they join.", "Bannit un utilisateur en ligne ou non par identifiant numérique. Le bannissement est vérifié à sa connexion."],
  ["/unban userId grund", "Entfernt einen dauerhaft gespeicherten Ban.", "Removes a persistent ban.", "Supprime un bannissement permanent."],
  ["/warn userId grund", "Speichert eine Warnung dauerhaft und benachrichtigt Spieler, die gerade online sind.", "Saves a warning and notifies the player if they are online.", "Enregistre un avertissement et prévient le joueur s’il est en ligne."],
  ["/commands · /admin", "Zeigt Admin-Befehle und öffnet das Ingame-Panel mit Online-Spielern und Moderationsprotokoll.", "Lists admin commands and opens the in-game panel with players and moderation logs.", "Liste les commandes et ouvre le panneau avec les joueurs et le journal de modération."],
];

const installSteps = [
  ["Config.lua als ModuleScript und Server.server.lua als Script in ServerScriptService/NexusAdminModeration einfügen.", "Add Config.lua as a ModuleScript and Server.server.lua as a Script in ServerScriptService/NexusAdminModeration.", "Ajoutez Config.lua comme ModuleScript et Server.server.lua comme Script dans ServerScriptService/NexusAdminModeration."],
  ["AdminPanel.client.lua als LocalScript in StarterPlayer/StarterPlayerScripts einfügen.", "Add AdminPanel.client.lua as a LocalScript in StarterPlayer/StarterPlayerScripts.", "Ajoutez AdminPanel.client.lua comme LocalScript dans StarterPlayer/StarterPlayerScripts."],
  ["In Config GroupId, Mindest-Rang und/oder erlaubte Roblox User-IDs konfigurieren.", "Set the group ID, minimum rank, and/or allowed Roblox user IDs in Config.", "Configurez l’identifiant du groupe, le rang minimum et/ou les identifiants Roblox autorisés."],
  ["Experience veröffentlichen und für DataStore-Tests Studio API Services aktivieren.", "Publish the experience and enable Studio API Services for DataStore testing.", "Publiez l’expérience et activez les services API Studio pour tester les DataStores."],
  ["Auf einem Testserver mit einem Admin- und einem Nicht-Admin-Konto prüfen.", "Test on a private server with both admin and non-admin accounts.", "Testez sur un serveur privé avec des comptes admin et non-admin."],
];

export default function RobloxAdminPage() {
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
          <p className="preview-eyebrow"><i /> ROBLOX · STUDIO · MODERATION</p>
          <h1>Nexus Admin <span>& Moderation.</span></h1>
          <p><LocalizedText values={{ de: "Ein Roblox-Studio-Adminscript mit Ingame-Dashboard und serverseitig geprüften Moderationsaktionen.", en: "A Roblox Studio admin script with an in-game dashboard and server-verified moderation actions.", fr: "Un script d’administration Roblox Studio avec tableau de bord en jeu et actions vérifiées côté serveur." }} /></p>
        </div>

        <div className="inventory-preview-notice bot-security-notice">
          <span aria-hidden="true">!</span>
          <p><b><LocalizedText values={{ de: "Server autorisiert jede Moderationsaktion", en: "Every moderation action is authorized by the server", fr: "Chaque action de modération est autorisée par le serveur" }} /></b><small><LocalizedText values={{ de: "Adminrechte, Gruppenränge, Ziel-IDs und DataStore-Änderungen werden serverseitig geprüft. Vor dem Live-Einsatz in einer separaten Roblox-Test-Experience konfigurieren und testen.", en: "Admin access, group ranks, target IDs, and DataStore changes are verified server-side. Configure and test in a separate Roblox experience before release.", fr: "Les accès admin, rangs, identifiants cibles et modifications DataStore sont vérifiés côté serveur. Configurez et testez dans une expérience séparée avant la mise en production." }} /></small></p>
          <span className="release-status">ROBLOX LUAU</span>
        </div>

        <div className="bot-command-grid">
          <section className="bot-command-card">
            <h2>Moderationsbefehle</h2>
            {moderationFeatures.map(([command, description]) => (
              <div className="bot-command-row" key={command}>
                <code>{command}</code>
                <p><LocalizedText values={{ de: description, en: command === "/kick userId grund" ? "Kicks a player currently in this server." : command === "/ban userId grund" ? "Bans an online or offline user by ID and checks the ban on join." : command === "/unban userId grund" ? "Removes a persistent ban." : command === "/warn userId grund" ? "Saves a warning and notifies online players." : "Lists commands and opens the in-game panel." , fr: command === "/kick userId grund" ? "Expulse un joueur présent sur ce serveur." : command === "/ban userId grund" ? "Bannit un utilisateur par identifiant et vérifie le ban à sa connexion." : command === "/unban userId grund" ? "Supprime un bannissement permanent." : command === "/warn userId grund" ? "Enregistre un avertissement et prévient les joueurs en ligne." : "Liste les commandes et ouvre le panneau en jeu." }} /></p>
              </div>
            ))}
          </section>
          <section className="bot-command-card">
            <h2>Ingame-Adminpanel</h2>
            <div className="ticket-feature-copy">
              <p><LocalizedText values={{ de: "Spielerliste der aktuellen Serverinstanz mit Auswahl per Klick oder Eingabe einer numerischen User-ID.", en: "Browse players in the current server; select one or enter a numeric user ID.", fr: "Parcourez les joueurs du serveur ; sélectionnez-en un ou saisissez un identifiant numérique." }} /></p>
              <p><LocalizedText values={{ de: "Kick, dauerhafter Ban, Unban und Warn direkt über das Panel. Warnungsverlauf für ausgewählte User-IDs anzeigen.", en: "Kick, ban, unban, or warn from the panel. Review warning history by user ID.", fr: "Expulsez, bannissez, débannissez ou avertissez depuis le panneau. Consultez l’historique par identifiant." }} /></p>
              <p><LocalizedText values={{ de: "Die neuesten protokollierten Aktionen enthalten Moderator, Ziel, Grund und Zeit. Öffnen und schließen mit Right Shift.", en: "Recent logs include moderator, target, reason, and time. Toggle with Right Shift.", fr: "Le journal indique le modérateur, la cible, le motif et l’heure. Affichez-le avec Right Shift." }} /></p>
            </div>
          </section>
        </div>

        <section className="bot-setup-card">
          <div>
            <p className="preview-eyebrow"><i /> ROBLOX-STUDIO-SCHNELLSTART</p>
            <h2><LocalizedText values={{ de: "Einrichten und Berechtigungen setzen", en: "Install and configure permissions", fr: "Installation et configuration des permissions" }} /></h2>
            <p><LocalizedText values={{ de: "Die ZIP enthält drei Luau-Scriptdateien und eine vollständige Anleitung mit exakter Roblox-Studio-Hierarchie und DataStore-Einstellungen.", en: "The ZIP contains three Luau scripts and a complete guide to the exact Roblox Studio hierarchy and DataStore settings.", fr: "Le ZIP contient trois scripts Luau et un guide complet sur la hiérarchie Roblox Studio et les paramètres DataStore." }} /></p>
          </div>
          <ol>
            {installSteps.map(([de, en, fr]) => <li key={de}><LocalizedText values={{ de, en, fr }} /></li>)}
          </ol>
          <p className="bot-readme-note"><LocalizedText values={{ de: "Autorisierung über Roblox-Gruppenrang oder eine explizite User-ID-Allowlist. GroupId und Beispiel-IDs in Config.lua vor dem Einsatz ändern.", en: "Authorize by Roblox group rank or an explicit user ID allowlist. Change GroupId and example IDs in Config.lua before use.", fr: "Autorisez par rang de groupe Roblox ou liste d’identifiants explicite. Modifiez GroupId et les identifiants d’exemple dans Config.lua." }} /></p>
        </section>

        <RobloxDownload />

        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/">Marketplace ↗</Link></footer>
      </div>
    </main>
  );
}

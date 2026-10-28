import type { Metadata } from "next";
import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import LocalizedText from "@/components/localized-text";
import BotDownload from "./bot-download";

export const metadata: Metadata = {
  title: "Nexus Bot V1 Script — Discord Moderation | Nexus Development",
  description:
    "Nexus Bot V1 ist ein Discord.js-Moderationsscript. Kein Bot-Hosting durch Nexus Development.",
};

const commandGroups = [
  {
    title: { de: "Hilfe", en: "Help", fr: "Aide" },
    commands: [{ name: "/commands", description: { de: "Zeigt dir privat die verfügbaren Bot-Befehle.", en: "Privately lists the available bot commands.", fr: "Affiche en privé les commandes disponibles du bot." } }],
  },
  {
    title: { de: "Moderation", en: "Moderation", fr: "Modération" },
    commands: [
      { name: "/clear amount", description: { de: "Löscht 1 bis 100 aktuelle Nachrichten in einem Textkanal.", en: "Deletes 1 to 100 recent messages in a text channel.", fr: "Supprime de 1 à 100 messages récents dans un salon texte." } },
      { name: "/kick member [reason]", description: { de: "Entfernt ein Mitglied vom Server.", en: "Removes a member from the server.", fr: "Expulse un membre du serveur." } },
      { name: "/ban member [reason]", description: { de: "Bannt ein Mitglied vom Server.", en: "Bans a member from the server.", fr: "Bannit un membre du serveur." } },
      { name: "/timeout member minutes [reason]", description: { de: "Schaltet ein Mitglied für 1 bis 40.320 Minuten stumm.", en: "Times out a member for 1 to 40,320 minutes.", fr: "Exclut temporairement un membre pour 1 à 40 320 minutes." } },
      { name: "/untimeout member [reason]", description: { de: "Hebt einen aktiven Timeout auf.", en: "Removes an active timeout.", fr: "Annule une exclusion temporaire active." } },
      { name: "/ticket-panel channel support-role [ticket-category]", description: { de: "Erstellt ein Panel für private Support-, Bug- und sonstige Tickets.", en: "Creates a panel for private support, bug, and other tickets.", fr: "Crée un panneau de tickets privés d’assistance, de bug et autres." } },
    ],
  },
];

const setupSteps = [
  { de: "Prüfe zuerst, ob deine Script-Plattform eigene Node.js-/Discord.js-Scripts unterstützt und dauerhaft ausführen kann.", en: "First check whether your script platform supports and can continuously run custom Node.js/Discord.js scripts.", fr: "Vérifiez d’abord que votre plateforme accepte et peut exécuter en continu des scripts Node.js/Discord.js personnalisés." },
  { de: "Importiere das Script in diese Umgebung und trage den Token nur dort im geschützten Credential-Feld ein.", en: "Import the script into that environment and enter your token only in its protected credentials field.", fr: "Importez le script dans cet environnement et saisissez le token uniquement dans son champ d’identifiants sécurisé." },
  { de: "Slash-Befehle müssen einmal mit der Application-ID und Server-ID registriert werden; folge dazu der README.", en: "Register slash commands once using the application and server IDs; see the README.", fr: "Enregistrez les commandes slash une fois avec les identifiants de l’application et du serveur ; consultez le README." },
  { de: "Vergib dem Bot nur die nötigen Moderationsrechte und setze seine Serverrolle passend über den zu moderierenden Rollen.", en: "Grant only the required moderation permissions and place the bot role above the roles it needs to moderate.", fr: "Accordez uniquement les permissions nécessaires et placez le rôle du bot au-dessus des rôles à modérer." },
];

export default function NexusBotPage() {
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
          <p className="preview-eyebrow"><i /> <LocalizedText values={{ de: "DISCORD-BOTS · DISCORD.JS", en: "DISCORD BOTS · DISCORD.JS", fr: "BOTS DISCORD · DISCORD.JS" }} /></p>
          <h1>Nexus Bot V1 <span>Script.</span></h1>
          <p><LocalizedText values={{ de: "Ein Discord.js-Script mit Slash-Befehlen für die Servermoderation. Es ist kein gehosteter Bot-Dienst und benötigt eine Script-Plattform, die dieses Format ausführen kann.", en: "A Discord.js script with slash commands for server moderation. This is not a hosted bot service and requires a runtime that supports this script.", fr: "Un script Discord.js avec commandes slash pour modérer votre serveur. Ce n’est pas un service hébergé et nécessite un environnement compatible." }} /></p>
        </div>

        <div className="inventory-preview-notice bot-security-notice">
          <span aria-hidden="true">!</span>
          <p><b><LocalizedText values={{ de: "Nur ein Script – kein Bot-Hosting enthalten", en: "Script only — bot hosting is not included", fr: "Script uniquement — aucun hébergement du bot inclus" }} /></b><small><LocalizedText values={{ de: "GhostBot kann es nur ausführen, wenn dort eigene Node.js-/Discord.js-Scripts unterstützt werden. Den Token allein einzutragen lädt dieses Script nicht automatisch hoch oder registriert Slash-Befehle.", en: "GhostBot can run it only if custom Node.js/Discord.js scripts are supported. Entering a token alone does not upload this script or register slash commands.", fr: "GhostBot ne peut l’exécuter que s’il accepte les scripts Node.js/Discord.js personnalisés. Saisir un token seul ne téléverse pas le script et n’enregistre pas les commandes slash." }} /></small></p>
          <span className="release-status">SCRIPT ONLY</span>
        </div>

        <div className="bot-command-grid">
          {commandGroups.map((group) => (
            <section className="bot-command-card" key={group.title.de}>
              <h2><LocalizedText values={group.title} /></h2>
              {group.commands.map(({ name, description }) => (
                <div className="bot-command-row" key={name}>
                  <code>{name}</code>
                  <p><LocalizedText values={description} /></p>
                </div>
              ))}
            </section>
          ))}
        </div>

        <section className="bot-setup-card">
          <div>
            <p className="preview-eyebrow"><i /> <LocalizedText values={{ de: "SCHNELLSTART", en: "QUICK START", fr: "DÉMARRAGE RAPIDE" }} /></p>
            <h2><LocalizedText values={{ de: "Script in einer Laufzeit verwenden", en: "Run the script in a compatible runtime", fr: "Exécuter le script dans un environnement compatible" }} /></h2>
            <p><LocalizedText values={{ de: "Die ZIP enthält den Script-Quellcode und die Einrichtungsanleitung. GhostBot-Kompatibilität ist nicht bestätigt: prüfe vorab, ob GhostBot Discord.js-Code und die Registrierung eigener Slash-Befehle unterstützt.", en: "The ZIP includes the script source and setup guide. GhostBot compatibility is unconfirmed; first check that it supports Discord.js code and custom slash-command registration.", fr: "Le ZIP contient le code source et le guide d’installation. La compatibilité GhostBot n’est pas confirmée : vérifiez qu’il accepte Discord.js et l’enregistrement des commandes slash." }} /></p>
          </div>
          <ol>
            {setupSteps.map((step) => <li key={step.de}><LocalizedText values={step} /></li>)}
          </ol>
          <p className="bot-readme-note"><LocalizedText values={{ de: "Voraussetzung zum direkten Ausführen: Node.js 20+, DISCORD_TOKEN sowie einmalige Registrierung mit DISCORD_CLIENT_ID und DISCORD_GUILD_ID. Details: ", en: "Direct execution requires Node.js 20+, DISCORD_TOKEN, and one-time registration with DISCORD_CLIENT_ID and DISCORD_GUILD_ID. Details: ", fr: "Exécution directe requiert Node.js 20+, DISCORD_TOKEN et l’enregistrement avec DISCORD_CLIENT_ID et DISCORD_GUILD_ID. Détails : " }} /><code>discord/nexus-bot/README.md</code></p>
        </section>

        <BotDownload />

        <footer className="preview-footer"><span>NEXUS DEVELOPMENT</span><span>Build. Share. Develop.</span><Link href="/"><LocalizedText values={{ de: "Marketplace ↗", en: "Marketplace ↗", fr: "Boutique ↗" }} /></Link></footer>
      </div>
    </main>
  );
}

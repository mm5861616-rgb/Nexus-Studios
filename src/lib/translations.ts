import type { Locale } from "@/lib/locale";

export const marketplaceCopy: Record<Locale, Record<string, string>> = {
  de: {
    resources: "Ressourcen", resourceHeading: "RESSOURCEN", all: "Alle Ressourcen", marketplace: "RESOURCE HUB",
    title: "Nexus Ressourcen.", subtitle: "Eigene FiveM-, Discord- und Roblox-Ressourcen mit ehrlichen Angaben.",
    search: "Ressourcen durchsuchen...", listing: "Nexus Ressourcen", reset: "Suche zurücksetzen",
    none: "Keine Ressourcen gefunden", tryAgain: "Versuche einen anderen Suchbegriff oder passe deine Filter an.",
    showAll: "Alle Ressourcen anzeigen", saved: "Merken", unsave: "Aus Merkliste entfernen",
    free: "Kostenlos", downloads: "Downloads", author: "von", features: "Das ist enthalten",
    view: "Details ansehen", download: "Herunterladen", preview: "Vorschau ansehen",
    categories: "Ressourcen", searchAria: "Ressourcen durchsuchen", language: "Sprache auswählen",
    dbError: "Ressourcen und Downloadstatistiken konnten nicht geladen werden. Datenbankverbindung prüfen.",
    scriptOnly: "Nur Script · kein Hosting enthalten",     secure: "Download-Link sicher über HTTPS", robloxVerified: "Roblox Studio · Serverseitig geprüft",
  },
  en: {
    resources: "Resources", resourceHeading: "RESOURCES", all: "All resources", marketplace: "RESOURCE HUB",
    title: "Nexus resources.", subtitle: "Original FiveM, Discord, and Roblox resources with honest details.",
    search: "Search resources...", listing: "Nexus resources", reset: "Reset search",
    none: "No resources found", tryAgain: "Try another search term or adjust your filters.",
    showAll: "Show all resources", saved: "Save", unsave: "Remove from saved",
    free: "Free", downloads: "Downloads", author: "by", features: "What's included",
    view: "View details", download: "Download", preview: "View preview",
    categories: "Resources", searchAria: "Search resources", language: "Select language",
    dbError: "Resources and download statistics could not be loaded. Check the database connection.",
    scriptOnly: "Script only · no hosting included",     secure: "Download link secured with HTTPS", robloxVerified: "Roblox Studio · server-side verified",
  },
  fr: {
    resources: "Ressources", resourceHeading: "RESSOURCES", all: "Toutes les ressources", marketplace: "CENTRE DE RESSOURCES",
    title: "Ressources Nexus.", subtitle: "Des ressources originales FiveM, Discord et Roblox, présentées honnêtement.",
    search: "Rechercher des ressources...", listing: "Ressources Nexus", reset: "Réinitialiser la recherche",
    none: "Aucune ressource trouvée", tryAgain: "Essayez un autre terme ou modifiez vos filtres.",
    showAll: "Afficher toutes les ressources", saved: "Enregistrer", unsave: "Retirer des favoris",
    free: "Gratuit", downloads: "Téléchargements", author: "par", features: "Contenu inclus",
    view: "Voir les détails", download: "Télécharger", preview: "Voir l’aperçu",
    categories: "Ressources", searchAria: "Rechercher des ressources", language: "Choisir la langue",
    dbError: "Impossible de charger les ressources et statistiques. Vérifiez la connexion à la base de données.",
    scriptOnly: "Script uniquement · aucun hébergement inclus",     secure: "Lien de téléchargement sécurisé par HTTPS", robloxVerified: "Roblox Studio · vérifié côté serveur",
  },
};

export const resourceTranslations: Record<string, Partial<Record<Locale, {
  title: string;
  description: string;
  requirement: string;
  tags: string[];
  features: string[];
}>>> = {
  "nexus-hud": {
    en: { title: "Nexus HUD", description: "A modern FiveM HUD for QBCore and ESX with player ID, date, status displays, and a dynamic speedometer.", requirement: "QBCore or ESX", tags: ["HUD", "QBCore", "ESX"], features: ["QBCore/ESX status with automatic framework detection", "Player name, server ID, date, time, and street name", "Vehicle speedometer with speed, fuel, and engine indicators"] },
    fr: { title: "Nexus HUD", description: "Un HUD FiveM moderne pour QBCore et ESX avec identifiant, date, indicateurs et compteur dynamique.", requirement: "QBCore ou ESX", tags: ["HUD", "QBCore", "ESX"], features: ["Statut QBCore/ESX avec détection automatique du framework", "Nom du joueur, identifiant serveur, date, heure et rue", "Compteur du véhicule avec vitesse, carburant et moteur"] },
  },
  "nexus-inventory": {
    en: { title: "Nexus Inventory", description: "A Nexus-themed FiveM inventory with live items, search, weight display, and server-validated ox_inventory item drops.", requirement: "ox_inventory required", tags: ["FiveM", "ox_inventory"], features: ["Live inventory, weight, and items from ox_inventory", "Use items through ox_inventory and drop them securely on the server", "QBCore/ESX servers with ox_inventory bridge"] },
    fr: { title: "Nexus Inventory", description: "Un inventaire FiveM au thème Nexus avec objets en direct, recherche, poids et dépôts validés par le serveur.", requirement: "ox_inventory requis", tags: ["FiveM", "ox_inventory"], features: ["Inventaire, poids et objets en direct depuis ox_inventory", "Utilisation et dépôt sécurisés par ox_inventory", "Serveurs QBCore/ESX avec le pont ox_inventory"] },
  },
  "nexus-garage": {
    en: { title: "Nexus Garage", description: "A persistent vehicle garage for QBCore and ESX with a custom NUI, database-backed vehicle state, and server-side ownership checks.", requirement: "QBCore or ESX · oxmysql", tags: ["FiveM", "QBCore", "ESX"], features: ["Park and retrieve owned vehicles in a custom dark NUI", "Server validates ownership and stored state", "Fuel, engine, and body health persist when parking"] },
    fr: { title: "Nexus Garage", description: "Un garage persistant pour QBCore et ESX avec NUI dédiée, état en base de données et vérification côté serveur.", requirement: "QBCore ou ESX · oxmysql", tags: ["FiveM", "QBCore", "ESX"], features: ["Ranger et récupérer ses véhicules dans une NUI sombre", "Propriété et statut vérifiés côté serveur", "Carburant, moteur et carrosserie enregistrés au rangement"] },
  },
  "nexus-bot-v1": {
    en: { title: "Nexus Bot V1 Script", description: "A Discord.js script with /commands, moderation, and private tickets. Bot hosting is not included.", requirement: "Discord.js-compatible runtime", tags: ["Discord.js", "Moderation"], features: ["/commands and moderation commands with permission checks", "/ticket-panel for private support tickets", "Script code only; no hosting included"] },
    fr: { title: "Script Nexus Bot V1", description: "Un script Discord.js avec /commands, modération et tickets privés. Hébergement du bot non inclus.", requirement: "Environnement compatible Discord.js", tags: ["Discord.js", "Modération"], features: ["/commands et commandes de modération avec vérification des droits", "/ticket-panel pour les tickets privés", "Code du script uniquement, sans hébergement"] },
  },
  "nexus-ticket-system": {
    en: { title: "Nexus Ticket System", description: "A Discord.js add-on for existing bots: support panels with private tickets for support, bug reports, and other requests.", requirement: "Discord.js 14 · existing bot", tags: ["Discord.js", "Tickets"], features: ["Ticket panel with support, bug, and request buttons", "Private channels for the requester, support team, and bot", "Tickets can be closed by the requester, support role, or administrators"] },
    fr: { title: "Nexus Ticket System", description: "Une extension Discord.js pour les bots existants : panneau d’assistance avec tickets privés.", requirement: "Discord.js 14 · bot existant", tags: ["Discord.js", "Tickets"], features: ["Panneau avec boutons assistance, bugs et demandes", "Salons privés pour l’auteur, l’équipe d’assistance et le bot", "Fermeture par l’auteur, l’équipe ou les administrateurs"] },
  },
  "nexus-roblox-admin": {
    en: { title: "Nexus Admin & Moderation", description: "Roblox Studio admin script with server-verified permissions, kick, persistent bans, unban, warnings, moderation logs, and an in-game panel.", requirement: "Roblox Studio · DataStore", tags: ["Roblox Studio", "Moderation"], features: ["Admin access by group rank or user ID allowlist", "Server-validated kick, ban, unban, and warnings with DataStore", "In-game panel with online players and moderation logs"] },
    fr: { title: "Nexus Admin & Modération", description: "Script d’administration Roblox Studio avec permissions vérifiées, bannissements persistants, avertissements et panneau en jeu.", requirement: "Roblox Studio · DataStore", tags: ["Roblox Studio", "Modération"], features: ["Accès admin par rang de groupe ou liste d’identifiants", "Kick, bannissement, débannissement et avertissements validés côté serveur", "Panneau en jeu avec joueurs et journal de modération"] },
  },
};

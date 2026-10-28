"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";

const linkHubUrl = "https://link-hub.net/9914283/7tWfXzEbYntn";
const botDownloadUrl = "/api/download/nexus-bot-v1";

export default function BotDownload() {
  const { locale } = useLocale();
  const copy = {
    de: { title: "Nexus Bot V1 Script kostenlos herunterladen", subtitle: "Öffne zuerst den Link-Hub-Werbeschritt und kehre danach hierher zurück. Kein Hosting enthalten.", button: "Download", eyebrow: "DISCORD · SCRIPT DOWNLOAD", dialogTitle: "Nexus Bot V1 herunterladen", instructions: "Öffne Link Hub in einem neuen Tab. Kehre anschließend hierher zurück, um das Bot-Script als ZIP herunterzuladen.", continue: "Weiter zu Link Hub", getZip: "Zurück zur Website – Script herunterladen", hint: "Der ZIP-Download erscheint, nachdem du Link Hub geöffnet hast.", notice: "Hinweis: Die Website kann nicht automatisch prüfen, ob der Link-Hub-Werbeschritt abgeschlossen wurde. Der Download enthält nur das Script, keinen Bot-Host und keinen Token.", close: "Downloadfenster schließen" },
    en: { title: "Download Nexus Bot V1 Script for free", subtitle: "Open the Link Hub step first, then return here. Hosting is not included.", button: "Download", eyebrow: "DISCORD · SCRIPT DOWNLOAD", dialogTitle: "Download Nexus Bot V1", instructions: "Open Link Hub in a new tab. Return here to download the bot script ZIP.", continue: "Continue to Link Hub", getZip: "Return to website — download script", hint: "The ZIP download appears after opening Link Hub.", notice: "Note: The website cannot verify Link Hub completion. The download contains script code only, no bot host or token.", close: "Close download dialog" },
    fr: { title: "Télécharger gratuitement le script Nexus Bot V1", subtitle: "Ouvrez d’abord Link Hub, puis revenez ici. Hébergement non inclus.", button: "Télécharger", eyebrow: "DISCORD · TÉLÉCHARGEMENT DU SCRIPT", dialogTitle: "Télécharger Nexus Bot V1", instructions: "Ouvrez Link Hub dans un nouvel onglet. Revenez ensuite ici pour télécharger le ZIP du bot.", continue: "Continuer vers Link Hub", getZip: "Retour au site — télécharger le script", hint: "Le ZIP apparaît après l’ouverture de Link Hub.", notice: "Remarque : le site ne peut pas vérifier la fin de l’étape Link Hub. Le ZIP contient uniquement le script, sans hébergement ni token.", close: "Fermer la fenêtre de téléchargement" },
  }[locale];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkHubOpened, setLinkHubOpened] = useState(false);

  useEffect(() => {
    if (!dialogOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDialogOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [dialogOpen]);

  return (
    <>
      <section className="preview-release bot-download-release">
        <span className="release-lock" aria-hidden="true">↓</span>
        <span><b>{copy.title}</b><small>{copy.subtitle}</small></span>
        <button className="release-download-button" type="button" onClick={() => { setLinkHubOpened(false); setDialogOpen(true); }}>{copy.button}</button>
      </section>

      {dialogOpen && (
        <div className="download-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="bot-download-title" aria-describedby="bot-download-description">
            <button className="download-close" type="button" aria-label={copy.close} onClick={() => setDialogOpen(false)}>×</button>
            <span className="download-dialog-icon" aria-hidden="true">↗</span>
            <p className="preview-eyebrow"><i /> {copy.eyebrow}</p>
            <h2 id="bot-download-title">{copy.dialogTitle}</h2>
            <p id="bot-download-description">{copy.instructions}</p>
            <a className="download-linkvertise-button" href={linkHubUrl} target="_blank" rel="noopener noreferrer" onClick={() => setLinkHubOpened(true)}>
              {copy.continue} <span aria-hidden="true">↗</span>
            </a>
            {linkHubOpened ? (
              <a className="download-resource-button" href={botDownloadUrl} download="nexus-bot-v1-1.0.0.zip">{copy.getZip}</a>
            ) : (
              <p className="download-return-hint">{copy.hint}</p>
            )}
            <p className="download-notice">{copy.notice}</p>
          </section>
        </div>
      )}
    </>
  );
}

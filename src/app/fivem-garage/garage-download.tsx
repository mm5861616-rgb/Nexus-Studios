"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/locale";

const linkHubUrl = "https://link-hub.net/9914283/joE7Opmb2pPH";
const garageDownloadUrl = "/api/download/nexus-garage";

export default function GarageDownload() {
  const { locale } = useLocale();
  const copy = {
    de: { title: "Nexus Garage für FiveM herunterladen", subtitle: "Öffne zuerst den Link-Hub-Werbeschritt und kehre danach hierher zurück.", button: "Download", eyebrow: "FIVEM · NEXUS GARAGE", dialogTitle: "Nexus Garage herunterladen", instructions: "Öffne Link Hub in einem neuen Tab. Kehre anschließend hierher zurück, um die FiveM-Ressource als ZIP herunterzuladen.", continue: "Weiter zu Link Hub", getZip: "Zurück zur Website – Garage herunterladen", hint: "Der ZIP-Download erscheint, nachdem du Link Hub geöffnet hast.", notice: "Hinweis: Die Website kann nicht automatisch prüfen, ob der Link-Hub-Werbeschritt abgeschlossen wurde. Die Garage benötigt QBCore oder ESX sowie oxmysql.", close: "Downloadfenster schließen" },
    en: { title: "Download Nexus Garage for FiveM", subtitle: "Open the Link Hub step first, then return here.", button: "Download", eyebrow: "FIVEM · NEXUS GARAGE", dialogTitle: "Download Nexus Garage", instructions: "Open Link Hub in a new tab. Return here afterwards to download the FiveM resource ZIP.", continue: "Continue to Link Hub", getZip: "Return to website — download garage", hint: "The ZIP download appears after opening Link Hub.", notice: "Note: This website cannot verify whether the Link Hub step was completed. The garage requires QBCore or ESX and oxmysql.", close: "Close download dialog" },
    fr: { title: "Télécharger Nexus Garage pour FiveM", subtitle: "Ouvrez d’abord Link Hub, puis revenez ici.", button: "Télécharger", eyebrow: "FIVEM · NEXUS GARAGE", dialogTitle: "Télécharger Nexus Garage", instructions: "Ouvrez Link Hub dans un nouvel onglet. Revenez ensuite ici pour télécharger le ZIP FiveM.", continue: "Continuer vers Link Hub", getZip: "Retour au site — télécharger le garage", hint: "Le téléchargement ZIP apparaît après l’ouverture de Link Hub.", notice: "Remarque : le site ne peut pas vérifier si l’étape Link Hub est terminée. Le garage nécessite QBCore ou ESX et oxmysql.", close: "Fermer la fenêtre de téléchargement" },
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
          <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="garage-download-title" aria-describedby="garage-download-description">
            <button className="download-close" type="button" aria-label={copy.close} onClick={() => setDialogOpen(false)}>×</button>
            <span className="download-dialog-icon" aria-hidden="true">↗</span>
            <p className="preview-eyebrow"><i /> {copy.eyebrow}</p>
            <h2 id="garage-download-title">{copy.dialogTitle}</h2>
            <p id="garage-download-description">{copy.instructions}</p>
            <a className="download-linkvertise-button" href={linkHubUrl} target="_blank" rel="noopener noreferrer" onClick={() => setLinkHubOpened(true)}>
              {copy.continue} <span aria-hidden="true">↗</span>
            </a>
            {linkHubOpened ? (
              <a className="download-resource-button" href={garageDownloadUrl} download="nexus-garage-1.0.0.zip">{copy.getZip}</a>
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

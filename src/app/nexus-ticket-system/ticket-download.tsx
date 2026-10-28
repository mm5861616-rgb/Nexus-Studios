"use client";

import { useEffect, useState } from "react";

const linkCenterUrl = "https://link-center.net/9914283/rIjder8DR1Fh";
const ticketDownloadUrl = "/api/download/nexus-ticket-system";

export default function TicketDownload() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [linkCenterOpened, setLinkCenterOpened] = useState(false);

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
        <span><b>Nexus Ticket System Script herunterladen</b><small>Öffne zuerst den Link-Center-Werbeschritt und kehre danach hierher zurück.</small></span>
        <button className="release-download-button" type="button" onClick={() => { setLinkCenterOpened(false); setDialogOpen(true); }}>Download</button>
      </section>

      {dialogOpen && (
        <div className="download-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <section className="download-dialog" role="dialog" aria-modal="true" aria-labelledby="ticket-download-title" aria-describedby="ticket-download-description">
            <button className="download-close" type="button" aria-label="Downloadfenster schließen" onClick={() => setDialogOpen(false)}>×</button>
            <span className="download-dialog-icon" aria-hidden="true">↗</span>
            <p className="preview-eyebrow"><i /> DISCORD · TICKET SCRIPT DOWNLOAD</p>
            <h2 id="ticket-download-title">Nexus Ticket System herunterladen</h2>
            <p id="ticket-download-description">Öffne Link-Center in einem neuen Tab. Kehre anschließend hierher zurück, um das Ticket-Erweiterungsscript als ZIP herunterzuladen.</p>
            <a className="download-linkvertise-button" href={linkCenterUrl} target="_blank" rel="noopener noreferrer" onClick={() => setLinkCenterOpened(true)}>
              Weiter zu Link-Center <span aria-hidden="true">↗</span>
            </a>
            {linkCenterOpened ? (
              <a className="download-resource-button" href={ticketDownloadUrl} download="nexus-ticket-system-1.0.0.zip">Zurück zur Website – Script herunterladen</a>
            ) : (
              <p className="download-return-hint">Der ZIP-Download erscheint, nachdem du Link-Center geöffnet hast.</p>
            )}
            <p className="download-notice">Hinweis: Die Website kann nicht automatisch prüfen, ob der Link-Center-Werbeschritt abgeschlossen wurde. Der Download enthält nur das Erweiterungsscript, keinen Bot-Host und keinen Token.</p>
          </section>
        </div>
      )}
    </>
  );
}

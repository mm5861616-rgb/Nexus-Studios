"use client";

import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import styles from "./studios.module.css";

type Locale = "de" | "en";

const copy = {
  de: {
    navBot: "Nexus Bot",
    navProjects: "Projekte",
    navZorvantis: "Zorvantis RP",
    navKnife: "Knife Legends",
    join: "Discord beitreten",
    eyebrow: "UNABHÄNGIGES STUDIO",
    heroTitle: "Wir machen",
    heroAccent: "eigene Projekte.",
    heroText: "Nexus Studios entwickelt Discord-Tools, FiveM-Rollenspiel und Roblox-Spiele. Hier findest du unsere aktuellen Projekte.",
    explore: "Unsere Projekte",
    botCta: "Nexus Bot einladen",
    botLabel: "FÜR DISCORD-SERVER",
    botFeature1: "Tickets & Support",
    botFeature2: "Captcha & Welcome",
    botFeature3: "Giveaways & Moderation",
    invite: "Bot einladen",
    projectsEyebrow: "WAS WIR MACHEN",
    projectsTitle: "Woran wir arbeiten",
    projectsText: "Drei verschiedene Projekte, entwickelt von Nexus Studios.",
    botCardDescription: "Ein vielseitiger Discord-Bot für Communitys. Ticket-Support, Verifizierung, Giveaways und Moderation in einem.",
    openDiscord: "Discord öffnen",
    zorvantisLabel: "FIVEM ROLEPLAY",
    zorvantisDescription: "Wir entwickeln Zorvantis Roleplay – eine eigene FiveM-Rollenspielwelt mit Website, Community-Forum und Dashboard.",
    website: "Website",
    forum: "Forum",
    dashboard: "Dashboard",
    roleplayBot: "Eigener Roleplay-Bot · exklusiv für Zorvantis",
    knifeLabel: "ROBLOX · IN ENTWICKLUNG",
    knifeDescription: "Knife Legends ist unser Roblox-Spiel in Entwicklung. Entdecke die Website und werde Teil der Community.",
    studioEyebrow: "NEXUS STUDIOS",
    studioTitle: "Du willst mehr erfahren?",
    studioText: "Komm auf unseren Discord und verfolge, woran wir gerade arbeiten.",
    footerTagline: "Ideen. Entwicklung. Community.",
    footerCommunity: "Community",
    footerProjects: "Projekte",
  },
  en: {
    navBot: "Nexus Bot",
    navProjects: "Projects",
    navZorvantis: "Zorvantis RP",
    navKnife: "Knife Legends",
    join: "Join Discord",
    eyebrow: "INDEPENDENT STUDIO",
    heroTitle: "We build",
    heroAccent: "our own things.",
    heroText: "Nexus Studios creates Discord tools, FiveM roleplay, and Roblox games. Here are the projects we are working on.",
    explore: "Explore projects",
    botCta: "Invite Nexus Bot",
    botLabel: "FOR DISCORD SERVERS",
    botFeature1: "Tickets & support",
    botFeature2: "Captcha & welcome",
    botFeature3: "Giveaways & moderation",
    invite: "Invite bot",
    projectsEyebrow: "WHAT WE DO",
    projectsTitle: "What we're working on",
    projectsText: "Three different projects, built by Nexus Studios.",
    botCardDescription: "A versatile Discord bot for communities. Ticket support, verification, giveaways, and moderation in one place.",
    openDiscord: "Open Discord",
    zorvantisLabel: "FIVEM ROLEPLAY",
    zorvantisDescription: "We are building Zorvantis Roleplay—a FiveM roleplay world with its own website, community forum, and dashboard.",
    website: "Website",
    forum: "Forum",
    dashboard: "Dashboard",
    roleplayBot: "Custom roleplay bot · exclusive to Zorvantis",
    knifeLabel: "ROBLOX · IN DEVELOPMENT",
    knifeDescription: "Knife Legends is our Roblox game in development. Visit the website and join the community.",
    studioEyebrow: "NEXUS STUDIOS",
    studioTitle: "Want to know more?",
    studioText: "Join our Discord and follow what we are working on.",
    footerTagline: "Ideas. Development. Community.",
    footerCommunity: "Community",
    footerProjects: "Projects",
  },
} satisfies Record<Locale, Record<string, string>>;

const links = {
  botInvite: "https://discord.com/oauth2/authorize?client_id=1563714073693126696",
  studioDiscord: "https://discord.gg/qucWXkQkWg",
  zorvantisWebsite: "https://zorvantis-roleplay-fivem-website.vercel.app/",
  zorvantisForum: "https://zorvantis-rp-forum.bolt.host/",
  zorvantisDashboard: "https://zorvantis-roleplay-fivem.carrd.co/",
  zorvantisDiscord: "https://discord.gg/bdXzRa93M3",
  knifeWebsite: "https://knife-legends-website.vercel.app/",
  knifeDiscord: "https://discord.gg/BDbgkC9yTU",
};

function DiscordMark({ size = 19 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.7 5.3A18.4 18.4 0 0 0 15.2 4l-.6 1.2a17 17 0 0 0-5.2 0L8.8 4a18.4 18.4 0 0 0-4.5 1.3C1.4 9.5.6 13.6 1 17.7a18.2 18.2 0 0 0 5.5 2.8l1.2-2a11.8 11.8 0 0 1-1.9-.9l.5-.4a13 13 0 0 0 11.4 0l.5.4a11.8 11.8 0 0 1-1.9.9l1.2 2a18.2 18.2 0 0 0 5.5-2.8c.5-4.8-.8-8.8-3.3-12.4ZM8.7 15.3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm6.6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noreferrer noopener">{children}</a>;
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("de");
  const text = copy[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <main className={styles.site}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#home" aria-label="Nexus Studios Startseite">
          <span className={styles.brandIcon}>N</span>
          <span>NEXUS <b>STUDIOS</b></span>
        </a>
        <nav className={styles.navigation} aria-label="Main navigation">
          <a href="#nexus-bot">{text.navBot}</a>
          <a href="#projects">{text.navProjects}</a>
          <a href="#zorvantis">{text.navZorvantis}</a>
          <a href="#knife-legends">{text.navKnife}</a>
          <label className={styles.language}>
            <span className={styles.srOnly}>Select language</span>
            <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Select language">
              <option value="de">🇩🇪 DE</option>
              <option value="en">🇬🇧 EN</option>
            </select>
          </label>
        </nav>
        <ExternalLink className={styles.discordButton} href={links.studioDiscord}>
          <DiscordMark />
          <span>{text.join}</span>
        </ExternalLink>
      </header>

      <section className={styles.hero} id="home">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span />{text.eyebrow}</p>
          <h1>{text.heroTitle}<br /><span>{text.heroAccent}</span></h1>
          <p className={styles.heroText}>{text.heroText}</p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#projects">{text.explore}<ArrowIcon /></a>
            <ExternalLink className={styles.secondaryButton} href={links.botInvite}>{text.botCta}</ExternalLink>
          </div>
          <div className={styles.heroFootnote}>
            <span className={styles.pulseDot} />
            <span>DISCORD <i /> FIVEM <i /> ROBLOX</span>
          </div>
        </div>

        <div className={styles.botPreview} id="nexus-bot">
          <div className={styles.previewArt}>
            <Image src="/nexus-bot.gif" alt="Nexus Bot animated logo" width={1000} height={562} unoptimized priority />
          </div>
          <div className={styles.previewCaption}>
            <div>
              <span className={styles.botLabel}>{text.botLabel}</span>
              <h2>Nexus Bot</h2>
            </div>
            <ExternalLink href={links.botInvite} className={styles.previewInvite}>
              {text.invite}<ArrowIcon />
            </ExternalLink>
          </div>
          <ul className={styles.previewFeatures}>
            <li>{text.botFeature1}</li>
            <li>{text.botFeature2}</li>
            <li>{text.botFeature3}</li>
          </ul>
        </div>
      </section>

      <section className={styles.projects} id="projects">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}><span />{text.projectsEyebrow}</p>
            <h2>{text.projectsTitle}</h2>
          </div>
          <p>{text.projectsText}</p>
        </div>

        <div className={styles.projectGrid}>
          <article className={`${styles.projectCard} ${styles.botCard}`}>
            <div className={styles.cardTopline}>
              <span className={styles.projectIndex}>01 · DISCORD</span>
            </div>
            <div className={styles.projectBody}>
              <h3>Nexus Bot</h3>
              <p>{text.botCardDescription}</p>
              <div className={styles.tagRow}><span>SUPPORT</span><span>GIVEAWAYS</span><span>MODERATION</span></div>
              <ExternalLink className={styles.textLink} href={links.botInvite}>{text.invite}<ArrowIcon /></ExternalLink>
            </div>
          </article>

          <article className={`${styles.projectCard} ${styles.zorvantisCard}`} id="zorvantis">
            <div className={styles.cardTopline}>
              <span className={styles.projectIndex}>02 · FIVEM ROLEPLAY</span>
              <span className={styles.projectSymbol}>Z</span>
            </div>
            <div className={styles.projectBody}>
              <p className={styles.cardEyebrow}>{text.zorvantisLabel}</p>
              <h3>Zorvantis<br />Roleplay</h3>
              <p>{text.zorvantisDescription}</p>
              <div className={styles.linkGrid}>
                <ExternalLink href={links.zorvantisWebsite}>{text.website}<ArrowIcon /></ExternalLink>
                <ExternalLink href={links.zorvantisForum}>{text.forum}<ArrowIcon /></ExternalLink>
                <ExternalLink href={links.zorvantisDashboard}>{text.dashboard}<ArrowIcon /></ExternalLink>
                <ExternalLink href={links.zorvantisDiscord}><DiscordMark size={16} />{text.openDiscord}</ExternalLink>
              </div>
              <div className={styles.exclusiveBot}><span>✦</span>{text.roleplayBot}</div>
            </div>
          </article>

          <article className={`${styles.projectCard} ${styles.knifeCard}`} id="knife-legends">
            <div className={styles.cardTopline}>
              <span className={styles.projectIndex}>03 · ROBLOX</span>
              <span className={styles.projectSymbol}>K</span>
            </div>
            <div className={styles.projectBody}>
              <p className={styles.cardEyebrow}>{text.knifeLabel}</p>
              <h3>Knife<br />Legends</h3>
              <p>{text.knifeDescription}</p>
              <div className={styles.linkGrid}>
                <ExternalLink href={links.knifeWebsite}>{text.website}<ArrowIcon /></ExternalLink>
                <ExternalLink href={links.knifeDiscord}><DiscordMark size={16} />{text.openDiscord}</ExternalLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={styles.studioBanner}>
        <div>
          <p className={styles.eyebrow}><span />{text.studioEyebrow}</p>
          <h2>{text.studioTitle}</h2>
          <p>{text.studioText}</p>
        </div>
        <ExternalLink className={styles.bannerButton} href={links.studioDiscord}>
          <DiscordMark />{text.join}<ArrowIcon />
        </ExternalLink>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="#home">
          <span className={styles.brandIcon}>N</span>
          <span>NEXUS <b>STUDIOS</b></span>
        </a>
        <span>{text.footerTagline}</span>
        <div>
          <ExternalLink href={links.studioDiscord}>{text.footerCommunity}</ExternalLink>
          <a href="#projects">{text.footerProjects}</a>
          <span>© {new Date().getFullYear()} Nexus Studios</span>
        </div>
      </footer>
    </main>
  );
}

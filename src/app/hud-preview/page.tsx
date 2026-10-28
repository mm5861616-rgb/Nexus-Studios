import type { Metadata } from "next";
import HudPreviewClient from "./hud-preview-client";

export const metadata: Metadata = {
  title: "Nexus HUD Vorschau — Nexus Development",
  description: "Interaktive Vorschau des Nexus HUD für FiveM.",
};

export default function HudPreviewPage() {
  return <HudPreviewClient />;
}

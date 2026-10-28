import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexus Studios — Ideas become worlds",
  description:
    "Nexus Studios entwickelt Community-Tools und Games für Discord, FiveM und Roblox.",
  openGraph: {
    title: "Nexus Studios — Ideas become worlds",
    description:
      "Entdecke Nexus Bot, Zorvantis Roleplay und Knife Legends.",
    siteName: "Nexus Studios",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Nexus Studios — Ideas become worlds",
    description: "Community-Tools und Games für Discord, FiveM und Roblox.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

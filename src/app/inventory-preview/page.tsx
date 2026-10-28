import type { Metadata } from "next";
import InventoryPreviewClient from "./inventory-preview-client";

export const metadata: Metadata = {
  title: "Nexus Inventory Vorschau — Nexus Development",
  description: "Interaktive Website-Demo zum Nexus Inventory für FiveM und ox_inventory.",
};

export default function InventoryPreviewPage() {
  return <InventoryPreviewClient />;
}

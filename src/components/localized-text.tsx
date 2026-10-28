"use client";

import { useLocale, type Locale } from "@/lib/locale";

export default function LocalizedText({ values }: { values: Record<Locale, string> }) {
  const { locale } = useLocale();
  return <>{values[locale]}</>;
}

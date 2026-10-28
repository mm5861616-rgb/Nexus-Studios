"use client";

import { useEffect } from "react";
import { useLocale, type Locale } from "@/lib/locale";

const localeNames: Record<Locale, string> = { de: "DE", en: "EN", fr: "FR" };

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <label className="locale-switcher">
      <span className="sr-only">Website language</span>
      <select value={locale} onChange={(event) => setLocale(event.target.value as Locale)} aria-label="Website language">
        {(Object.keys(localeNames) as Locale[]).map((code) => <option key={code} value={code}>{localeNames[code]}</option>)}
      </select>
    </label>
  );
}

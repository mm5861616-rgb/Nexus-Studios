"use client";

import { useSyncExternalStore } from "react";

export type Locale = "de" | "en" | "fr";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function snapshot(): Locale {
  const value = window.localStorage.getItem("nexus-locale");
  return value === "en" || value === "fr" ? value : "de";
}

function serverSnapshot(): Locale {
  return "de";
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return {
    locale,
    setLocale(nextLocale: Locale) {
      window.localStorage.setItem("nexus-locale", nextLocale);
      listeners.forEach((listener) => listener());
      document.documentElement.lang = nextLocale;
    },
  };
}

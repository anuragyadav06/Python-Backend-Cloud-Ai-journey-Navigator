// Theme store. Applies/persists light or dark mode.
import { useSyncExternalStore } from "react";

const STORAGE_KEY = "devpath:theme";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  // Fall back to OS preference if the user hasn't chosen yet.
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

let currentTheme: Theme = getInitialTheme();
const listeners = new Set<() => void>();

// Apply immediately on module load (before React renders) to avoid a flash
// of the wrong theme.
if (typeof window !== "undefined") {
  applyTheme(currentTheme);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setTheme(theme: Theme) {
  currentTheme = theme;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }
  listeners.forEach((cb) => cb());
}

export function toggleTheme() {
  setTheme(currentTheme === "dark" ? "light" : "dark");
}
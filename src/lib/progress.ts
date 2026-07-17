// Offline-first progress store. LocalStorage today, cloud-ready tomorrow.
import { useSyncExternalStore } from "react";
import { getAllMissions, getMission, getLevelForDay, LEVELS, MILESTONES, ACHIEVEMENTS, PROJECTS, totalDays } from "./curriculum";

const STORAGE_KEY = "devpath:v1";

export interface ProgressState {
  startDate: string; // ISO
  completedDays: number[]; // day numbers
  completedProjects: string[];
  notes: Record<number, string>; // day -> notes
  lastActive: string; // ISO date
  streakDays: number;
  totalXp: number;
}

const defaultState = (): ProgressState => ({
  startDate: new Date().toISOString(),
  completedDays: [],
  completedProjects: [],
  notes: {},
  lastActive: new Date().toISOString(),
  streakDays: 0,
  totalXp: 0,
});

let memoryState: ProgressState = defaultState();
let hydrated = false;
const listeners = new Set<() => void>();

function loadFromStorage(): ProgressState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
}

function ensureHydrated() {
  if (hydrated) return;
  memoryState = loadFromStorage();
  hydrated = true;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function emit() {
  listeners.forEach((cb) => cb());
}

function update(mutate: (s: ProgressState) => ProgressState | void) {
  ensureHydrated();
  const next = mutate({ ...memoryState, completedDays: [...memoryState.completedDays], completedProjects: [...memoryState.completedProjects], notes: { ...memoryState.notes } });
  memoryState = next ?? memoryState;
  persist();
  emit();
}

function getSnapshot(): ProgressState {
  ensureHydrated();
  return memoryState;
}

function getServerSnapshot(): ProgressState {
  return defaultState();
}

export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// ---- Actions ---------------------------------------------------------------

export function toggleDay(day: number) {
  update((s) => {
    const set = new Set(s.completedDays);
    const mission = getMission(day);
    const xp = mission?.xp ?? 0;
    if (set.has(day)) {
      set.delete(day);
      s.totalXp = Math.max(0, s.totalXp - xp);
    } else {
      set.add(day);
      s.totalXp += xp;
    }
    s.completedDays = [...set].sort((a, b) => a - b);
    s.lastActive = new Date().toISOString();
    s.streakDays = computeStreak(s.completedDays);
    return s;
  });
}

export function toggleProject(id: string) {
  update((s) => {
    const set = new Set(s.completedProjects);
    const project = PROJECTS.find((p) => p.id === id);
    if (set.has(id)) {
      set.delete(id);
      if (project) s.totalXp = Math.max(0, s.totalXp - project.xpReward);
    } else {
      set.add(id);
      if (project) s.totalXp += project.xpReward;
    }
    s.completedProjects = [...set];
    return s;
  });
}

export function setNote(day: number, value: string) {
  update((s) => {
    if (value.trim() === "") delete s.notes[day];
    else s.notes[day] = value;
    return s;
  });
}

export function setStartDate(date: string) {
  update((s) => {
    s.startDate = date;
    return s;
  });
}

export function resetProgress() {
  update(() => defaultState());
}

export function exportBackup(): string {
  ensureHydrated();
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data: memoryState }, null, 2);
}

export function importBackup(json: string): boolean {
  try {
    const parsed = JSON.parse(json);
    const data = parsed?.data ?? parsed;
    if (!data || typeof data !== "object") return false;
    update(() => ({ ...defaultState(), ...data }));
    return true;
  } catch {
    return false;
  }
}

// ---- Derived selectors -----------------------------------------------------

function computeStreak(completedDays: number[]): number {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => a - b);
  let streak = 1;
  let best = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      streak++;
      best = Math.max(best, streak);
    } else {
      streak = 1;
    }
  }
  return best;
}

export function currentDay(state: ProgressState): number {
  // "Today" = next unfinished day, capped at total.
  const total = totalDays();
  const sorted = [...state.completedDays].sort((a, b) => a - b);
  let next = 1;
  for (const d of sorted) {
    if (d === next) next++;
    else if (d > next) break;
  }
  return Math.min(next, total);
}

export function progressPct(state: ProgressState): number {
  return (state.completedDays.length / totalDays()) * 100;
}

export function xpForNextLevel(state: ProgressState): { level: number; nextName: string; pct: number; earned: number; needed: number } {
  const day = currentDay(state);
  const level = getLevelForDay(day);
  const missions = getAllMissions();
  const inLevel = missions.filter((m) => m.levelId === level.id);
  const totalXp = inLevel.reduce((a, m) => a + m.xp, 0);
  const earned = inLevel.filter((m) => state.completedDays.includes(m.day)).reduce((a, m) => a + m.xp, 0);
  const nextLevel = LEVELS.find((l) => l.id === level.id + 1);
  return {
    level: level.id,
    nextName: nextLevel?.name ?? "Elite Engineer",
    pct: totalXp === 0 ? 0 : (earned / totalXp) * 100,
    earned,
    needed: totalXp,
  };
}

export function nextMilestone(state: ProgressState): { milestone: (typeof MILESTONES)[number]; daysAway: number } | null {
  const day = currentDay(state);
  const upcoming = MILESTONES.find((m) => m.day >= day);
  if (!upcoming) return null;
  return { milestone: upcoming, daysAway: Math.max(0, upcoming.day - day) };
}

export function unlockedAchievements(state: ProgressState): string[] {
  const day = currentDay(state);
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    const req = a.requirement;
    if (req.type === "days" && day >= req.value) unlocked.push(a.id);
    else if (req.type === "streak" && state.streakDays >= req.value) unlocked.push(a.id);
    else if (req.type === "level") {
      const lvl = LEVELS[req.value - 1];
      const missions = getAllMissions().filter((m) => m.levelId === req.value);
      if (missions.every((m) => state.completedDays.includes(m.day)) && lvl) unlocked.push(a.id);
    } else if (req.type === "project") {
      if (req.projectId) {
        // Tied to a specific project (e.g. "ship your first RAG project"),
        // not a raw count — otherwise this could unlock via unrelated projects.
        if (state.completedProjects.includes(req.projectId)) unlocked.push(a.id);
      } else if (state.completedProjects.length >= req.value) {
        unlocked.push(a.id);
      }
    }
  }
  return unlocked;
}
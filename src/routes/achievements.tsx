import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Check } from "lucide-react";
import { ACHIEVEMENTS, MILESTONES, PROJECTS, type AchievementRequirement } from "@/lib/curriculum";
import { useProgress, unlockedAchievements, currentDay } from "@/lib/progress";
import { cn } from "@/lib/utils";

type Category = { id: string; label: string; emoji: string; match: (id: string) => boolean };

const CATEGORIES: Category[] = [
  { id: "career", label: "Career", emoji: "🏆", match: (id) => ["first-commit", "job-ready", "elite", "portfolio-complete"].includes(id) },
  { id: "python", label: "Python", emoji: "🐍", match: (id) => id === "python-explorer" },
  { id: "cs", label: "Core CS", emoji: "🧠", match: (id) => id === "cs-scholar" },
  { id: "backend", label: "Backend", emoji: "⚙️", match: (id) => id === "rest-builder" || id === "systems-architect" },
  { id: "fullstack", label: "Full-Stack", emoji: "🧩", match: (id) => id === "fullstack-engineer" },
  { id: "cloud", label: "Cloud", emoji: "☁️", match: (id) => id === "cloud-deployer" || id === "kube-captain" },
  { id: "ai", label: "AI", emoji: "🤖", match: (id) => id === "ai-explorer" || id === "rag-builder" },
  { id: "streaks", label: "Streaks", emoji: "🔥", match: (id) => id.startsWith("streak-") },
];

export default function Achievements() {
  useEffect(() => { document.title = "Achievements — Elevate"; }, []);

  const progress = useProgress();
  const unlocked = useMemo(() => new Set(unlockedAchievements(progress)), [progress]);
  const day = currentDay(progress);
  const [category, setCategory] = useState<string>("career");

  const items = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === category)!;
    return ACHIEVEMENTS.filter((a) => cat.match(a.id));
  }, [category]);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Trophy Room</div>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Achievements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Proof of work — {unlocked.size} / {ACHIEVEMENTS.length} unlocked.</p>
      </div>

      {/* Milestones timeline */}
      <section className="mt-8">
        <h2 className="mb-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Career Milestones</h2>
        <div className="premium-card p-6">
          <div className="relative">
            <div className="absolute left-0 right-0 top-6 h-[2px] bg-secondary" />
            <div
              className="absolute left-0 top-6 h-[2px]"
              style={{
                width: `${Math.min(100, (day / 600) * 100)}%`,
                background: "linear-gradient(90deg, var(--level-1), var(--level-3), var(--level-7))",
              }}
            />
            <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {MILESTONES.map((m) => {
                const reached = day >= m.day;
                return (
                  <div key={m.day} className="flex flex-col items-center text-center">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl transition-all",
                        reached ? "border-primary bg-primary/15 shadow-lg shadow-primary/20" : "border-border bg-surface"
                      )}
                    >
                      {reached ? m.emoji : <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Day {m.day}</div>
                    <div className={cn("mt-0.5 text-xs font-medium leading-tight", reached ? "text-foreground" : "text-muted-foreground")}>
                      {m.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Category selector */}
      <section className="mt-10">
        <h2 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const list = ACHIEVEMENTS.filter((a) => c.match(a.id));
            const done = list.filter((a) => unlocked.has(a.id)).length;
            const active = c.id === category;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all",
                  active
                    ? "border-transparent bg-surface-elevated text-foreground"
                    : "border-border bg-surface text-muted-foreground hover:text-foreground hover:border-border-strong"
                )}
                style={active ? { boxShadow: "inset 0 0 0 1px color-mix(in oklab, var(--primary) 60%, transparent)" } : undefined}
              >
                <span className="text-base leading-none">{c.emoji}</span>
                <span>{c.label}</span>
                <span className="text-[10.5px] text-muted-foreground">{done}/{list.length}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Achievement grid — only current category */}
      <section className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
          >
            {items.map((a) => {
              const isUnlocked = unlocked.has(a.id);
              const req = requirementText(a.requirement);
              return (
                <div
                  key={a.id}
                  className={cn(
                    "premium-card relative overflow-hidden p-4 flex items-start gap-3",
                    !isUnlocked && "opacity-60"
                  )}
                >
                  {isUnlocked && (
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25 blur-2xl bg-primary" />
                  )}
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-xl",
                    isUnlocked ? "border-border-strong bg-primary/10" : "border-border bg-surface"
                  )}>
                    {isUnlocked ? a.emoji : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display text-sm font-semibold text-foreground">{a.title}</div>
                      {isUnlocked && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{a.description}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10.5px]">
                      <span className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-muted-foreground">{req}</span>
                      <span className="rounded-md border border-border bg-background/40 px-1.5 py-0.5 text-muted-foreground">+{xpFor(a.requirement)} XP</span>
                      <span className={cn(
                        "rounded-md px-1.5 py-0.5",
                        isUnlocked ? "bg-primary/15 text-primary" : "border border-border bg-transparent text-muted-foreground"
                      )}>{isUnlocked ? "Unlocked" : "Locked"}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="premium-card p-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
                No achievements in this category yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}

function requirementText(r: AchievementRequirement): string {
  switch (r.type) {
    case "days": return `Reach day ${r.value}`;
    case "streak": return `${r.value}-day streak`;
    case "level": return `Complete Level ${r.value}`;
    case "project": {
      if (r.projectId) {
        const p = PROJECTS.find((pp) => pp.id === r.projectId);
        return p ? `Ship "${p.name}"` : "Ship a specific project";
      }
      return `Ship ${r.value} projects`;
    }
    default: return "—";
  }
}
function xpFor(r: AchievementRequirement): number {
  if (r.type === "project" && r.projectId) return 150;
  const base = { days: 5, streak: 20, level: 50, project: 30 } as Record<string, number>;
  return (base[r.type] ?? 10) * Math.max(1, Math.min(r.value, 20));
}
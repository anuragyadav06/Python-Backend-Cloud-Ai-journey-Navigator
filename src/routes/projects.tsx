import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, Check, Lock, Star, Clock, Zap, ChevronLeft, ChevronRight, Target } from "lucide-react";
import { PROJECTS, LEVELS, type ProjectQuest } from "@/lib/curriculum";
import { useProgress, toggleProject, currentDay } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  useEffect(() => { document.title = "Projects — Elevate"; }, []);
  const progress = useProgress();
  const today = currentDay(progress);
  const [levelId, setLevelId] = useState<number | null>(null);

  const projectsByLevel = useMemo(() => {
    const m = new Map<number, ProjectQuest[]>();
    for (const p of PROJECTS) {
      if (!m.has(p.levelId)) m.set(p.levelId, []);
      m.get(p.levelId)!.push(p);
    }
    return m;
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Portfolio Quests</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Pick a level. Ship the projects. Build the portfolio that gets you hired.</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{progress.completedProjects.length}</span> / {PROJECTS.length} shipped
        </div>
      </div>

      <AnimatePresence mode="wait">
        {levelId === null ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {LEVELS.map((l) => {
              const items = projectsByLevel.get(l.id) ?? [];
              if (items.length === 0) return null;
              const done = items.filter((p) => progress.completedProjects.includes(p.id)).length;
              const pct = items.length === 0 ? 0 : (done / items.length) * 100;
              const unlocked = today >= l.startDay;
              const totalDays = items.reduce((a, p) => a + p.estDays, 0);
              const hardest = items.reduce<ProjectQuest>((a, p) => (rank(p.difficulty) > rank(a.difficulty) ? p : a), items[0]);
              return (
                <button
                  key={l.id}
                  onClick={() => unlocked && setLevelId(l.id)}
                  disabled={!unlocked}
                  className={cn(
                    "premium-card group relative overflow-hidden p-5 text-left transition-all",
                    unlocked ? "hover:-translate-y-0.5 hover:border-border-strong" : "opacity-55 cursor-not-allowed"
                  )}
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl"
                    style={{ background: `var(${l.color})` }} />
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong"
                        style={{ background: `color-mix(in oklab, var(${l.color}) 22%, transparent)` }}>
                        <span className="text-lg">{l.emoji}</span>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `var(${l.color})` }}>Level {l.id}</div>
                        <div className="font-display text-[15px] font-semibold leading-tight">{l.name}</div>
                      </div>
                    </div>
                    {unlocked
                      ? <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      : <Lock className="h-4 w-4 text-muted-foreground" />}
                  </div>

                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed line-clamp-2">{l.summary}</p>

                  <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                    <MiniStat label="Projects" value={items.length.toString()} />
                    <MiniStat label="Est" value={`${totalDays}d`} />
                    <MiniStat label="Difficulty" value={cap(hardest.difficulty)} />
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                      <span>{done} / {items.length} shipped</span>
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${pct}%`, background: `var(${l.color})` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key={`level-${levelId}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            <LevelProjects
              levelId={levelId}
              onBack={() => setLevelId(null)}
              today={today}
              done={progress.completedProjects}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LevelProjects({ levelId, onBack, today, done }: { levelId: number; onBack: () => void; today: number; done: string[] }) {
  const level = LEVELS.find((l) => l.id === levelId)!;
  const items = PROJECTS.filter((p) => p.levelId === levelId);
  const shipped = items.filter((p) => done.includes(p.id)).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> All levels
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{level.emoji}</span>
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `var(${level.color})` }}>Level {level.id}</div>
              <div className="font-display text-lg font-semibold">{level.name}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Target className="h-3.5 w-3.5" style={{ color: `var(${level.color})` }} />
          {shipped} / {items.length} shipped
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            unlocked={today >= p.unlockDay}
            done={done.includes(p.id)}
            color={level.color}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project: p, unlocked, done, color }: { project: ProjectQuest; unlocked: boolean; done: boolean; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("premium-card relative flex flex-col overflow-hidden p-5", !unlocked && "opacity-55")}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl"
        style={{ background: `var(${color})` }} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `var(${color})` }}>
            <Rocket className="h-3 w-3" /> Quest · Day {p.unlockDay}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{p.name}</h3>
          <div className="text-xs text-muted-foreground">{p.tagline}</div>
        </div>
        <button
          disabled={!unlocked}
          onClick={() => toggleProject(p.id)}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-all",
            done ? "bg-primary border-primary text-primary-foreground" : "border-border-strong text-muted-foreground hover:text-foreground hover:border-primary/60",
            !unlocked && "cursor-not-allowed"
          )}
        >
          {done ? <Check className="h-4 w-4" /> : !unlocked ? <Lock className="h-3.5 w-3.5" /> : null}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{p.description}</p>

      <div className="mt-4 grid grid-cols-4 gap-2 text-[11px]">
        <Stat icon={<Clock className="h-3 w-3" />} label="Est" value={`${p.estDays}d`} />
        <Stat icon={<Zap className="h-3 w-3" />} label="XP" value={p.xpReward.toString()} />
        <Stat icon={<Star className="h-3 w-3" />} label="Value" value={"★".repeat(p.portfolioValue)} />
        <Stat icon={<Target className="h-3 w-3" />} label="Diff" value={cap(p.difficulty)} />
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Requirements</div>
        <ul className="space-y-1 text-xs text-foreground/85">
          {p.requirements.map((r) => (
            <li key={r} className="flex gap-2">
              <span className="mt-1 h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Skills</div>
        <div className="flex flex-wrap gap-1.5">
          {p.skills.map((s) => (
            <span key={s} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[10.5px] text-muted-foreground">{s}</span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-1.5">Tasks</div>
        <div className="flex flex-wrap gap-1">
          {p.tasks.map((t) => (
            <span key={t} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10.5px] text-foreground/70">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 text-sm font-medium text-foreground">{value}</div>
    </div>
  );
}

function rank(d: ProjectQuest["difficulty"]): number {
  return { easy: 1, medium: 2, hard: 3, elite: 4 }[d];
}
function cap(s: string) { return s[0].toUpperCase() + s.slice(1); }

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  Flame, Zap, Target, Trophy, TrendingUp, Clock, Rocket, ChevronRight, Check, Sparkles, GraduationCap,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import {
  useProgress, currentDay, progressPct, xpForNextLevel, nextMilestone, toggleDay,
} from "@/lib/progress";
import { getLevelForDay, getMission, LEVELS, PROJECTS, totalDays } from "@/lib/curriculum";

export default function Dashboard() {
  useEffect(() => { document.title = "Dashboard — Elevate"; }, []);
  const progress = useProgress();
  const day = currentDay(progress);
  const level = getLevelForDay(day);
  const mission = getMission(day);
  const pct = progressPct(progress);
  const xp = xpForNextLevel(progress);
  const ms = nextMilestone(progress);
  const total = totalDays();
  const jobReadyPct = Math.min(100, (day / 400) * 100);

  const completedThisWeek = progress.completedDays.filter((d) => d > day - 7 && d <= day).length;
  const activeProject = PROJECTS.find((p) => p.unlockDay <= day && !progress.completedProjects.includes(p.id));

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-gradient-primary">
            Welcome back, engineer.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Day {day} of {total} · {level.emoji} {level.name}
          </p>
        </div>
        <Link
          to="/roadmap"
          className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-sm text-foreground/85 hover:bg-surface-elevated transition-colors"
        >
          View full roadmap <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Today's mission — hero card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="premium-card relative mt-6 overflow-hidden p-6 md:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(600px 200px at 100% 0%, color-mix(in oklab, var(${level.color}) 30%, transparent), transparent 70%)`,
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-background/40 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                <Sparkles className="h-3 w-3" style={{ color: `var(${level.color})` }} /> Today's Mission
              </span>
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Level {level.id} · Week {mission?.week}
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl md:text-[28px] font-semibold tracking-tight">
              {mission?.title ?? "Journey complete"}
            </h2>
            {mission && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
                {mission.objective}
              </p>
            )}
            {mission && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px]">
                <MetaChip icon={<Clock className="h-3 w-3" />}>{mission.estMinutes} min</MetaChip>
                <MetaChip icon={<Zap className="h-3 w-3" />}>{mission.xp} XP</MetaChip>
                <MetaChip icon={<Target className="h-3 w-3" />} capitalize>{mission.difficulty}</MetaChip>
                <MetaChip>{mission.type}</MetaChip>
              </div>
            )}
            {mission && mission.subtopics.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                  <GraduationCap className="h-3 w-3" style={{ color: `var(${level.color})` }} />
                  What to cover today
                </div>
                <ul className="mt-2 space-y-1.5">
                  {mission.subtopics.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: `var(${level.color})` }}
                      />
                      <span className="leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <button
              onClick={() => mission && toggleDay(mission.day)}
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              <Check className="h-4 w-4" />
              Complete Mission
            </button>
            <div className="text-xs text-muted-foreground">Expected: {mission?.outcome}</div>
          </div>
        </div>
      </motion.div>

      {/* Stat grid */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Current Streak"
          value={<>{progress.streakDays}<span className="ml-1 text-lg text-muted-foreground">days</span></>}
          hint="Consistency compounds"
          icon={<Flame className="h-4 w-4" />}
          accent="--level-6"
        />
        <StatCard
          label="Total XP"
          value={progress.totalXp.toLocaleString()}
          hint={`${xp.pct.toFixed(0)}% through ${LEVELS[xp.level - 1]?.name}`}
          icon={<Zap className="h-4 w-4" />}
          accent="--level-7"
        />
        <StatCard
          label="This Week"
          value={<>{completedThisWeek}<span className="ml-1 text-lg text-muted-foreground">/ 7</span></>}
          hint="Missions completed"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="--level-1"
        />
        <StatCard
          label="Career Readiness"
          value={<>{jobReadyPct.toFixed(0)}<span className="text-lg text-muted-foreground">%</span></>}
          hint={day >= 400 ? "Job ready 🎉" : `${400 - day} days to Job Ready`}
          icon={<Trophy className="h-4 w-4" />}
          accent="--level-3"
        />
      </div>

      {/* Two-column: journey progression + right rail */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Journey */}
        <div className="lg:col-span-2 premium-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Career Progression</div>
              <div className="mt-1 font-display text-lg font-semibold">Python → Elite AI Engineer</div>
            </div>
            <div className="text-xs text-muted-foreground">{pct.toFixed(1)}% of journey</div>
          </div>

          {/* Journey rail */}
          <div className="mt-6">
            <div className="relative h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--level-1), var(--level-3), var(--level-7))" }}
              />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {LEVELS.map((l) => {
                const reached = day >= l.startDay;
                const active = day >= l.startDay && day <= l.endDay;
                return (
                  <Link
                    key={l.id}
                    to={`/roadmap#level-${l.id}`}
                    className="group flex flex-col items-center text-center gap-1.5"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all group-hover:scale-105"
                      style={{
                        background: reached ? `color-mix(in oklab, var(${l.color}) 22%, transparent)` : "transparent",
                        borderColor: active ? `var(${l.color})` : "var(--border)",
                        boxShadow: active ? `0 0 0 3px color-mix(in oklab, var(${l.color}) 20%, transparent)` : "none",
                      }}
                    >
                      <span className="text-base">{l.emoji}</span>
                    </div>
                    <div className="text-[10.5px] leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
                      L{l.id}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Current Level Progress</div>
              <div className="mt-2 font-display text-lg font-semibold">{level.emoji} {level.name}</div>
              <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${xp.pct}%`, background: `var(${level.color})` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{xp.earned} / {xp.needed} XP</span>
                <span>Next: {xp.nextName}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Upcoming Milestone</div>
              {ms ? (
                <>
                  <div className="mt-2 font-display text-lg font-semibold">
                    {ms.milestone.emoji} {ms.milestone.title}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{ms.milestone.description}</div>
                  <div className="mt-3 text-[11px] uppercase tracking-[0.14em]" style={{ color: `var(${level.color})` }}>
                    {ms.daysAway === 0 ? "Today" : `${ms.daysAway} days away`}
                  </div>
                </>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">You've reached the summit.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-4">
          <div className="premium-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Active Project</div>
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </div>
            {activeProject ? (
              <>
                <div className="mt-2 font-display text-lg font-semibold">{activeProject.name}</div>
                <div className="text-xs text-muted-foreground">{activeProject.tagline}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeProject.skills.slice(0, 4).map((s) => (
                    <span key={s} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[10.5px] text-muted-foreground">{s}</span>
                  ))}
                </div>
                <Link to="/projects" className="mt-4 inline-flex items-center gap-1 text-xs text-foreground hover:text-primary transition-colors">
                  Open project quests <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </>
            ) : (
              <div className="mt-2 text-sm text-muted-foreground">Unlock your first project by day 28.</div>
            )}
          </div>

          <div className="premium-card p-5">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Skill Unlocking Next</div>
            <div className="mt-3 space-y-2">
              {level.skills.slice(0, 5).map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: `var(${level.color})` }} />
                  <span className="text-foreground/85">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaChip({ icon, children, capitalize }: { icon?: React.ReactNode; children: React.ReactNode; capitalize?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-1 text-muted-foreground ${capitalize ? "capitalize" : ""}`}>
      {icon}
      {children}
    </span>
  );
}

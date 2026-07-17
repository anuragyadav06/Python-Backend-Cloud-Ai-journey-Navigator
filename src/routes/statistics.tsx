import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Activity, Flame, Trophy, Clock, TrendingUp, Target, BarChart3, Rocket } from "lucide-react";
import { LEVELS, PROJECTS, MILESTONES, getAllMissions, getLevelForDay, getMission, totalDays } from "@/lib/curriculum";
import { useProgress, currentDay, xpForNextLevel, nextMilestone } from "@/lib/progress";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

const SKILL_GROUPS: { label: string; match: (s: string) => boolean }[] = [
  { label: "Python", match: (s) => /python|oop|pathlib|files/i.test(s) },
  { label: "Git & Linux", match: (s) => /git|linux|github/i.test(s) },
  { label: "DSA", match: (s) => /dsa|algorithm/i.test(s) },
  { label: "SQL & DB", match: (s) => /sql|dbms|postgres|mongodb|redis/i.test(s) },
  { label: "Backend", match: (s) => /fastapi|rest|auth|jwt|testing|async|sqlalchemy/i.test(s) },
  { label: "Cloud & DevOps", match: (s) => /aws|docker|ci\/cd|nginx|kubernetes|terraform|observability|s3|ec2|rds|github actions/i.test(s) },
  { label: "System Design", match: (s) => /system design|distributed|microservices|kafka|performance/i.test(s) },
  { label: "AI & ML", match: (s) => /ml|numpy|pandas|pytorch|llm|embedding|vector|rag|langchain|agent|ai|mlops|scikit/i.test(s) },
];

export default function StatisticsPage() {
  useEffect(() => { document.title = "Statistics — Elevate"; }, []);

  const progress = useProgress();
  const day = currentDay(progress);
  const missions = getAllMissions();
  const total = totalDays();
  const level = getLevelForDay(day);
  const mission = getMission(day);
  const xp = xpForNextLevel(progress);
  const ms = nextMilestone(progress);
  const done = new Set(progress.completedDays);

  const totalMinutes = useMemo(() => missions.filter((m) => done.has(m.day)).reduce((a, m) => a + m.estMinutes, 0), [missions, progress.completedDays]);
  const hours = totalMinutes / 60;
  const avgDaily = progress.completedDays.length === 0 ? 0 : totalMinutes / progress.completedDays.length;

  const jobReadyPct = Math.min(100, (day / 400) * 100);
  const completionPct = (progress.completedDays.length / missions.length) * 100;

  // Skills: totals derived from missions, per group
  const skillStats = useMemo(() => {
    return SKILL_GROUPS.map((g) => {
      const relevant = missions.filter((m) => m.skills.some((s) => g.match(s)));
      const total = relevant.length;
      const doneCount = relevant.filter((m) => done.has(m.day)).length;
      return { ...g, total, done: doneCount, pct: total === 0 ? 0 : (doneCount / total) * 100 };
    });
  }, [missions, progress.completedDays]);

  // Consistency
  const startDate = new Date(progress.startDate);
  const dayToDate = (d: number) => {
    const dt = new Date(startDate);
    dt.setDate(dt.getDate() + (d - 1));
    return dt;
  };
  const completedDates = useMemo(() => new Set(progress.completedDays.map((d) => dayToDate(d).toDateString())), [progress.completedDays, progress.startDate]);

  const weeklyConsistency = useMemo(() => {
    let hit = 0;
    for (let i = 0; i < 7; i++) {
      const dt = new Date(); dt.setDate(dt.getDate() - i);
      if (completedDates.has(dt.toDateString())) hit++;
    }
    return (hit / 7) * 100;
  }, [completedDates]);

  const monthlyConsistency = useMemo(() => {
    let hit = 0;
    for (let i = 0; i < 30; i++) {
      const dt = new Date(); dt.setDate(dt.getDate() - i);
      if (completedDates.has(dt.toDateString())) hit++;
    }
    return (hit / 30) * 100;
  }, [completedDates]);

  // Longest streak (from completed days sorted)
  const longestStreak = useMemo(() => {
    const sorted = [...progress.completedDays].sort((a, b) => a - b);
    let best = 0, run = 0, prev = -Infinity;
    for (const d of sorted) {
      run = d === prev + 1 ? run + 1 : 1;
      best = Math.max(best, run);
      prev = d;
    }
    return best;
  }, [progress.completedDays]);

  // Level completion breakdown
  const levelStats = useMemo(() => {
    return LEVELS.map((l) => {
      const list = missions.filter((m) => m.levelId === l.id);
      const d = list.filter((m) => done.has(m.day)).length;
      return { ...l, total: list.length, done: d, pct: list.length === 0 ? 0 : (d / list.length) * 100 };
    });
  }, [missions, progress.completedDays]);

  // Weekly XP over last 12 weeks
  const weeklyXp = useMemo(() => {
    const buckets: number[] = new Array(12).fill(0);
    for (const d of progress.completedDays) {
      const dt = dayToDate(d);
      const diffDays = Math.floor((Date.now() - dt.getTime()) / 86400000);
      const week = Math.floor(diffDays / 7);
      if (week >= 0 && week < 12) {
        const m = missions.find((x) => x.day === d);
        if (m) buckets[11 - week] += m.xp;
      }
    }
    return buckets;
  }, [progress.completedDays, missions]);
  const maxWeekly = Math.max(1, ...weeklyXp);

  // Project stats
  const shippedProjects = progress.completedProjects.length;
  const portfolioScore = PROJECTS.filter((p) => progress.completedProjects.includes(p.id)).reduce((a, p) => a + p.portfolioValue, 0);
  const projectDiff = { easy: 0, medium: 0, hard: 0, elite: 0 } as Record<string, number>;
  for (const p of PROJECTS) projectDiff[p.difficulty]++;

  // Heatmap: last 20 weeks (140 days)
  const heatmap = useMemo(() => {
    const weeks: { date: Date; done: boolean }[][] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (20 * 7 - 1));
    // Align to Sunday
    const dow = start.getDay();
    start.setDate(start.getDate() - dow);
    for (let w = 0; w < 21; w++) {
      const col: { date: Date; done: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start); dt.setDate(start.getDate() + w * 7 + d);
        col.push({ date: dt, done: completedDates.has(dt.toDateString()) && dt <= today });
      }
      weeks.push(col);
    }
    return weeks;
  }, [completedDates]);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Analytics</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Statistics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Every metric that matters — no filler.</p>
        </div>
      </div>

      {/* Overview stat grid */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Completion" value={<>{completionPct.toFixed(1)}<span className="text-lg text-muted-foreground">%</span></>} hint={`${progress.completedDays.length}/${missions.length} missions`} icon={<Activity className="h-4 w-4" />} accent="--level-3" />
        <StatCard label="Current Streak" value={<>{progress.streakDays}<span className="ml-1 text-lg text-muted-foreground">d</span></>} hint={`Longest: ${longestStreak} days`} icon={<Flame className="h-4 w-4" />} accent="--level-6" />
        <StatCard label="Career Readiness" value={<>{jobReadyPct.toFixed(0)}<span className="text-lg text-muted-foreground">%</span></>} hint={day >= 400 ? "Job ready 🎉" : `${400 - day} days to go`} icon={<Trophy className="h-4 w-4" />} accent="--level-4" />
        <StatCard label="Learning Hours" value={<>{hours.toFixed(0)}<span className="ml-1 text-lg text-muted-foreground">h</span></>} hint={`~${avgDaily.toFixed(0)} min/day avg`} icon={<Clock className="h-4 w-4" />} accent="--level-7" />
      </div>

      {/* Learning Progress */}
      <Section title="Learning Progress" icon={<Activity className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Current Level" value={`L${level.id} · ${level.name}`} />
          <Metric label="Current Week" value={mission ? `Week ${mission.week}` : "—"} />
          <Metric label="Current Day" value={`${day} / ${total}`} />
          <Metric label="Missions Completed" value={progress.completedDays.length.toString()} />
          <Metric label="Missions Remaining" value={(missions.length - progress.completedDays.length).toString()} />
          <Metric label="Current Streak" value={`${progress.streakDays} days`} />
          <Metric label="Longest Streak" value={`${longestStreak} days`} />
          <Metric label="Total XP" value={progress.totalXp.toLocaleString()} />
        </div>
      </Section>

      {/* Career Progress */}
      <Section title="Career Progress" icon={<Target className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Job Ready" value={`${jobReadyPct.toFixed(0)}%`} />
          <Metric label="Roadmap Position" value={`Day ${day} · L${level.id}`} />
          <Metric label="Next Milestone" value={ms ? `${ms.milestone.emoji} ${ms.milestone.title}` : "—"} sub={ms ? `${ms.daysAway} days away` : ""} />
          <Metric label="Level Progress" value={`${xp.pct.toFixed(0)}%`} sub={`${xp.earned}/${xp.needed} XP`} />
          <Metric label="Skills Covered" value={skillStats.filter((s) => s.done > 0).length + " / " + skillStats.length} />
          <Metric label="Projects Shipped" value={`${shippedProjects} / ${PROJECTS.length}`} />
          <Metric label="Portfolio Score" value={portfolioScore.toString()} sub="Weighted quality" />
          <Metric label="Milestones Hit" value={`${MILESTONES.filter((m) => day >= m.day).length} / ${MILESTONES.length}`} />
        </div>
      </Section>

      {/* Consistency */}
      <Section title="Learning Analytics" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ProgressBlock label="Weekly Consistency" pct={weeklyConsistency} hint="Days active in last 7" />
          <ProgressBlock label="Monthly Consistency" pct={monthlyConsistency} hint="Days active in last 30" />
          <ProgressBlock label="Avg Completion" pct={completionPct} hint="Journey-wide" />
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills" icon={<BarChart3 className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {skillStats.map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground/85">{s.label}</span>
                <span className="text-muted-foreground">{s.done}/{s.total}</span>
              </div>
              <div className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--level-3), var(--level-7))" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects" icon={<Rocket className="h-3.5 w-3.5" />}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Metric label="Completed" value={shippedProjects.toString()} />
          <Metric label="Remaining" value={(PROJECTS.length - shippedProjects).toString()} />
          <Metric label="Portfolio Score" value={portfolioScore.toString()} />
          <Metric label="Highest Difficulty" value={hardestShipped(progress.completedProjects)} />
        </div>
        <div className="mt-4">
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-2">Difficulty Distribution</div>
          <div className="grid grid-cols-4 gap-2">
            {(["easy", "medium", "hard", "elite"] as const).map((d) => (
              <div key={d} className="rounded-md border border-border bg-background/40 p-2">
                <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground capitalize">{d}</div>
                <div className="mt-0.5 text-sm font-medium text-foreground">{projectDiff[d]}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Level Completion Chart */}
      <Section title="Level Completion" icon={<BarChart3 className="h-3.5 w-3.5" />}>
        <div className="space-y-2">
          {levelStats.map((l) => (
            <div key={l.id} className="flex items-center gap-3">
              <div className="w-40 shrink-0 text-xs text-foreground/85 truncate">{l.emoji} {l.name}</div>
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${l.pct}%`, background: `var(${l.color})` }} />
              </div>
              <div className="w-16 shrink-0 text-right text-[11px] text-muted-foreground tabular-nums">{l.done}/{l.total}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* XP over weeks */}
      <Section title="Weekly XP (last 12 weeks)" icon={<TrendingUp className="h-3.5 w-3.5" />}>
        <div className="flex items-end gap-1.5 h-32">
          {weeklyXp.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-t-md"
                  style={{
                    height: `${(v / maxWeekly) * 100}%`,
                    background: `linear-gradient(180deg, color-mix(in oklab, var(${level.color}) 90%, transparent), color-mix(in oklab, var(${level.color}) 30%, transparent))`,
                    minHeight: v > 0 ? "4px" : "0",
                  }}
                />
              </div>
              <div className="text-[9px] text-muted-foreground">{i === 11 ? "Now" : `${11 - i}w`}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Heatmap */}
      <Section title="Study Heatmap (last ~20 weeks)" icon={<Flame className="h-3.5 w-3.5" />}>
        <div className="overflow-x-auto">
          <div className="flex gap-[3px] min-w-max">
            {heatmap.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {week.map((d, j) => (
                  <div
                    key={j}
                    title={`${d.date.toDateString()}${d.done ? " · studied" : ""}`}
                    className={cn(
                      "h-3 w-3 rounded-[3px] border border-border/60",
                      d.done ? "bg-primary/80" : "bg-secondary/50"
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10.5px] text-muted-foreground">
            <span>Less</span>
            <span className="h-3 w-3 rounded-[3px] bg-secondary/50 border border-border/60" />
            <span className="h-3 w-3 rounded-[3px] bg-primary/40 border border-border/60" />
            <span className="h-3 w-3 rounded-[3px] bg-primary/70 border border-border/60" />
            <span className="h-3 w-3 rounded-[3px] bg-primary border border-border/60" />
            <span>More</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function hardestShipped(ids: string[]): string {
  const order = { easy: 1, medium: 2, hard: 3, elite: 4 } as Record<string, number>;
  let best = "—", n = 0;
  for (const id of ids) {
    const p = PROJECTS.find((x) => x.id === id);
    if (p && order[p.difficulty] > n) { n = order[p.difficulty]; best = p.difficulty[0].toUpperCase() + p.difficulty.slice(1); }
  }
  return best;
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        {icon} <span>{title}</span>
      </div>
      <div className="premium-card p-5">{children}</div>
    </section>
  );
}

function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-[15px] font-semibold text-foreground truncate">{value}</div>
      {sub && <div className="mt-0.5 text-[10.5px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function ProgressBlock({ label, pct, hint }: { label: string; pct: number; hint?: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/85">{label}</span>
        <span className="text-muted-foreground">{pct.toFixed(0)}%</span>
      </div>
      <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      {hint && <div className="mt-1.5 text-[10.5px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

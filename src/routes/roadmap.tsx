import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, Check, Clock, Zap, Lock, Trophy, Target, Search } from "lucide-react";
import {
  getAllMissions, LEVELS, MILESTONES, type Mission,
} from "@/lib/curriculum";
import { useProgress, toggleDay, currentDay, setNote } from "@/lib/progress";
import { cn } from "@/lib/utils";

export default function Roadmap() {
  useEffect(() => { document.title = "Roadmap — Elevate"; }, []);
  const progress = useProgress();
  const today = currentDay(progress);
  const missions = getAllMissions();

  const currentLevelId = useMemo(() => {
    const lvl = LEVELS.find((l) => today >= l.startDay && today <= l.endDay);
    return lvl?.id ?? 1;
  }, [today]);

  const [levelId, setLevelId] = useState<number>(currentLevelId);

  // Weeks belonging to selected level
  const weeksInLevel = useMemo(() => {
    const set = new Set<number>();
    missions.forEach((m) => { if (m.levelId === levelId) set.add(m.week); });
    return [...set].sort((a, b) => a - b);
  }, [missions, levelId]);

  const currentWeek = useMemo(() => {
    const m = missions.find((x) => x.day === today && x.levelId === levelId);
    return m?.week ?? weeksInLevel[0] ?? 1;
  }, [missions, today, levelId, weeksInLevel]);

  const [weekNum, setWeekNum] = useState<number>(currentWeek);
  const skipAutoWeekRef = useRef(false);

  // When level changes, jump to a sensible week (current if it's this level, else first)
  // — unless a week was just set explicitly (e.g. via search), in which case skip once.
  useEffect(() => {
    if (skipAutoWeekRef.current) {
      skipAutoWeekRef.current = false;
      return;
    }
    if (levelId === currentLevelId) setWeekNum(currentWeek);
    else setWeekNum(weeksInLevel[0] ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const weekMissions = useMemo(
    () => missions.filter((m) => m.levelId === levelId && m.week === weekNum),
    [missions, levelId, weekNum]
  );

  const level = LEVELS.find((l) => l.id === levelId)!;
  const levelMissions = missions.filter((m) => m.levelId === levelId);
  const levelDone = levelMissions.filter((m) => progress.completedDays.includes(m.day)).length;
  const weekDone = weekMissions.filter((m) => progress.completedDays.includes(m.day)).length;
  const milestone = MILESTONES.find((m) => m.day === level.endDay || (m.day > level.startDay && m.day <= level.endDay));

  // Horizontal week scroller
  const weekScrollerRef = useRef<HTMLDivElement>(null);
  const scrollWeeks = (dir: -1 | 1) => {
    const el = weekScrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  useEffect(() => {
    // scroll selected week chip into view
    const el = weekScrollerRef.current?.querySelector<HTMLButtonElement>(`[data-week="${weekNum}"]`);
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [weekNum]);

  // Topic search
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return missions
      .filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.subtopics.some((s) => s.toLowerCase().includes(q)) ||
          m.skills.some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [missions, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    if (searchOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [searchOpen]);

  function goToMission(m: Mission) {
    if (m.levelId !== levelId) skipAutoWeekRef.current = true;
    setLevelId(m.levelId);
    setWeekNum(m.week);
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">The Journey</div>
          <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Roadmap</h1>
          <p className="mt-1 text-sm text-muted-foreground">Level → Week → Missions. Focused. Trackable. Ship one week at a time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{progress.completedDays.length}</span> / {missions.length} missions
          </div>
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground/85 hover:bg-surface-elevated transition-colors"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search topics</span>
            </button>
            {searchOpen && (
              <div className="premium-card absolute right-0 top-full z-20 mt-2 w-80 p-3">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. JWT, Docker, pytest…"
                  className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="mt-2 max-h-72 overflow-y-auto">
                  {query.trim() === "" && (
                    <div className="px-1 py-3 text-xs text-muted-foreground">Start typing to search all {missions.length} days.</div>
                  )}
                  {query.trim() !== "" && searchResults.length === 0 && (
                    <div className="px-1 py-3 text-xs text-muted-foreground">No topics found for "{query}".</div>
                  )}
                  {searchResults.map((m) => {
                    const lvl = LEVELS.find((l) => l.id === m.levelId)!;
                    return (
                      <button
                        key={m.day}
                        onClick={() => goToMission(m)}
                        className="flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-2 text-left hover:bg-surface-elevated transition-colors"
                      >
                        <span className="text-sm font-medium text-foreground">{m.title}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {lvl.emoji} L{m.levelId} · Week {m.week} · Day {m.day}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level selector */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {LEVELS.map((l) => {
          const active = l.id === levelId;
          const reached = today >= l.startDay;
          return (
            <button
              key={l.id}
              onClick={() => setLevelId(l.id)}
              className={cn(
                "group relative flex flex-col items-start gap-1 rounded-xl border px-3 py-3 text-left transition-all",
                active
                  ? "border-transparent bg-surface-elevated"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-elevated"
              )}
              style={active ? {
                boxShadow: `inset 0 0 0 1px color-mix(in oklab, var(${l.color}) 60%, transparent), 0 8px 24px -12px color-mix(in oklab, var(${l.color}) 45%, transparent)`,
              } : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{l.emoji}</span>
                <span className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `var(${l.color})` }}>L{l.id}</span>
              </div>
              <div className="font-display text-[13px] font-semibold leading-tight text-foreground line-clamp-1">
                {l.name}
              </div>
              <div className="text-[10.5px] text-muted-foreground">
                Days {l.startDay}–{l.endDay}{!reached && " · Locked"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Level header strip */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-strong"
            style={{ background: `color-mix(in oklab, var(${level.color}) 22%, transparent)` }}>
            <span className="text-lg">{level.emoji}</span>
          </div>
          <div className="min-w-0">
            <div className="text-[10.5px] uppercase tracking-[0.14em]" style={{ color: `var(${level.color})` }}>
              Level {level.id} · {level.tagline}
            </div>
            <div className="font-display text-base font-semibold truncate">{level.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Target className="h-3.5 w-3.5" style={{ color: `var(${level.color})` }} />
            {levelDone}/{levelMissions.length} in level
          </div>
          {milestone && (
            <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-xs text-muted-foreground">
              <Trophy className="h-3.5 w-3.5" style={{ color: `var(${level.color})` }} />
              Ends at {milestone.emoji} {milestone.title}
            </div>
          )}
        </div>
      </div>

      {/* Week selector — horizontal */}
      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => scrollWeeks(-1)}
          aria-label="Scroll weeks left"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div
          ref={weekScrollerRef}
          className="flex-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="flex items-center gap-2 min-w-max px-0.5">
            {weeksInLevel.map((w) => {
              const list = missions.filter((m) => m.levelId === levelId && m.week === w);
              const done = list.filter((m) => progress.completedDays.includes(m.day)).length;
              const active = w === weekNum;
              const containsToday = list.some((m) => m.day === today);
              const fullyDone = done === list.length && list.length > 0;
              return (
                <button
                  key={w}
                  data-week={w}
                  onClick={() => setWeekNum(w)}
                  className={cn(
                    "group relative flex shrink-0 flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-all min-w-[92px]",
                    active
                      ? "border-transparent bg-surface-elevated"
                      : "border-border bg-surface hover:border-border-strong"
                  )}
                  style={active ? {
                    boxShadow: `inset 0 0 0 1px color-mix(in oklab, var(${level.color}) 70%, transparent)`,
                  } : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={cn("text-[11px] font-medium uppercase tracking-[0.12em]", active ? "text-foreground" : "text-muted-foreground")}>
                      W{w}
                    </span>
                    {containsToday && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-[1px] text-[9.5px] uppercase tracking-normal text-primary">Now</span>
                    )}
                    {fullyDone && <Check className="h-3 w-3" style={{ color: `var(${level.color})` }} />}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{done}/{list.length}</div>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => scrollWeeks(1)}
          aria-label="Scroll weeks right"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week header */}
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Week {weekNum}</div>
          <h2 className="font-display text-xl font-semibold">
            {weekMissions.length > 0 ? `Days ${weekMissions[0].day}–${weekMissions[weekMissions.length - 1].day}` : "No missions"}
          </h2>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{weekDone}</span> / {weekMissions.length} done this week
        </div>
      </div>

      {/* Missions grid — only current week */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {weekMissions.map((m) => (
          <MissionCard
            key={`${levelId}-${weekNum}-${m.day}`}
            mission={m}
            done={progress.completedDays.includes(m.day)}
            locked={m.day > today + 7}
            today={m.day === today}
            levelColor={level.color}
            note={progress.notes[m.day]}
          />
        ))}
        {weekMissions.length === 0 && (
          <div className="premium-card p-12 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
            No missions in this week.
          </div>
        )}
      </div>
    </div>
  );
}

function MissionCard({
  mission, done, locked, today, levelColor, note,
}: { mission: Mission; done: boolean; locked: boolean; today: boolean; levelColor: string; note?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "premium-card group relative overflow-hidden p-4 transition-all",
        done && "opacity-60",
        today && "ring-1 ring-primary/50"
      )}
    >
      {today && (
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, var(${levelColor}), var(--primary))` }} />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Day {mission.day}</span>
            <span>·</span>
            <span className="capitalize" style={{ color: `var(${levelColor})` }}>{mission.type}</span>
            {today && <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-[1px] text-primary text-[10px] normal-case tracking-normal">Today</span>}
          </div>
          <h3 className="mt-1 font-display text-[15px] font-semibold leading-snug text-foreground line-clamp-2">
            {mission.title}
          </h3>
        </div>
        <button
          onClick={() => toggleDay(mission.day)}
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-all",
            done
              ? "bg-primary border-primary text-primary-foreground"
              : "border-border-strong text-muted-foreground hover:text-foreground hover:border-primary/60"
          )}
        >
          {done ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3.5 w-3.5" /> : null}
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{mission.objective}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px]">
        <Chip icon={<Clock className="h-3 w-3" />}>{mission.estMinutes}m</Chip>
        <Chip icon={<Zap className="h-3 w-3" />}>{mission.xp} XP</Chip>
        <Chip capitalize>{mission.difficulty}</Chip>
        {mission.skills.slice(0, 2).map((s) => (
          <Chip key={s} muted>{s}</Chip>
        ))}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 flex w-full items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors"
      >
        <span>{open ? "Hide details" : "Show details"}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3 border-t border-border pt-3">
              <Field label="Expected outcome" value={mission.outcome} />
              {mission.resources && mission.resources.length > 0 && (
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-1">Resources</div>
                  <ul className="space-y-1 text-xs">
                    {mission.resources.map((r) => (
                      <li key={r.label}>
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-foreground/85 hover:text-primary transition-colors">↗ {r.label}</a>
                        ) : (
                          <span className="text-foreground/85">• {r.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground mb-1">Notes</div>
                <textarea
                  defaultValue={note ?? ""}
                  onBlur={(e) => setNote(mission.day, e.target.value)}
                  placeholder="What did you learn? Anything to revisit?"
                  className="w-full min-h-[70px] resize-y rounded-md border border-border bg-background/40 p-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-xs text-foreground/85 leading-relaxed">{value}</div>
    </div>
  );
}

function Chip({ children, icon, muted, capitalize }: { children: React.ReactNode; icon?: React.ReactNode; muted?: boolean; capitalize?: boolean }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5",
      muted ? "border-border bg-transparent text-muted-foreground" : "border-border bg-background/40 text-muted-foreground",
      capitalize && "capitalize"
    )}>
      {icon}
      {children}
    </span>
  );
}
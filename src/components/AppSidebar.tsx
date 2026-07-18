import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  Map,
  Rocket,
  Trophy,
  BarChart3,
  Settings as SettingsIcon,
} from "lucide-react";
import { useProgress, currentDay, progressPct } from "@/lib/progress";
import { getLevelForDay } from "@/lib/curriculum";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/roadmap", label: "Roadmap", icon: Map, exact: false },
  { to: "/projects", label: "Projects", icon: Rocket, exact: false },
  { to: "/statistics", label: "Statistics", icon: BarChart3, exact: false },
  { to: "/achievements", label: "Achievements", icon: Trophy, exact: false },
  { to: "/settings", label: "Settings", icon: SettingsIcon, exact: false },
] as const;

export function AppSidebar() {
  const pathname = useLocation().pathname;
  const progress = useProgress();
  const day = currentDay(progress);
  const level = getLevelForDay(day);
  const pct = progressPct(progress);

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col self-start sticky top-0 h-screen overflow-y-auto bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ background: "linear-gradient(135deg, var(--level-3), var(--level-7))" }}>
            <span className="text-sm font-bold text-black/80">E</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15px] font-semibold tracking-tight">Elevate</div>
            <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">Career Console</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2">
        <div className="px-3 pt-4 pb-2 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
          Workspace
        </div>
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/85 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      className="absolute inset-0 rounded-lg bg-sidebar-accent border border-sidebar-border"
                    />
                  )}
                  <item.icon className="relative h-4 w-4 shrink-0 opacity-80" />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Progress footer — vertically centered in the remaining space below nav */}
      <div className="flex flex-1 flex-col justify-center p-3">
        <div className="premium-card p-3.5">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span>Level {level.id}</span>
            <span>Day {day}/600</span>
          </div>
          <div className="mt-2 font-display text-[15px] font-semibold text-foreground">
            {level.emoji} {level.name}
          </div>
          <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, var(${level.color}), var(--primary))` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{pct.toFixed(1)}% complete</span>
            <span className="text-foreground/80">{progress.totalXp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
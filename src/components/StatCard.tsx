import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  accent?: string; // css var name like "--level-3"
  className?: string;
}

export function StatCard({ label, value, hint, icon, accent = "--primary", className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("premium-card relative overflow-hidden p-5", className)}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ background: `var(${accent})` }}
      />
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        {icon && (
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong"
            style={{ color: `var(${accent})`, background: `color-mix(in oklab, var(${accent}) 12%, transparent)` }}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}

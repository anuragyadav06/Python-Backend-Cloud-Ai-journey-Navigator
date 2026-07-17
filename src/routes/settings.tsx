import { useEffect, useRef, useState } from "react";
import { Download, Upload, RotateCcw, Calendar, Sparkles, Sun, Moon } from "lucide-react";
import { useProgress, exportBackup, importBackup, resetProgress, setStartDate } from "@/lib/progress";
import { useTheme, toggleTheme } from "@/lib/theme";
import { toast } from "sonner";

export default function Settings() {
  useEffect(() => { document.title = "Settings — Elevate"; }, []);
  const progress = useProgress();
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-8 py-8">
      <div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Preferences</div>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your journey, your data. Stored locally by default.</p>
      </div>

      <div className="mt-8 space-y-4">
        <Section title="Appearance" icon={<Sparkles className="h-4 w-4" />}>
          <Row label="Theme" hint="Switch between light and dark mode.">
            <button
              onClick={() => {
                toggleTheme();
                toast.success(theme === "dark" ? "Light mode on" : "Dark mode on");
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-elevated"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="h-3.5 w-3.5" /> Dark
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5" /> Light
                </>
              )}
            </button>
          </Row>
        </Section>

        <Section title="Journey" icon={<Calendar className="h-4 w-4" />}>
          <Row label="Start date" hint="Anchor the journey to a real calendar date.">
            <input
              type="date"
              value={progress.startDate.slice(0, 10)}
              onChange={(e) => setStartDate(new Date(e.target.value).toISOString())}
              className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </Row>
          <Row label="Total XP">
            <div className="font-mono text-sm text-foreground">{progress.totalXp.toLocaleString()}</div>
          </Row>
          <Row label="Missions completed">
            <div className="font-mono text-sm text-foreground">{progress.completedDays.length}</div>
          </Row>
          <Row label="Projects shipped">
            <div className="font-mono text-sm text-foreground">{progress.completedProjects.length}</div>
          </Row>
        </Section>

        <Section title="Backup & Restore" icon={<Download className="h-4 w-4" />}>
          <p className="text-xs text-muted-foreground">
            Your progress is stored on this device. Export a backup regularly, and restore on a new machine.
            The architecture is ready for cloud sync in a future release.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const data = exportBackup();
                const blob = new Blob([data], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `devpath-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Backup exported");
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:brightness-110"
            >
              <Download className="h-3.5 w-3.5" /> Export backup
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-elevated"
            >
              <Upload className="h-3.5 w-3.5" /> Restore from file
            </button>
            <input
              ref={fileRef} type="file" accept="application/json" className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                if (importBackup(text)) toast.success("Backup restored");
                else toast.error("Invalid backup file");
                e.target.value = "";
              }}
            />
          </div>
        </Section>

        <Section title="Danger zone" icon={<RotateCcw className="h-4 w-4" />} destructive>
          <p className="text-xs text-muted-foreground">Reset all progress. This cannot be undone.</p>
          <div className="mt-3">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/20"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset progress
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { resetProgress(); setConfirmReset(false); toast.success("Progress reset"); }}
                  className="rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground hover:brightness-110"
                >
                  Yes, reset everything
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:bg-surface-elevated"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, icon, children, destructive }: { title: string; icon: React.ReactNode; children: React.ReactNode; destructive?: boolean }) {
  return (
    <div className={`premium-card p-5 ${destructive ? "border-destructive/30" : ""}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className={destructive ? "text-destructive" : "text-muted-foreground"}>{icon}</span>
        {title}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border/60 py-3 first:border-0 first:pt-0">
      <div>
        <div className="text-sm text-foreground">{label}</div>
        {hint && <div className="text-[11px] text-muted-foreground">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/routes";
import Roadmap from "@/routes/roadmap";
import ProjectsPage from "@/routes/projects";
import StatisticsPage from "@/routes/statistics";
import Achievements from "@/routes/achievements";
import Settings from "@/routes/settings";

function NotFound() {
  useEffect(() => { document.title = "Not found — Elevate"; }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Off the roadmap</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page isn't part of the journey. Let's get you back on track.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen w-full">
      <ScrollToTop />
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

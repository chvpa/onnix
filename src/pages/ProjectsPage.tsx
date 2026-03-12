import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhaseBadge } from "@/components/PhaseBadge";
import { cn } from "@/lib/utils";

type Phase = "discovery" | "planning" | "development" | "testing" | "deploy" | "support";

interface Project {
  id: number;
  name: string;
  client: string;
  phase: Phase;
  progress: number;
  hoursEstimated: number;
  hoursReal: number;
  tasksTotal: number;
  tasksDone: number;
  startDate: string;
}

const mockProjects: Project[] = [
  { id: 1, name: "Portal E-commerce", client: "TechCorp", phase: "development", progress: 65, hoursEstimated: 120, hoursReal: 82, tasksTotal: 24, tasksDone: 16, startDate: "2025-11-01" },
  { id: 2, name: "App Móvil Finanzas", client: "FinBank", phase: "testing", progress: 85, hoursEstimated: 200, hoursReal: 175, tasksTotal: 32, tasksDone: 28, startDate: "2025-09-15" },
  { id: 3, name: "Dashboard Analytics", client: "DataViz", phase: "planning", progress: 25, hoursEstimated: 80, hoursReal: 18, tasksTotal: 12, tasksDone: 3, startDate: "2026-01-10" },
  { id: 4, name: "API Gateway", client: "CloudNet", phase: "deploy", progress: 95, hoursEstimated: 60, hoursReal: 58, tasksTotal: 15, tasksDone: 14, startDate: "2025-12-01" },
  { id: 5, name: "CRM Integration", client: "TechCorp", phase: "discovery", progress: 10, hoursEstimated: 90, hoursReal: 8, tasksTotal: 8, tasksDone: 1, startDate: "2026-02-20" },
  { id: 6, name: "Mobile Banking v2", client: "FinBank", phase: "development", progress: 45, hoursEstimated: 150, hoursReal: 65, tasksTotal: 28, tasksDone: 12, startDate: "2026-01-05" },
  { id: 7, name: "Data Pipeline", client: "DataViz", phase: "testing", progress: 78, hoursEstimated: 100, hoursReal: 80, tasksTotal: 20, tasksDone: 16, startDate: "2025-10-20" },
  { id: 8, name: "Cloud Migration", client: "CloudNet", phase: "support", progress: 100, hoursEstimated: 40, hoursReal: 42, tasksTotal: 10, tasksDone: 10, startDate: "2025-08-01" },
];

const phases: Phase[] = ["discovery", "planning", "development", "testing", "deploy", "support"];

const ProjectsPage = () => {
  const [search, setSearch] = useState("");
  const [activePhase, setActivePhase] = useState<Phase | "all">("all");

  const filtered = mockProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = activePhase === "all" || p.phase === activePhase;
    return matchesSearch && matchesPhase;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">Gestión de proyectos y fases</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nuevo proyecto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar proyectos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActivePhase("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
              activePhase === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            )}
          >
            Todos
          </button>
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className={cn(
                "transition-opacity",
                activePhase !== "all" && activePhase !== phase && "opacity-50"
              )}
            >
              <PhaseBadge phase={phase} />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Proyecto</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fase</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progreso</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Horas</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tareas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-card-foreground">{project.name}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted-foreground">{project.client}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <PhaseBadge phase={project.phase} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      "text-sm",
                      project.hoursReal > project.hoursEstimated ? "text-destructive font-medium" : "text-muted-foreground"
                    )}>
                      {project.hoursReal}/{project.hoursEstimated}h
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm text-muted-foreground">
                      {project.tasksDone}/{project.tasksTotal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

import {
  Users, FolderKanban, Clock, TicketCheck, ArrowRight, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { PhaseBadge } from "@/components/PhaseBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProjectPhase, projectPhases, projectPhaseLabels } from "@/types";
import { mockProjects, mockTickets } from "@/data/mockData";

const Dashboard = () => {
  const navigate = useNavigate();

  const recentProjects = mockProjects.slice(0, 4);
  const recentTickets = mockTickets.filter((t) => t.status !== "resuelto").slice(0, 3);

  const phaseCounts = projectPhases.map((phase) => ({
    phase,
    count: mockProjects.filter((p) => p.phase === phase).length,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-7xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Clientes activos" value={12} icon={Users} trend={{ value: 8, positive: true }} />
        <StatCard title="Proyectos en curso" value={18} icon={FolderKanban} subtitle="4 en producción esta semana" />
        <StatCard title="Horas consumidas" value="1,240" icon={Clock} subtitle="de 2,500 contratadas" trend={{ value: 12, positive: false }} />
        <StatCard title="Tickets abiertos" value={7} icon={TicketCheck} trend={{ value: 15, positive: true }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-card-foreground">Proyectos recientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/projects")} className="text-xs">
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 sm:p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="text-sm font-medium text-card-foreground truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-3">
                  <PhaseBadge phase={project.phase} className="hidden sm:inline-flex" />
                  <div className="w-12 sm:w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:p-5">
            <h2 className="text-sm sm:text-base font-semibold text-card-foreground">Tickets recientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tickets")} className="text-xs">
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start gap-3 p-3 sm:p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                <AlertCircle
                  className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    ticket.priority === "alta" ? "text-destructive" :
                    ticket.priority === "media" ? "text-warning" : "text-muted-foreground"
                  )}
                />
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">{ticket.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{ticket.client}</span>
                    <span>·</span>
                    <span>{ticket.created}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase pipeline - 6 phases */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-sm sm:text-base font-semibold text-card-foreground mb-3 sm:mb-4">Pipeline de fases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {phaseCounts.map(({ phase, count }) => (
            <div key={phase} className="rounded-lg border border-border p-3 sm:p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <PhaseBadge phase={phase} className="mb-1.5 sm:mb-2 text-[10px] sm:text-xs" />
              <p className="text-lg sm:text-2xl font-bold text-card-foreground">{count}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">proyectos</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

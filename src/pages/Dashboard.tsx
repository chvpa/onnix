import {
  Users,
  FolderKanban,
  Clock,
  TicketCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { PhaseBadge } from "@/components/PhaseBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const recentProjects = [
  { id: 1, name: "Portal E-commerce", client: "TechCorp", phase: "development" as const, progress: 65 },
  { id: 2, name: "App Móvil Finanzas", client: "FinBank", phase: "testing" as const, progress: 85 },
  { id: 3, name: "Dashboard Analytics", client: "DataViz", phase: "planning" as const, progress: 25 },
  { id: 4, name: "API Gateway", client: "CloudNet", phase: "deploy" as const, progress: 95 },
];

const recentTickets = [
  { id: 1, title: "Error en checkout", client: "TechCorp", priority: "alta", time: "hace 2h" },
  { id: 2, title: "Actualizar logo", client: "FinBank", priority: "baja", time: "hace 5h" },
  { id: 3, title: "Rendimiento lento", client: "DataViz", priority: "media", time: "hace 1d" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen general de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Clientes activos"
          value={12}
          icon={Users}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Proyectos en curso"
          value={18}
          icon={FolderKanban}
          subtitle="4 en deploy esta semana"
        />
        <StatCard
          title="Horas consumidas"
          value="1,240"
          icon={Clock}
          subtitle="de 2,500 contratadas"
          trend={{ value: 12, positive: false }}
        />
        <StatCard
          title="Tickets abiertos"
          value={7}
          icon={TicketCheck}
          trend={{ value: 15, positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">Proyectos recientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-card-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.client}</p>
                </div>
                <div className="flex items-center gap-3">
                  <PhaseBadge phase={project.phase} />
                  <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {project.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">Tickets recientes</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tickets")}>
              Ver todos <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <AlertCircle
                  className={cn(
                    "h-4 w-4 mt-0.5 shrink-0",
                    ticket.priority === "alta"
                      ? "text-destructive"
                      : ticket.priority === "media"
                      ? "text-warning"
                      : "text-muted-foreground"
                  )}
                />
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {ticket.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{ticket.client}</span>
                    <span>·</span>
                    <span>{ticket.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Phase pipeline */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold text-card-foreground mb-4">Pipeline de fases</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {(["discovery", "planning", "development", "testing", "deploy", "support"] as const).map(
            (phase, i) => {
              const counts = [2, 3, 5, 4, 2, 2];
              return (
                <div
                  key={phase}
                  className="rounded-lg border border-border p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <PhaseBadge phase={phase} className="mb-2" />
                  <p className="text-2xl font-bold text-card-foreground">{counts[i]}</p>
                  <p className="text-xs text-muted-foreground mt-1">proyectos</p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

// helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default Dashboard;

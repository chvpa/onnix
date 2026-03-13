import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FolderKanban, Mail, Phone, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhaseBadge } from "@/components/PhaseBadge";
import { cn } from "@/lib/utils";
import { mockClients, mockProjects, mockTickets } from "@/data/mockData";

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const client = mockClients.find((c) => c.id === Number(id));
  const clientProjects = mockProjects.filter((p) => p.clientId === Number(id));
  const clientTickets = mockTickets.filter((t) => t.clientId === Number(id));

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Cliente no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/clients")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const hoursPercent = (client.hoursUsed / client.hoursTotal) * 100;
  const hoursRemaining = client.hoursTotal - client.hoursUsed;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/clients")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Clientes
      </Button>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">{client.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {client.contact}</span>
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {client.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {client.phone}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Desde {client.createdAt}</span>
            </div>
          </div>
          <div className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
            client.status === "active" ? "bg-success/15 text-success" :
            client.status === "warning" ? "bg-warning/15 text-warning" :
            "bg-destructive/15 text-destructive"
          )}>
            {client.status === "active" ? "Activo" : client.status === "warning" ? "Advertencia" : "Agotado"}
          </div>
        </div>

        {/* Hours bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Paquete de horas</span>
            <span className={cn(
              "font-semibold",
              hoursPercent >= 100 ? "text-destructive" : hoursPercent >= 80 ? "text-warning" : "text-card-foreground"
            )}>
              {hoursRemaining}h restantes de {client.hoursTotal}h
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                hoursPercent >= 100 ? "bg-destructive" : hoursPercent >= 80 ? "bg-warning" : "bg-primary"
              )}
              style={{ width: `${Math.min(hoursPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{client.hoursUsed} horas consumidas ({Math.round(hoursPercent)}%)</p>
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FolderKanban className="h-5 w-5" /> Proyectos ({clientProjects.length})
          </h2>
        </div>
        {clientProjects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin proyectos asociados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clientProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{project.assignee}</p>
                  </div>
                  <PhaseBadge phase={project.phase} />
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{project.hoursReal}/{project.hoursEstimated}h</span>
                  <span>{project.tasksDone}/{project.tasksTotal} tareas</span>
                  <span>{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tickets */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Tickets recientes ({clientTickets.length})</h2>
        {clientTickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin tickets.</p>
        ) : (
          <div className="space-y-2">
            {clientTickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-border bg-card p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-card-foreground">{ticket.title}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      ticket.status === "abierto" ? "bg-destructive/10 text-destructive" :
                      ticket.status === "en_progreso" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    )}>
                      {ticket.status === "abierto" ? "Abierto" : ticket.status === "en_progreso" ? "En progreso" : "Resuelto"}
                    </span>
                    <span>{ticket.type}</span>
                    <span>{ticket.created}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailPage;

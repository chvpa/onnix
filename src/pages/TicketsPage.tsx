import { useState } from "react";
import { Search, Plus, AlertCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Priority = "alta" | "media" | "baja";
type TicketStatus = "abierto" | "en_progreso" | "resuelto";

interface Ticket {
  id: number;
  title: string;
  client: string;
  type: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  created: string;
  messages: number;
}

const mockTickets: Ticket[] = [
  { id: 1, title: "Error en checkout - no procesa pagos", client: "TechCorp", type: "Bug", priority: "alta", status: "abierto", assignee: "Carlos Dev", created: "hace 2h", messages: 3 },
  { id: 2, title: "Actualizar logo en header", client: "FinBank", type: "Cambio visual", priority: "baja", status: "en_progreso", assignee: "Ana CX", created: "hace 5h", messages: 1 },
  { id: 3, title: "Rendimiento lento en dashboard", client: "DataViz", type: "Performance", priority: "media", status: "abierto", assignee: "Sin asignar", created: "hace 1d", messages: 5 },
  { id: 4, title: "Nuevo campo en formulario de registro", client: "CloudNet", type: "Feature", priority: "media", status: "en_progreso", assignee: "Pedro Dev", created: "hace 2d", messages: 8 },
  { id: 5, title: "Error 500 en API de reportes", client: "TechCorp", type: "Bug", priority: "alta", status: "abierto", assignee: "Carlos Dev", created: "hace 3h", messages: 2 },
  { id: 6, title: "Exportar CSV no incluye fechas", client: "EduTech", type: "Bug", priority: "media", status: "resuelto", assignee: "Laura DA", created: "hace 3d", messages: 4 },
];

const statusLabels: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  resuelto: "Resuelto",
};

const TicketsPage = () => {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "all">("all");

  const filtered = mockTickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "all" || t.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: mockTickets.length,
    abierto: mockTickets.filter((t) => t.status === "abierto").length,
    en_progreso: mockTickets.filter((t) => t.status === "en_progreso").length,
    resuelto: mockTickets.filter((t) => t.status === "resuelto").length,
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tickets de soporte</h1>
          <p className="text-muted-foreground mt-1">Gestión de solicitudes y soporte</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nuevo ticket
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "abierto", "en_progreso", "resuelto"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                activeStatus === status
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {status === "all" ? "Todos" : statusLabels[status]} ({counts[status]})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer flex items-start gap-4"
          >
            <AlertCircle
              className={cn(
                "h-5 w-5 mt-0.5 shrink-0",
                ticket.priority === "alta" ? "text-destructive" :
                ticket.priority === "media" ? "text-warning" :
                "text-muted-foreground"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-card-foreground">{ticket.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{ticket.client}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      ticket.status === "abierto" ? "bg-destructive/10 text-destructive" :
                      ticket.status === "en_progreso" ? "bg-warning/10 text-warning" :
                      "bg-success/10 text-success"
                    )}>
                      {statusLabels[ticket.status]}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {ticket.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> {ticket.messages}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {ticket.created}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Asignado a: {ticket.assignee}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;

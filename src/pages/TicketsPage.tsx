import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, AlertCircle, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockTickets as initialTickets } from "@/data/mockData";
import { Ticket, TicketStatus } from "@/types";
import TicketDialog from "@/components/TicketDialog";

const statusLabels: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  resuelto: "Resuelto",
};

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveTicket = (data: Partial<Ticket>) => {
    if (data.id) {
      setTickets((prev) => prev.map((t) => (t.id === data.id ? { ...t, ...data } as Ticket : t)));
    } else {
      const newId = Math.max(...tickets.map((t) => t.id), 0) + 1;
      setTickets((prev) => [...prev, { ...data, id: newId } as Ticket]);
    }
  };

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = activeStatus === "all" || t.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: tickets.length,
    abierto: tickets.filter((t) => t.status === "abierto").length,
    en_progreso: tickets.filter((t) => t.status === "en_progreso").length,
    resuelto: tickets.filter((t) => t.status === "resuelto").length,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tickets de soporte</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de solicitudes y soporte</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nuevo ticket
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
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
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4"
          >
            <AlertCircle
              className={cn(
                "h-5 w-5 shrink-0 hidden sm:block mt-0.5",
                ticket.priority === "alta" ? "text-destructive" :
                ticket.priority === "media" ? "text-warning" :
                "text-muted-foreground"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                <div>
                  <h3 className="text-sm font-medium text-card-foreground">{ticket.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{ticket.client}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">·</span>
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
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {ticket.messages}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {ticket.created}</span>
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

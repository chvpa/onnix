import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, AlertCircle, Clock, MessageSquare, Filter, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockTickets as initialTickets } from "@/data/mockData";
import { Ticket, TicketStatus, Priority, ticketTypes } from "@/types";
import TicketDialog from "@/components/TicketDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusLabels: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  resuelto: "Resuelto",
};

const priorityLabels: Record<Priority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const TicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<TicketStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<Priority | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

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
    const matchesPriority = !filterPriority || t.priority === filterPriority;
    const matchesType = !filterType || t.type === filterType;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const counts = {
    all: tickets.length,
    abierto: tickets.filter((t) => t.status === "abierto").length,
    en_progreso: tickets.filter((t) => t.status === "en_progreso").length,
    resuelto: tickets.filter((t) => t.status === "resuelto").length,
  };

  const hasActiveFilters = filterPriority !== null || filterType !== null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Tickets de soporte</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de solicitudes y soporte</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/projects")}>
            <Code2 className="h-4 w-4 mr-1" /> Nuevo Desarrollo
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Nuevo ticket
          </Button>
        </div>
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

          {/* Filter dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className={cn("gap-1", hasActiveFilters && "border-primary text-primary")}>
                <Filter className="h-3.5 w-3.5" />
                Filtros
                {hasActiveFilters && <span className="ml-1 rounded-full bg-primary text-primary-foreground w-4 h-4 text-[10px] flex items-center justify-center">{(filterPriority ? 1 : 0) + (filterType ? 1 : 0)}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Prioridad</DropdownMenuLabel>
              {(["alta", "media", "baja"] as Priority[]).map((p) => (
                <DropdownMenuCheckboxItem
                  key={p}
                  checked={filterPriority === p}
                  onCheckedChange={(checked) => setFilterPriority(checked ? p : null)}
                >
                  {priorityLabels[p]}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tipo</DropdownMenuLabel>
              {ticketTypes.map((t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={filterType === t}
                  onCheckedChange={(checked) => setFilterType(checked ? t : null)}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              ))}
              {hasActiveFilters && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={false}
                    onCheckedChange={() => { setFilterPriority(null); setFilterType(null); }}
                  >
                    Limpiar filtros
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
                    <span className="text-xs text-muted-foreground">por {ticket.createdBy}</span>
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
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">No se encontraron tickets.</div>
        )}
      </div>
      <TicketDialog open={dialogOpen} onOpenChange={setDialogOpen} onSave={handleSaveTicket} />
    </div>
  );
};

export default TicketsPage;

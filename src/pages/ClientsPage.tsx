import { useState } from "react";
import { Search, Plus, Clock, FolderKanban, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const mockClients = [
  { id: 1, name: "TechCorp", contact: "Juan Pérez", email: "juan@techcorp.com", hoursTotal: 500, hoursUsed: 320, projects: 3, status: "active" },
  { id: 2, name: "FinBank", contact: "María López", email: "maria@finbank.com", hoursTotal: 300, hoursUsed: 255, projects: 2, status: "active" },
  { id: 3, name: "DataViz", contact: "Carlos Ruiz", email: "carlos@dataviz.io", hoursTotal: 200, hoursUsed: 45, projects: 1, status: "active" },
  { id: 4, name: "CloudNet", contact: "Ana García", email: "ana@cloudnet.com", hoursTotal: 400, hoursUsed: 380, projects: 4, status: "warning" },
  { id: 5, name: "RetailMax", contact: "Pedro Sánchez", email: "pedro@retailmax.com", hoursTotal: 150, hoursUsed: 150, projects: 1, status: "exhausted" },
  { id: 6, name: "EduTech", contact: "Laura Martín", email: "laura@edutech.com", hoursTotal: 250, hoursUsed: 80, projects: 2, status: "active" },
];

const ClientsPage = () => {
  const [search, setSearch] = useState("");

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gestión de clientes y paquetes de horas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" /> Nuevo cliente
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => {
          const hoursPercent = (client.hoursUsed / client.hoursTotal) * 100;
          const hoursRemaining = client.hoursTotal - client.hoursUsed;
          return (
            <div
              key={client.id}
              className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{client.contact}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Horas
                    </span>
                    <span className={cn(
                      "font-medium",
                      hoursPercent >= 100 ? "text-destructive" :
                      hoursPercent >= 80 ? "text-warning" :
                      "text-card-foreground"
                    )}>
                      {hoursRemaining}h restantes
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        hoursPercent >= 100 ? "bg-destructive" :
                        hoursPercent >= 80 ? "bg-warning" :
                        "bg-primary"
                      )}
                      style={{ width: `${Math.min(hoursPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {client.hoursUsed} / {client.hoursTotal} horas
                  </p>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FolderKanban className="h-3 w-3" />
                  <span>{client.projects} proyecto{client.projects !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientsPage;

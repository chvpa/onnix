import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Clock, FolderKanban, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ClientDialog from "@/components/ClientDialog";
import { cn } from "@/lib/utils";
import { mockClients as initialClients } from "@/data/mockData";
import { Client } from "@/types";

const ClientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Omit<Client, "id" | "projects" | "status" | "createdAt">) => {
    if (editingClient) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editingClient.id
            ? {
                ...c,
                ...data,
                status: data.hoursUsed >= data.hoursTotal ? "exhausted" : data.hoursUsed / data.hoursTotal >= 0.8 ? "warning" : "active",
              }
            : c
        )
      );
    } else {
      const newClient: Client = {
        ...data,
        id: Math.max(...clients.map((c) => c.id), 0) + 1,
        projects: 0,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setClients((prev) => [...prev, newClient]);
    }
    setEditingClient(null);
  };

  const handleDelete = (client: Client) => {
    setClients((prev) => prev.filter((c) => c.id !== client.id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de clientes y paquetes de horas</p>
        </div>
        <Button onClick={() => { setEditingClient(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Nuevo cliente</span><span className="sm:hidden">Nuevo</span>
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
              onClick={() => navigate(`/clients/${client.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{client.contact}</p>
                  <p className="text-xs text-muted-foreground">{client.email}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/clients/${client.id}`); }}>
                      <Eye className="h-4 w-4 mr-2" /> Ver detalle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingClient(client); setDialogOpen(true); }}>
                      <Pencil className="h-4 w-4 mr-2" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteConfirm(client); }}>
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editingClient}
        onSave={handleSave}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará permanentemente a <strong>{deleteConfirm?.name}</strong> y todos sus datos asociados. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;

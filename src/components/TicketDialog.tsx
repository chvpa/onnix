import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket, Priority } from "@/types";
import { mockClients } from "@/data/mockData";

interface TicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket | null;
  onSave: (ticket: Partial<Ticket>) => void;
}

const priorityLabels: Record<Priority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const typeOptions = ["Bug", "Feature", "Cambio visual", "Performance", "Consulta"];

const TicketDialog = ({ open, onOpenChange, ticket, onSave }: TicketDialogProps) => {
  const [form, setForm] = useState({
    title: "",
    clientId: 0,
    type: "Bug",
    priority: "media" as Priority,
    assignee: "",
    description: "",
  });

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title,
        clientId: ticket.clientId,
        type: ticket.type,
        priority: ticket.priority,
        assignee: ticket.assignee,
        description: ticket.description,
      });
    } else {
      setForm({
        title: "",
        clientId: 0,
        type: "Bug",
        priority: "media",
        assignee: "",
        description: "",
      });
    }
  }, [ticket, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = mockClients.find((c) => c.id === form.clientId);
    onSave({
      ...form,
      id: ticket?.id,
      client: client?.name || "",
      status: ticket?.status || "abierto",
      created: ticket?.created || "ahora",
      messages: ticket?.messages || 0,
      linkedTaskIds: ticket?.linkedTaskIds || [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{ticket ? "Editar ticket" : "Nuevo ticket"}</DialogTitle>
          <DialogDescription>
            {ticket ? "Modifica los datos del ticket." : "Crea un nuevo ticket de soporte."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ticket-title">Título</Label>
            <Input id="ticket-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ticket-desc">Descripción</Label>
            <Textarea id="ticket-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={form.clientId ? String(form.clientId) : ""} onValueChange={(v) => setForm({ ...form, clientId: Number(v) })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cliente" /></SelectTrigger>
                <SelectContent>
                  {mockClients.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {typeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Priority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["alta", "media", "baja"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>{priorityLabels[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-assignee">Asignado a</Label>
              <Input id="ticket-assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{ticket ? "Guardar" : "Crear ticket"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDialog;

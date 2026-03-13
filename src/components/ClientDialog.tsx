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
import { Client } from "@/types";

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
  onSave: (client: Omit<Client, "id" | "projects" | "status" | "createdAt">) => void;
}

const ClientDialog = ({ open, onOpenChange, client, onSave }: ClientDialogProps) => {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    hoursTotal: 100,
    hoursUsed: 0,
  });

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        contact: client.contact,
        email: client.email,
        phone: client.phone,
        hoursTotal: client.hoursTotal,
        hoursUsed: client.hoursUsed,
      });
    } else {
      setForm({ name: "", contact: "", email: "", phone: "", hoursTotal: 100, hoursUsed: 0 });
    }
  }, [client, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifica los datos del cliente." : "Completa los datos para crear un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre empresa</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contacto</Label>
              <Input id="contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursTotal">Horas contratadas</Label>
              <Input id="hoursTotal" type="number" min={1} value={form.hoursTotal} onChange={(e) => setForm({ ...form, hoursTotal: Number(e.target.value) })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursUsed">Horas consumidas</Label>
              <Input id="hoursUsed" type="number" min={0} value={form.hoursUsed} onChange={(e) => setForm({ ...form, hoursUsed: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{client ? "Guardar cambios" : "Crear cliente"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDialog;

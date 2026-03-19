import { useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockTeamMembers } from "@/data/teamData";
import { TeamMember, AppRole, roleLabels, roleColors } from "@/types";
import { toast } from "sonner";

const roles: AppRole[] = ["product_owner", "customer_experience", "developer", "data_analyst", "client"];

const SettingsTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "developer" as AppRole });

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", email: "", role: "developer" });
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, role: m.role });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      setMembers((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...form } : m)));
      toast.success("Miembro actualizado");
    } else {
      const newMember: TeamMember = {
        id: Date.now(),
        ...form,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setMembers((prev) => [...prev, newMember]);
      toast.success("Miembro agregado");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Miembro eliminado");
  };

  const toggleStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{members.filter((m) => m.status === "active").length} miembros activos</p>
        <Button size="sm" onClick={openNew}>
          <UserPlus className="h-4 w-4 mr-1" /> Agregar miembro
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3 p-3 sm:p-4 hover:bg-muted/30 transition-colors">
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
              {member.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-card-foreground truncate">{member.name}</p>
                {member.status === "inactive" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Inactivo</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{member.email}</p>
            </div>
            <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0", roleColors[member.role])}>
              {roleLabels[member.role]}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEdit(member)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toggleStatus(member.id)}>
                  {member.status === "active" ? "Desactivar" : "Activar"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDelete(member.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar miembro" : "Nuevo miembro"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Nombre completo</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rol</Label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as AppRole })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button size="sm" onClick={handleSave}>{editing ? "Guardar" : "Agregar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsTeam;

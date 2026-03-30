import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectPhase, projectPhases, projectPhaseLabels } from "@/types";
import { mockClients } from "@/data/mockData";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSave: (project: Partial<Project>) => void;
}

const ProjectDialog = ({ open, onOpenChange, project, onSave }: ProjectDialogProps) => {
  const [form, setForm] = useState({
    name: "",
    clientId: 0,
    description: "",
    phase: "descubrimiento" as ProjectPhase,
    assignee: "",
    hoursEstimated: 40,
  });

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name,
        clientId: project.clientId,
        description: project.description,
        phase: project.phase,
        assignee: project.assignee,
        hoursEstimated: project.hoursEstimated,
      });
    } else {
      setForm({ name: "", clientId: 0, description: "", phase: "descubrimiento", assignee: "", hoursEstimated: 40 });
    }
  }, [project, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = mockClients.find((c) => c.id === form.clientId);
    onSave({
      ...form,
      id: project?.id,
      client: client?.name || "",
      progress: project?.progress || 0,
      hoursReal: project?.hoursReal || 0,
      tasksTotal: project?.tasksTotal || 0,
      tasksDone: project?.tasksDone || 0,
      startDate: project?.startDate || new Date().toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
          <DialogDescription>{project ? "Modifica los datos del proyecto." : "Crea un nuevo proyecto."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proj-name">Nombre</Label>
            <Input id="proj-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proj-desc">Descripción</Label>
            <Textarea id="proj-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
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
              <Label>Fase inicial</Label>
              <Select value={form.phase} onValueChange={(v) => setForm({ ...form, phase: v as ProjectPhase })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {projectPhases.map((p) => (
                    <SelectItem key={p} value={p}>{projectPhaseLabels[p]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-assignee">Responsable</Label>
              <Input id="proj-assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-hours">Horas estimadas</Label>
              <Input id="proj-hours" type="number" min={1} value={form.hoursEstimated} onChange={(e) => setForm({ ...form, hoursEstimated: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{project ? "Guardar" : "Crear proyecto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;

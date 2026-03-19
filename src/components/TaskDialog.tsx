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
import { Task, Phase, Priority, phases, phaseLabels } from "@/types";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  projectId: number;
  defaultPhase?: Phase;
  onSave: (task: Partial<Task> & { projectId: number }) => void;
}

const priorityLabels: Record<Priority, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

const TaskDialog = ({ open, onOpenChange, task, projectId, defaultPhase, onSave }: TaskDialogProps) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    phase: (defaultPhase || "pendiente") as Phase,
    assignee: "",
    hoursEstimated: 4,
    priority: "media" as Priority,
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        phase: task.phase,
        assignee: task.assignee,
        hoursEstimated: task.hoursEstimated,
        priority: task.priority,
      });
    } else {
      setForm({
        title: "",
        description: "",
        phase: defaultPhase || "pendiente",
        assignee: "",
        hoursEstimated: 4,
        priority: "media",
      });
    }
  }, [task, open, defaultPhase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      projectId,
      id: task?.id,
      status: task?.status || "pendiente",
      hoursReal: task?.hoursReal || 0,
      startDate: task?.startDate || new Date().toISOString().split("T")[0],
      auditLog: task?.auditLog || [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle>
          <DialogDescription>
            {task ? "Modifica los datos de la tarea." : "Crea una nueva tarea para este proyecto."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fase</Label>
              <Select value={form.phase} onValueChange={(v) => setForm({ ...form, phase: v as Phase })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {phases.map((p) => (
                    <SelectItem key={p} value={p}>{phaseLabels[p]}</SelectItem>
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
              <Label htmlFor="assignee">Responsable</Label>
              <Input id="assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursEstimated">Horas estimadas</Label>
              <Input id="hoursEstimated" type="number" min={0.5} step={0.5} value={form.hoursEstimated} onChange={(e) => setForm({ ...form, hoursEstimated: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">{task ? "Guardar" : "Crear tarea"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;

import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Plus, Clock, User, GripVertical,
  ChevronLeft, ChevronRight, Columns3, List,
  AlertCircle, CheckCircle2, Circle, Ban,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhaseBadge } from "@/components/PhaseBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TaskDialog from "@/components/TaskDialog";
import { cn } from "@/lib/utils";
import { mockProjects, mockTasks as initialTasks } from "@/data/mockData";
import { Task, Phase, TaskStatus, phases, phaseLabels } from "@/types";

const statusConfig: Record<TaskStatus, { label: string; icon: typeof Circle; className: string }> = {
  pendiente: { label: "Pendiente", icon: Circle, className: "text-muted-foreground" },
  en_progreso: { label: "En progreso", icon: AlertCircle, className: "text-info" },
  completada: { label: "Completada", icon: CheckCircle2, className: "text-success" },
  bloqueada: { label: "Bloqueada", icon: Ban, className: "text-destructive" },
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find((p) => p.id === Number(id));
  const [tasks, setTasks] = useState<Task[]>(initialTasks.filter((t) => t.projectId === Number(id)));
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverPhase, setDragOverPhase] = useState<Phase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultPhase, setDefaultPhase] = useState<Phase>("discovery");
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Proyecto no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/projects")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPhase: Phase) => {
    e.preventDefault();
    if (draggedId !== null) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== draggedId) return t;
          if (t.phase === targetPhase) return t;
          const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            user: "Sistema",
            action: "Cambió fase",
            from: phaseLabels[t.phase],
            to: phaseLabels[targetPhase],
          };
          return { ...t, phase: targetPhase, auditLog: [...t.auditLog, entry] };
        })
      );
    }
    setDraggedId(null);
    setDragOverPhase(null);
  };

  const moveTask = (taskId: number, direction: "next" | "prev") => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const idx = phases.indexOf(t.phase);
        const newIdx = direction === "next" ? idx + 1 : idx - 1;
        if (newIdx < 0 || newIdx >= phases.length) return t;
        const entry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          user: "Sistema",
          action: "Cambió fase",
          from: phaseLabels[t.phase],
          to: phaseLabels[phases[newIdx]],
        };
        return { ...t, phase: phases[newIdx], auditLog: [...t.auditLog, entry] };
      })
    );
  };

  const toggleStatus = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const cycle: TaskStatus[] = ["pendiente", "en_progreso", "completada", "bloqueada"];
        const next = cycle[(cycle.indexOf(t.status) + 1) % cycle.length];
        const entry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          user: "Sistema",
          action: "Cambió estado",
          from: statusConfig[t.status].label,
          to: statusConfig[next].label,
        };
        return { ...t, status: next, auditLog: [...t.auditLog, entry] };
      })
    );
  };

  const handleSaveTask = (taskData: Partial<Task> & { projectId: number }) => {
    if (taskData.id) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskData.id) return t;
          const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString(),
            user: "Sistema",
            action: "Tarea editada",
          };
          return { ...t, ...taskData, auditLog: [...t.auditLog, entry] } as Task;
        })
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now(),
        status: "pendiente",
        hoursReal: 0,
        startDate: new Date().toISOString().split("T")[0],
        auditLog: [{ id: 1, timestamp: new Date().toLocaleString(), user: "Sistema", action: "Tarea creada" }],
      } as Task;
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const hoursPercent = (project.hoursReal / project.hoursEstimated) * 100;
  const completedTasks = tasks.filter((t) => t.status === "completada").length;

  const allAuditEntries = tasks
    .flatMap((t) => t.auditLog.map((a) => ({ ...a, taskTitle: t.title })))
    .sort((a, b) => b.id - a.id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 h-full flex flex-col overflow-hidden">
      <Button variant="ghost" size="sm" onClick={() => navigate("/projects")} className="self-start">
        <ArrowLeft className="h-4 w-4 mr-1" /> Proyectos
      </Button>

      {/* Project header */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-card-foreground">{project.name}</h1>
              <PhaseBadge phase={project.phase} />
            </div>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {project.assignee}</span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-foreground" onClick={() => navigate(`/clients/${project.clientId}`)}>
                Cliente: {project.client}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm shrink-0">
            <div className="text-center">
              <p className="text-lg font-bold text-card-foreground">{completedTasks}/{tasks.length}</p>
              <p className="text-xs text-muted-foreground">Tareas</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className={cn("text-lg font-bold", hoursPercent > 100 ? "text-destructive" : "text-card-foreground")}>
                {project.hoursReal}h
              </p>
              <p className="text-xs text-muted-foreground">de {project.hoursEstimated}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Tareas del proyecto</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns3 className="h-3.5 w-3.5 inline mr-1" /> Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5 inline mr-1" /> Lista
            </button>
          </div>
          <Button size="sm" onClick={() => { setEditingTask(null); setDefaultPhase("discovery"); setDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Nueva tarea
          </Button>
        </div>
      </div>

      {/* Main content area - takes all remaining space */}
      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-hidden">
        {/* Kanban / List - scrollable, takes priority */}
        {view === "kanban" ? (
          <div className="flex-1 min-h-0 relative">
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-background/90 border border-border rounded-full p-1 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-background/90 border border-border rounded-full p-1 shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>

            <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 h-full snap-x snap-mandatory md:snap-none scrollbar-thin">
              {phases.map((phase) => {
                const phaseTasks = tasks.filter((t) => t.phase === phase);
                return (
                  <div
                    key={phase}
                    className={cn(
                      "flex-shrink-0 w-[280px] sm:w-[260px] md:flex-1 md:min-w-[180px] flex flex-col rounded-xl border bg-card transition-colors snap-center",
                      dragOverPhase === phase ? "border-primary bg-accent/50" : "border-border"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setDragOverPhase(phase); }}
                    onDragLeave={() => setDragOverPhase(null)}
                    onDrop={(e) => handleDrop(e, phase)}
                  >
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                      <div className="flex items-center gap-2">
                        <PhaseBadge phase={phase} />
                        <span className="text-xs text-muted-foreground font-medium">{phaseTasks.length}</span>
                      </div>
                      <button
                        onClick={() => { setEditingTask(null); setDefaultPhase(phase); setDialogOpen(true); }}
                        className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {phaseTasks.length === 0 && (
                        <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">Sin tareas</div>
                      )}
                      {phaseTasks.map((task) => {
                        const StatusIcon = statusConfig[task.status].icon;
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            onDragEnd={() => { setDraggedId(null); setDragOverPhase(null); }}
                            className={cn(
                              "rounded-lg border border-border bg-background p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all group",
                              draggedId === task.id && "opacity-40 scale-95"
                            )}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 min-w-0 flex-1">
                                <button onClick={() => toggleStatus(task.id)} className="mt-0.5 shrink-0">
                                  <StatusIcon className={cn("h-4 w-4", statusConfig[task.status].className)} />
                                </button>
                                <div className="min-w-0">
                                  <p className={cn("text-sm font-medium truncate", task.status === "completada" ? "line-through text-muted-foreground" : "text-foreground")}>
                                    {task.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span className={cn(
                                      "inline-flex items-center rounded-full px-1.5 py-0.5 font-medium",
                                      task.priority === "alta" ? "bg-destructive/10 text-destructive" :
                                      task.priority === "media" ? "bg-warning/10 text-warning" :
                                      "bg-muted text-muted-foreground"
                                    )}>
                                      {task.priority}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.hoursReal}/{task.hoursEstimated}h</span>
                              <span className="flex items-center gap-1"><User className="h-3 w-3" /> {task.assignee.split(" ")[0]}</span>
                            </div>

                            <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => { e.stopPropagation(); moveTask(task.id, "prev"); }}
                                disabled={phases.indexOf(task.phase) === 0}
                                className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <ChevronLeft className="h-3 w-3" /> Ant.
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingTask(task); setDialogOpen(true); }}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                  className="text-xs text-destructive/70 hover:text-destructive transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); moveTask(task.id, "next"); }}
                                disabled={phases.indexOf(task.phase) === phases.length - 1}
                                className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                Sig. <ChevronRight className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* List view */
          <div className="flex-1 min-h-0 overflow-y-auto rounded-xl border border-border bg-card">
            <div className="divide-y divide-border">
              {tasks.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">No hay tareas creadas.</div>
              )}
              {tasks.map((task) => {
                const StatusIcon = statusConfig[task.status].icon;
                return (
                  <div key={task.id} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => { setEditingTask(task); setDialogOpen(true); }}>
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(task.id); }}>
                      <StatusIcon className={cn("h-4 w-4", statusConfig[task.status].className)} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", task.status === "completada" && "line-through text-muted-foreground")}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                        <span>{task.assignee}</span>
                        <span>·</span>
                        <span>{task.hoursReal}/{task.hoursEstimated}h</span>
                      </div>
                    </div>
                    <PhaseBadge phase={task.phase} className="hidden sm:inline-flex" />
                    <span className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      task.priority === "alta" ? "bg-destructive/10 text-destructive" :
                      task.priority === "media" ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {task.priority}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                      className="text-xs text-destructive/70 hover:text-destructive transition-colors shrink-0"
                    >
                      Eliminar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Audit log - compact footer, never pushes tasks */}
        {allAuditEntries.length > 0 && (
          <Collapsible>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors cursor-pointer">
                <History className="h-3 w-3 text-muted-foreground" />
                <span className="text-[11px] font-medium text-muted-foreground">Auditoría</span>
                <span className="text-[10px] text-muted-foreground/60">({allAuditEntries.length})</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground ml-auto transition-transform [[data-state=open]>&]:rotate-90" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-1 rounded-lg border border-border bg-card">
                <ScrollArea className="max-h-28 h-28">
                  <div className="p-2 space-y-1">
                    {allAuditEntries.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-2 text-[10px] py-0.5 border-b border-border/30 last:border-0">
                        <span className="text-muted-foreground/60 shrink-0 w-24 font-mono">{entry.timestamp}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-card-foreground">{entry.taskTitle}</span>
                          <span className="text-muted-foreground"> — {entry.action}</span>
                          {entry.from && entry.to && (
                            <span className="ml-1 text-muted-foreground">
                              <span className="text-destructive/70">{entry.from}</span>
                              {" → "}
                              <span className="text-chart-2">{entry.to}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        projectId={project.id}
        defaultPhase={defaultPhase}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default ProjectDetailPage;

import { useState } from "react";
import { CheckCircle2, XCircle, Clock, User, AlertTriangle, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhaseBadge } from "@/components/PhaseBadge";
import { cn } from "@/lib/utils";
import { mockTasks as initialTasks, mockProjects } from "@/data/mockData";
import { Task, phaseLabels } from "@/types";
import { useNavigate } from "react-router-dom";

const ApprovalsPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const testingTasks = tasks.filter((t) => t.phase === "testing");

  const handleApprove = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const entry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          user: "Sistema",
          action: "Aprobada → Producción",
          from: phaseLabels.testing,
          to: phaseLabels.produccion,
        };
        return { ...t, phase: "produccion" as const, auditLog: [...t.auditLog, entry] };
      })
    );
  };

  const handleReject = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newRejections = t.rejections + 1;
        const entry = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          user: "Sistema",
          action: `Rechazada (rechazo #${newRejections})`,
          from: phaseLabels.testing,
          to: "Desarrollo",
        };
        return {
          ...t,
          phase: "desarrollo" as const,
          rejections: newRejections,
          auditLog: [...t.auditLog, entry],
        };
      })
    );
  };

  const getProject = (projectId: number) => mockProjects.find((p) => p.id === projectId);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Aprobaciones</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tareas en Testing pendientes de revisión ({testingTasks.length})
        </p>
      </div>

      {testingTasks.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay tareas pendientes de aprobación.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Las tareas en fase Testing aparecerán aquí.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testingTasks.map((task) => {
            const project = getProject(task.projectId);
            return (
              <div
                key={task.id}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-card-foreground">{task.title}</p>
                      <PhaseBadge phase="testing" />
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                          task.priority === "alta"
                            ? "bg-destructive/10 text-destructive"
                            : task.priority === "media"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span
                        className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => navigate(`/projects/${task.projectId}`)}
                      >
                        <FolderKanban className="h-3 w-3" />
                        {project?.name || `Proyecto #${task.projectId}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.hoursReal}/{task.hoursEstimated}h
                      </span>
                      {task.rejections > 0 && (
                        <span className="flex items-center gap-1 text-destructive font-medium">
                          <AlertTriangle className="h-3 w-3" />
                          Rechazos: {task.rejections}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleReject(task.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-phase-produccion text-white hover:bg-phase-produccion/90"
                      onClick={() => handleApprove(task.id)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Aprobar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApprovalsPage;

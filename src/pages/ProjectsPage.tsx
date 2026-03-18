import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, List, Columns3, GripVertical, Clock, User, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhaseBadge } from "@/components/PhaseBadge";
import { cn } from "@/lib/utils";
import { mockProjects as initialProjects } from "@/data/mockData";
import { Phase, Project, phases, phaseLabels } from "@/types";
import ProjectDialog from "@/components/ProjectDialog";

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverPhase, setDragOverPhase] = useState<Phase | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent, projectId: number) => {
    setDraggedId(projectId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPhase: Phase) => {
    e.preventDefault();
    if (draggedId !== null) {
      setProjects((prev) =>
        prev.map((p) => (p.id === draggedId ? { ...p, phase: targetPhase } : p))
      );
    }
    setDraggedId(null);
    setDragOverPhase(null);
  };

  const moveProject = (projectId: number, direction: "next" | "prev") => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const currentIdx = phases.indexOf(p.phase);
        const newIdx = direction === "next" ? currentIdx + 1 : currentIdx - 1;
        if (newIdx < 0 || newIdx >= phases.length) return p;
        return { ...p, phase: phases[newIdx] };
      })
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Proyectos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestión de proyectos y fases</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView("kanban")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Columns3 className="h-3.5 w-3.5 inline mr-1" />Kanban
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-3.5 w-3.5 inline mr-1" />Lista
            </button>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> <span className="hidden sm:inline">Nuevo proyecto</span><span className="sm:hidden">Nuevo</span>
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar proyectos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>

      {view === "kanban" ? (
        <div className="flex-1 min-h-0 relative">
          <button onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-background/90 border border-border rounded-full p-1 shadow-sm">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <button onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 md:hidden bg-background/90 border border-border rounded-full p-1 shadow-sm">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 h-full snap-x snap-mandatory md:snap-none scrollbar-thin">
            {phases.map((phase) => {
              const phaseProjects = filtered.filter((p) => p.phase === phase);
              return (
                <div
                  key={phase}
                  className={cn(
                    "flex-shrink-0 w-[280px] sm:w-[260px] md:flex-1 md:min-w-[200px] flex flex-col rounded-xl border bg-card transition-colors snap-center",
                    dragOverPhase === phase ? "border-primary bg-accent/50" : "border-border"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragOverPhase(phase); }}
                  onDragLeave={() => setDragOverPhase(null)}
                  onDrop={(e) => handleDrop(e, phase)}
                >
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <PhaseBadge phase={phase} />
                      <span className="text-xs text-muted-foreground font-medium">{phaseProjects.length}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {phaseProjects.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">Sin proyectos</div>
                    )}
                    {phaseProjects.map((project) => (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={() => { setDraggedId(null); setDragOverPhase(null); }}
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className={cn(
                          "rounded-lg border border-border bg-background p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-all group",
                          draggedId === project.id && "opacity-40 scale-95"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{project.client}</p>
                          </div>
                          <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="mt-2.5">
                          <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${project.progress}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {project.hoursReal}/{project.hoursEstimated}h</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {project.assignee.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); moveProject(project.id, "prev"); }} disabled={phases.indexOf(project.phase) === 0} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            <ChevronLeft className="h-3 w-3" /> Anterior
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); moveProject(project.id, "next"); }} disabled={phases.indexOf(project.phase) === phases.length - 1} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                            Siguiente <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="md:hidden divide-y divide-border">
            {filtered.map((project) => (
              <div key={project.id} className="p-4 space-y-2 cursor-pointer hover:bg-muted/30" onClick={() => navigate(`/projects/${project.id}`)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.client}</p>
                  </div>
                  <PhaseBadge phase={project.phase} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {project.hoursReal}/{project.hoursEstimated}h</span>
                  <span>{project.tasksDone}/{project.tasksTotal} tareas</span>
                  <div className="flex-1" />
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Proyecto</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Fase</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Progreso</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Horas</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Tareas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/projects/${project.id}`)}>
                    <td className="px-4 py-3.5"><span className="text-sm font-medium text-card-foreground">{project.name}</span></td>
                    <td className="px-4 py-3.5"><span className="text-sm text-muted-foreground">{project.client}</span></td>
                    <td className="px-4 py-3.5"><PhaseBadge phase={project.phase} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-sm", project.hoursReal > project.hoursEstimated ? "text-destructive font-medium" : "text-muted-foreground")}>
                        {project.hoursReal}/{project.hoursEstimated}h
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><span className="text-sm text-muted-foreground">{project.tasksDone}/{project.tasksTotal}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

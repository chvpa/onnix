export type Phase = "discovery" | "planning" | "development" | "testing" | "deploy" | "support";

export const phases: Phase[] = ["discovery", "planning", "development", "testing", "deploy", "support"];

export const phaseLabels: Record<Phase, string> = {
  discovery: "Descubrimiento",
  planning: "Planificación",
  development: "Desarrollo",
  testing: "Testing",
  deploy: "Deploy",
  support: "Soporte",
};

export type Priority = "alta" | "media" | "baja";
export type TicketStatus = "abierto" | "en_progreso" | "resuelto";
export type TaskStatus = "pendiente" | "en_progreso" | "completada" | "bloqueada";

export type AppRole = "product_owner" | "customer_experience" | "developer" | "data_analyst" | "client";

export const roleLabels: Record<AppRole, string> = {
  product_owner: "Product Owner",
  customer_experience: "Customer Experience",
  developer: "Developer",
  data_analyst: "Data Analyst",
  client: "Cliente",
};

export const roleColors: Record<AppRole, string> = {
  product_owner: "bg-primary text-primary-foreground",
  customer_experience: "bg-chart-2/15 text-chart-2",
  developer: "bg-chart-1/15 text-chart-1",
  data_analyst: "bg-chart-4/15 text-chart-4",
  client: "bg-muted text-muted-foreground",
};

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: AppRole;
  avatar?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Client {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  hoursTotal: number;
  hoursUsed: number;
  projects: number;
  status: "active" | "warning" | "exhausted";
  createdAt: string;
}

export interface Project {
  id: number;
  name: string;
  clientId: number;
  client: string;
  phase: Phase;
  progress: number;
  hoursEstimated: number;
  hoursReal: number;
  tasksTotal: number;
  tasksDone: number;
  assignee: string;
  description: string;
  startDate: string;
  endDate?: string;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  phase: Phase;
  status: TaskStatus;
  assignee: string;
  hoursEstimated: number;
  hoursReal: number;
  startDate: string;
  endDate?: string;
  priority: Priority;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  from?: string;
  to?: string;
}

export interface Ticket {
  id: number;
  title: string;
  client: string;
  clientId: number;
  type: string;
  priority: Priority;
  status: TicketStatus;
  assignee: string;
  created: string;
  messages: number;
  description: string;
  linkedTaskIds: number[];
}

export interface Permission {
  key: string;
  label: string;
  description: string;
}

export const allPermissions: Permission[] = [
  { key: "projects.create", label: "Crear proyectos", description: "Puede crear nuevos proyectos" },
  { key: "projects.edit", label: "Editar proyectos", description: "Puede editar proyectos existentes" },
  { key: "projects.delete", label: "Eliminar proyectos", description: "Puede eliminar proyectos" },
  { key: "tasks.create", label: "Crear tareas", description: "Puede crear nuevas tareas" },
  { key: "tasks.edit", label: "Editar tareas", description: "Puede editar tareas" },
  { key: "tasks.delete", label: "Eliminar tareas", description: "Puede eliminar tareas" },
  { key: "tickets.manage", label: "Gestionar tickets", description: "Puede gestionar tickets de soporte" },
  { key: "clients.manage", label: "Gestionar clientes", description: "Puede crear y editar clientes" },
  { key: "team.manage", label: "Gestionar equipo", description: "Puede agregar y editar miembros" },
  { key: "settings.manage", label: "Configuración", description: "Acceso a configuración general" },
];

export const defaultPermissions: Record<AppRole, string[]> = {
  product_owner: allPermissions.map((p) => p.key),
  customer_experience: ["tickets.manage", "clients.manage", "tasks.create", "tasks.edit"],
  developer: ["tasks.create", "tasks.edit", "projects.edit"],
  data_analyst: ["projects.edit", "tasks.edit"],
  client: [],
};

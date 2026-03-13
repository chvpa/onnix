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

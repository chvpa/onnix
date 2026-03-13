import { Client, Project, Task, Ticket } from "@/types";

export const mockClients: Client[] = [
  { id: 1, name: "TechCorp", contact: "Juan Pérez", email: "juan@techcorp.com", phone: "+54 11 4567-8901", hoursTotal: 500, hoursUsed: 320, projects: 3, status: "active", createdAt: "2024-01-15" },
  { id: 2, name: "FinBank", contact: "María López", email: "maria@finbank.com", phone: "+54 11 2345-6789", hoursTotal: 300, hoursUsed: 255, projects: 2, status: "active", createdAt: "2024-02-10" },
  { id: 3, name: "DataViz", contact: "Carlos Ruiz", email: "carlos@dataviz.io", phone: "+54 11 3456-7890", hoursTotal: 200, hoursUsed: 45, projects: 1, status: "active", createdAt: "2024-03-01" },
  { id: 4, name: "CloudNet", contact: "Ana García", email: "ana@cloudnet.com", phone: "+54 11 5678-9012", hoursTotal: 400, hoursUsed: 380, projects: 4, status: "warning", createdAt: "2024-01-20" },
  { id: 5, name: "RetailMax", contact: "Pedro Sánchez", email: "pedro@retailmax.com", phone: "+54 11 6789-0123", hoursTotal: 150, hoursUsed: 150, projects: 1, status: "exhausted", createdAt: "2024-04-05" },
  { id: 6, name: "EduTech", contact: "Laura Martín", email: "laura@edutech.com", phone: "+54 11 7890-1234", hoursTotal: 250, hoursUsed: 80, projects: 2, status: "active", createdAt: "2024-05-12" },
];

export const mockProjects: Project[] = [
  { id: 1, name: "Portal E-commerce", clientId: 1, client: "TechCorp", phase: "development", progress: 65, hoursEstimated: 120, hoursReal: 82, tasksTotal: 24, tasksDone: 16, assignee: "Carlos Dev", description: "Plataforma de e-commerce con carrito de compras, pasarela de pagos y panel de administración.", startDate: "2024-02-01" },
  { id: 2, name: "App Móvil Finanzas", clientId: 2, client: "FinBank", phase: "testing", progress: 85, hoursEstimated: 200, hoursReal: 175, tasksTotal: 32, tasksDone: 28, assignee: "Pedro Dev", description: "Aplicación móvil para consulta de saldos, transferencias y pagos de servicios.", startDate: "2024-01-15" },
  { id: 3, name: "Dashboard Analytics", clientId: 3, client: "DataViz", phase: "planning", progress: 25, hoursEstimated: 80, hoursReal: 18, tasksTotal: 12, tasksDone: 3, assignee: "Laura DA", description: "Dashboard interactivo con gráficos de métricas de negocio y exportación de reportes.", startDate: "2024-04-01" },
  { id: 4, name: "API Gateway", clientId: 4, client: "CloudNet", phase: "deploy", progress: 95, hoursEstimated: 60, hoursReal: 58, tasksTotal: 15, tasksDone: 14, assignee: "Carlos Dev", description: "Gateway centralizado para gestión de microservicios con autenticación y rate limiting.", startDate: "2024-03-10" },
  { id: 5, name: "CRM Integration", clientId: 1, client: "TechCorp", phase: "discovery", progress: 10, hoursEstimated: 90, hoursReal: 8, tasksTotal: 8, tasksDone: 1, assignee: "Ana CX", description: "Integración del CRM existente con el portal e-commerce y sistema de facturación.", startDate: "2024-05-20" },
  { id: 6, name: "Mobile Banking v2", clientId: 2, client: "FinBank", phase: "development", progress: 45, hoursEstimated: 150, hoursReal: 65, tasksTotal: 28, tasksDone: 12, assignee: "Pedro Dev", description: "Segunda versión de la app bancaria con biometría, inversiones y chatbot.", startDate: "2024-04-15" },
  { id: 7, name: "Data Pipeline", clientId: 3, client: "DataViz", phase: "testing", progress: 78, hoursEstimated: 100, hoursReal: 80, tasksTotal: 20, tasksDone: 16, assignee: "Laura DA", description: "Pipeline de datos ETL para procesamiento y normalización de fuentes externas.", startDate: "2024-03-01" },
  { id: 8, name: "Cloud Migration", clientId: 4, client: "CloudNet", phase: "support", progress: 100, hoursEstimated: 40, hoursReal: 42, tasksTotal: 10, tasksDone: 10, assignee: "Carlos Dev", description: "Migración de infraestructura on-premise a la nube con zero downtime.", startDate: "2024-01-10", endDate: "2024-04-20" },
];

export const mockTasks: Task[] = [
  // Project 1 - Portal E-commerce
  { id: 1, projectId: 1, title: "Diseño de wireframes del catálogo", description: "Crear wireframes para la vista de catálogo de productos", phase: "discovery", status: "completada", assignee: "Ana CX", hoursEstimated: 8, hoursReal: 7, startDate: "2024-02-01", endDate: "2024-02-05", priority: "media", auditLog: [{ id: 1, timestamp: "2024-02-05 14:30", user: "Ana CX", action: "Cambió estado", from: "en_progreso", to: "completada" }] },
  { id: 2, projectId: 1, title: "Modelo de datos de productos", description: "Definir esquema de base de datos para productos, categorías y variantes", phase: "planning", status: "completada", assignee: "Carlos Dev", hoursEstimated: 4, hoursReal: 5, startDate: "2024-02-06", endDate: "2024-02-08", priority: "alta", auditLog: [] },
  { id: 3, projectId: 1, title: "API REST de productos", description: "Endpoints CRUD para gestión de productos", phase: "development", status: "en_progreso", assignee: "Carlos Dev", hoursEstimated: 16, hoursReal: 12, startDate: "2024-02-10", priority: "alta", auditLog: [{ id: 2, timestamp: "2024-02-12 09:00", user: "Carlos Dev", action: "Cambió estado", from: "pendiente", to: "en_progreso" }] },
  { id: 4, projectId: 1, title: "Carrito de compras frontend", description: "Implementar componente de carrito con persistencia en localStorage", phase: "development", status: "en_progreso", assignee: "Pedro Dev", hoursEstimated: 12, hoursReal: 8, startDate: "2024-02-15", priority: "alta", auditLog: [] },
  { id: 5, projectId: 1, title: "Integración pasarela de pagos", description: "Conectar con Stripe para procesamiento de pagos", phase: "development", status: "pendiente", assignee: "Carlos Dev", hoursEstimated: 20, hoursReal: 0, startDate: "2024-03-01", priority: "alta", auditLog: [] },
  { id: 6, projectId: 1, title: "Tests E2E del checkout", description: "Pruebas automatizadas del flujo de compra completo", phase: "testing", status: "pendiente", assignee: "Laura DA", hoursEstimated: 10, hoursReal: 0, startDate: "2024-03-15", priority: "media", auditLog: [] },
  { id: 7, projectId: 1, title: "Deploy a staging", description: "Configurar pipeline CI/CD y deploy a ambiente de staging", phase: "deploy", status: "pendiente", assignee: "Carlos Dev", hoursEstimated: 6, hoursReal: 0, startDate: "2024-04-01", priority: "media", auditLog: [] },

  // Project 2 - App Móvil Finanzas
  { id: 8, projectId: 2, title: "Diseño UI de transferencias", description: "Pantallas de transferencia entre cuentas propias y terceros", phase: "development", status: "completada", assignee: "Ana CX", hoursEstimated: 10, hoursReal: 9, startDate: "2024-01-20", endDate: "2024-02-01", priority: "alta", auditLog: [] },
  { id: 9, projectId: 2, title: "Módulo de autenticación biométrica", description: "Integrar Face ID y Touch ID para login", phase: "testing", status: "en_progreso", assignee: "Pedro Dev", hoursEstimated: 24, hoursReal: 20, startDate: "2024-02-15", priority: "alta", auditLog: [] },
  { id: 10, projectId: 2, title: "Tests de seguridad", description: "Penetration testing y validación de cifrado", phase: "testing", status: "pendiente", assignee: "Carlos Dev", hoursEstimated: 16, hoursReal: 0, startDate: "2024-03-20", priority: "alta", auditLog: [] },

  // Project 3 - Dashboard Analytics
  { id: 11, projectId: 3, title: "Relevamiento de métricas", description: "Definir KPIs y métricas a visualizar con el cliente", phase: "discovery", status: "completada", assignee: "Laura DA", hoursEstimated: 6, hoursReal: 5, startDate: "2024-04-01", endDate: "2024-04-05", priority: "alta", auditLog: [] },
  { id: 12, projectId: 3, title: "Diseño de dashboard", description: "Mockups de alta fidelidad del dashboard principal", phase: "planning", status: "en_progreso", assignee: "Ana CX", hoursEstimated: 8, hoursReal: 4, startDate: "2024-04-10", priority: "media", auditLog: [] },
  { id: 13, projectId: 3, title: "Conexión a fuentes de datos", description: "Integrar APIs de fuentes de datos externas", phase: "planning", status: "pendiente", assignee: "Laura DA", hoursEstimated: 12, hoursReal: 0, startDate: "2024-04-20", priority: "alta", auditLog: [] },

  // Project 4 - API Gateway
  { id: 14, projectId: 4, title: "Configuración de Kubernetes", description: "Setup de cluster K8s para el gateway", phase: "deploy", status: "en_progreso", assignee: "Carlos Dev", hoursEstimated: 8, hoursReal: 6, startDate: "2024-04-10", priority: "alta", auditLog: [] },
  { id: 15, projectId: 4, title: "Monitoreo y alertas", description: "Configurar Grafana y Prometheus para monitoreo", phase: "deploy", status: "pendiente", assignee: "Carlos Dev", hoursEstimated: 6, hoursReal: 0, startDate: "2024-04-15", priority: "media", auditLog: [] },
];

export const mockTickets: Ticket[] = [
  { id: 1, title: "Error en checkout - no procesa pagos", client: "TechCorp", clientId: 1, type: "Bug", priority: "alta", status: "abierto", assignee: "Carlos Dev", created: "hace 2h", messages: 3, description: "Al intentar finalizar la compra con tarjeta de crédito, el sistema muestra error 500.", linkedTaskIds: [] },
  { id: 2, title: "Actualizar logo en header", client: "FinBank", clientId: 2, type: "Cambio visual", priority: "baja", status: "en_progreso", assignee: "Ana CX", created: "hace 5h", messages: 1, description: "Necesitamos cambiar el logo del header por la nueva versión de marca.", linkedTaskIds: [] },
  { id: 3, title: "Rendimiento lento en dashboard", client: "DataViz", clientId: 3, type: "Performance", priority: "media", status: "abierto", assignee: "Sin asignar", created: "hace 1d", messages: 5, description: "El dashboard tarda más de 10 segundos en cargar los gráficos principales.", linkedTaskIds: [] },
  { id: 4, title: "Nuevo campo en formulario de registro", client: "CloudNet", clientId: 4, type: "Feature", priority: "media", status: "en_progreso", assignee: "Pedro Dev", created: "hace 2d", messages: 8, description: "Agregar campo de CUIT/CUIL al formulario de registro de usuarios.", linkedTaskIds: [5] },
  { id: 5, title: "Error 500 en API de reportes", client: "TechCorp", clientId: 1, type: "Bug", priority: "alta", status: "abierto", assignee: "Carlos Dev", created: "hace 3h", messages: 2, description: "La API de reportes devuelve error 500 al consultar datos del último mes.", linkedTaskIds: [] },
  { id: 6, title: "Exportar CSV no incluye fechas", client: "EduTech", clientId: 6, type: "Bug", priority: "media", status: "resuelto", assignee: "Laura DA", created: "hace 3d", messages: 4, description: "Al exportar a CSV desde el panel de reportes, las columnas de fecha aparecen vacías.", linkedTaskIds: [] },
];

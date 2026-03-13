# Onnix — Plataforma de Gestión Interna para Desarrollo de Software

Onnix es una plataforma web interna que centraliza la gestión de **clientes, proyectos, tareas, equipos y soporte** en un solo lugar. Diseñada para empresas de desarrollo de software que necesitan control total sobre su operación.

## 🚀 Funcionalidades principales

### 📊 Dashboard
- Resumen de KPIs: clientes activos, proyectos en curso, horas consumidas, tickets abiertos.
- Pipeline visual de las 6 fases del ciclo de vida de proyectos.
- Acceso rápido a proyectos y tickets recientes.

### 👥 Gestión de Clientes
- CRUD completo de clientes con formulario de creación/edición.
- Paquete de horas contratadas con barra de progreso visual.
- Estado automático según consumo de horas (activo, advertencia, agotado).
- Vista detallada del cliente con sus proyectos y tickets asociados.
- Búsqueda y filtrado en tiempo real.

### 📁 Gestión de Proyectos
- **Tablero Kanban** con drag & drop para mover proyectos entre las 6 fases.
- Vista alternativa en **tabla/lista** responsive.
- Cada proyecto se asocia a un cliente y contiene métricas de progreso, horas y tareas.
- Navegación al detalle del proyecto con click.

### ✅ Gestión de Tareas (por proyecto)
- **Tablero Kanban** de tareas dentro de cada proyecto con drag & drop entre fases.
- Ciclo de estados: Pendiente → En progreso → Completada → Bloqueada.
- Cada tarea incluye: responsable, horas estimadas/reales, prioridad, fase.
- Botón de agregar tarea directamente en cada columna del Kanban.
- Vista lista alternativa con click para editar.
- **Log de auditoría** que registra cada cambio de fase y estado.

### 🎫 Tickets de Soporte
- Listado de tickets con filtros por estado (Abierto, En progreso, Resuelto).
- Indicador visual de prioridad (alta, media, baja).
- Búsqueda por título y cliente.

### 🌗 Dark / Light Mode
- Toggle de tema persistente en `localStorage`.
- Diseño completo para ambos modos con variables CSS semánticas.

## 🏗️ Ciclo de vida de un proyecto

Cada proyecto atraviesa **6 fases fijas** representadas visualmente:

| Fase | Color | Descripción |
|------|-------|-------------|
| 🟣 Descubrimiento | Violeta | Relevamiento y definición de requerimientos |
| 🔵 Planificación | Azul | Diseño de arquitectura y planificación |
| 🟠 Desarrollo | Naranja | Implementación y codificación |
| 🟡 Testing | Amarillo | Pruebas y QA |
| 🟢 Deploy | Verde | Despliegue a producción |
| 🔴 Soporte | Rosa | Mantenimiento post-producción |

## 🛠️ Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| **React 18** | Framework de UI |
| **TypeScript** | Tipado estático |
| **Vite** | Build tool y dev server |
| **Tailwind CSS** | Utilidades de estilo |
| **shadcn/ui** | Componentes de UI (Dialog, Select, etc.) |
| **React Router** | Navegación SPA |
| **TanStack Query** | Gestión de estado asíncrono |
| **Lucide React** | Iconografía |

## 📂 Estructura del proyecto

```
src/
├── components/
│   ├── ui/              # Componentes shadcn/ui
│   ├── AppLayout.tsx     # Layout principal con sidebar
│   ├── AppSidebar.tsx    # Sidebar con navegación y toggle de tema
│   ├── ClientDialog.tsx  # Dialog para crear/editar clientes
│   ├── TaskDialog.tsx    # Dialog para crear/editar tareas
│   ├── PhaseBadge.tsx    # Badge de fase con colores semánticos
│   └── StatCard.tsx      # Tarjeta de métricas del dashboard
├── data/
│   └── mockData.ts       # Datos mock centralizados
├── pages/
│   ├── Dashboard.tsx          # Vista principal con KPIs
│   ├── ClientsPage.tsx        # Listado y CRUD de clientes
│   ├── ClientDetailPage.tsx   # Detalle del cliente
│   ├── ProjectsPage.tsx       # Kanban/Lista de proyectos
│   ├── ProjectDetailPage.tsx  # Detalle del proyecto con tareas Kanban
│   ├── TicketsPage.tsx        # Gestión de tickets de soporte
│   └── SettingsPage.tsx       # Configuración
├── types/
│   └── index.ts          # Tipos TypeScript compartidos
├── App.tsx               # Router y providers
└── index.css             # Variables CSS del sistema de diseño
```

## 🎨 Sistema de diseño

- **Colores primarios:** Naranja (HSL 24 100% 50%) con acentos neutros.
- **Tipografía:** Inter (sans) + JetBrains Mono (mono).
- **Tokens semánticos:** Variables CSS HSL para temas claro/oscuro.
- **Componentes:** shadcn/ui customizados con variantes (PhaseBadge, StatCard).

## 🗺️ Roles del sistema (planificados)

| Rol | Permisos |
|-----|----------|
| **Product Owner** | Administrador total |
| **Customer Experience** | Gestión de tickets, visibilidad de proyectos |
| **Developer** | Gestión de tareas técnicas |
| **Data Analyst** | Reportes y métricas |
| **Cliente** | Portal propio: ver proyectos, horas, cargar tickets |

## 📋 Roadmap

- [ ] Autenticación y autorización con roles
- [ ] Base de datos con Lovable Cloud
- [ ] Portal del cliente
- [ ] Sistema de features (mini-proyectos post-producción)
- [ ] Conversión ticket → tarea con referencia cruzada
- [ ] Carga de documentos e imágenes en tickets
- [ ] Notificaciones por WhatsApp y email
- [ ] Módulo de reportes internos
- [ ] Gestión de equipo y asignaciones

## 🚀 Desarrollo local

```sh
git clone <URL_DEL_REPO>
cd onnix
npm install
npm run dev
```

## 📦 Deploy

Publicar directamente desde [Lovable](https://lovable.dev) → Share → Publish.

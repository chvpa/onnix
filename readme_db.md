# Onnix — Estructura de Base de Datos (Supabase)

Este documento describe la estructura completa de tablas, relaciones, RLS, funciones y storage necesarios para migrar Onnix a Supabase.

---

## 1. Enums

```sql
-- Fases de proyecto (6)
CREATE TYPE public.project_phase AS ENUM (
  'descubrimiento', 'planificacion', 'en_aprobacion', 'desarrollo', 'testing', 'produccion'
);

-- Fases de tarea (4)
CREATE TYPE public.task_phase AS ENUM (
  'pendiente', 'desarrollo', 'testing', 'produccion'
);

CREATE TYPE public.priority AS ENUM ('alta', 'media', 'baja');
CREATE TYPE public.ticket_status AS ENUM ('abierto', 'en_progreso', 'resuelto');
CREATE TYPE public.task_status AS ENUM ('pendiente', 'en_progreso', 'completada', 'bloqueada');
CREATE TYPE public.ticket_type AS ENUM ('Nueva implementación', 'Bug en Dashboard', 'Bug en Bot', 'Otros');
CREATE TYPE public.app_role AS ENUM ('product_owner', 'customer_experience', 'developer', 'data_analyst', 'client');
```

---

## 2. Tablas

### 2.1 `user_roles`

Almacena los roles de cada usuario autenticado. **Nunca** almacenar roles en la tabla de profiles.

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
```

### 2.2 `profiles`

Perfil básico de cada usuario autenticado (equipo interno).

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### 2.3 `clients`

Empresas clientes con paquete de horas contratado.

```sql
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  hours_total INTEGER NOT NULL DEFAULT 0,
  hours_used INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'warning', 'exhausted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
```

### 2.4 `client_users`

Usuarios del cliente que pueden visualizar proyectos y cargar tickets.

```sql
CREATE TABLE public.client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_id)
);

ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
```

### 2.5 `projects`

Proyectos asociados a un cliente, con 6 fases.

```sql
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  phase project_phase NOT NULL DEFAULT 'descubrimiento',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  hours_estimated INTEGER NOT NULL DEFAULT 0,
  hours_real INTEGER NOT NULL DEFAULT 0,
  assignee_id UUID REFERENCES auth.users(id),
  description TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
```

### 2.6 `tasks`

Tareas dentro de un proyecto, con 4 fases.

```sql
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  phase task_phase NOT NULL DEFAULT 'pendiente',
  status task_status NOT NULL DEFAULT 'pendiente',
  assignee_id UUID REFERENCES auth.users(id),
  hours_estimated NUMERIC(6,1) NOT NULL DEFAULT 0,
  hours_real NUMERIC(6,1) NOT NULL DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  priority priority NOT NULL DEFAULT 'media',
  rejections INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
```

### 2.7 `audit_log`

Registro de auditoría para cada cambio de estado en tareas.

```sql
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  from_value TEXT,
  to_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
```

### 2.8 `tickets`

Tickets de soporte vinculados a un cliente.

```sql
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  type ticket_type NOT NULL DEFAULT 'Otros',
  priority priority NOT NULL DEFAULT 'media',
  status ticket_status NOT NULL DEFAULT 'abierto',
  assignee_id UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
```

### 2.9 `ticket_messages`

Mensajes dentro de un ticket (conversación).

```sql
CREATE TABLE public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
```

### 2.10 `ticket_linked_tasks`

Relación N:N entre tickets y tareas.

```sql
CREATE TABLE public.ticket_linked_tasks (
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  PRIMARY KEY (ticket_id, task_id)
);

ALTER TABLE public.ticket_linked_tasks ENABLE ROW LEVEL SECURITY;
```

### 2.11 `permissions`

Permisos custom por rol (override de defaults).

```sql
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_key TEXT NOT NULL,
  granted BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (role, permission_key)
);

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
```

---

## 3. Función de verificación de roles

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

---

## 4. Función para obtener el client_id de un usuario

```sql
CREATE OR REPLACE FUNCTION public.get_client_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT client_id
  FROM public.client_users
  WHERE user_id = _user_id
  LIMIT 1
$$;
```

---

## 5. Políticas RLS

### Profiles
```sql
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
```

### Clients
```sql
-- Equipo interno puede ver todos los clientes
CREATE POLICY "Team can view all clients"
  ON public.clients FOR SELECT TO authenticated
  USING (NOT public.has_role(auth.uid(), 'client'));

-- Cliente solo ve su empresa
CREATE POLICY "Client can view own company"
  ON public.clients FOR SELECT TO authenticated
  USING (
    id = public.get_client_id(auth.uid())
  );

-- Solo PO y CX pueden crear/editar clientes
CREATE POLICY "PO/CX can manage clients"
  ON public.clients FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'product_owner')
    OR public.has_role(auth.uid(), 'customer_experience')
  );
```

### Projects
```sql
-- Equipo ve todos los proyectos
CREATE POLICY "Team can view all projects"
  ON public.projects FOR SELECT TO authenticated
  USING (NOT public.has_role(auth.uid(), 'client'));

-- Cliente solo ve sus proyectos
CREATE POLICY "Client can view own projects"
  ON public.projects FOR SELECT TO authenticated
  USING (
    client_id = public.get_client_id(auth.uid())
  );
```

### Tasks
```sql
-- Equipo ve todas las tareas
CREATE POLICY "Team can view all tasks"
  ON public.tasks FOR SELECT TO authenticated
  USING (NOT public.has_role(auth.uid(), 'client'));
```

### Tickets
```sql
-- Equipo ve todos los tickets
CREATE POLICY "Team can view all tickets"
  ON public.tickets FOR SELECT TO authenticated
  USING (NOT public.has_role(auth.uid(), 'client'));

-- Cliente ve solo tickets de su empresa
CREATE POLICY "Client can view own tickets"
  ON public.tickets FOR SELECT TO authenticated
  USING (
    client_id = public.get_client_id(auth.uid())
  );

-- Cliente puede crear tickets para su empresa
CREATE POLICY "Client can create tickets"
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (
    client_id = public.get_client_id(auth.uid())
    AND created_by = auth.uid()
  );
```

### Ticket Messages
```sql
-- Participantes del ticket pueden ver mensajes
CREATE POLICY "Participants can view messages"
  ON public.ticket_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
        AND (
          NOT public.has_role(auth.uid(), 'client')
          OR t.client_id = public.get_client_id(auth.uid())
        )
    )
  );

-- Autenticados pueden enviar mensajes en tickets accesibles
CREATE POLICY "Participants can send messages"
  ON public.ticket_messages FOR INSERT TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tickets t
      WHERE t.id = ticket_id
        AND (
          NOT public.has_role(auth.uid(), 'client')
          OR t.client_id = public.get_client_id(auth.uid())
        )
    )
  );
```

---

## 6. Storage — Bucket de documentos

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
```

### Políticas de Storage

```sql
-- Equipo puede subir archivos
CREATE POLICY "Team can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND NOT public.has_role(auth.uid(), 'client')
  );

-- Equipo puede ver todos los documentos
CREATE POLICY "Team can view documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND NOT public.has_role(auth.uid(), 'client')
  );

-- Clientes pueden subir documentos en su carpeta
CREATE POLICY "Client can upload own documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.get_client_id(auth.uid())::text
  );

-- Clientes pueden ver documentos en su carpeta
CREATE POLICY "Client can view own documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = public.get_client_id(auth.uid())::text
  );
```

---

## 7. Trigger: Auto-crear perfil en signup

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 8. Estructura de carpetas en Storage

```
documents/
  {client_id}/
    tickets/
      {ticket_id}/
        archivo.pdf
        imagen.png
    projects/
      {project_id}/
        documento.pdf
```

---

## 9. Vista del Cliente

El rol `client` tiene acceso limitado:
- ✅ Ver proyectos de su empresa
- ✅ Ver y crear tickets de soporte
- ✅ Enviar mensajes en tickets
- ✅ Subir documentos en su carpeta
- ❌ No puede cambiar estado de tickets
- ❌ No puede ver Dashboard, Aprobaciones ni Configuración
- ❌ No puede ver tareas ni registro de auditoría

---

## 10. Índices recomendados

```sql
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_phase ON public.tasks(phase);
CREATE INDEX idx_tickets_client_id ON public.tickets(client_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_audit_log_task_id ON public.audit_log(task_id);
CREATE INDEX idx_ticket_messages_ticket_id ON public.ticket_messages(ticket_id);
CREATE INDEX idx_client_users_client_id ON public.client_users(client_id);
CREATE INDEX idx_client_users_user_id ON public.client_users(user_id);
CREATE INDEX idx_projects_client_id ON public.projects(client_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
```

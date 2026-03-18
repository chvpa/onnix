import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Paperclip, Clock, User, Tag, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { mockTickets } from "@/data/mockData";
import { TicketStatus } from "@/types";

interface Message {
  id: number;
  author: string;
  role: "client" | "team";
  content: string;
  timestamp: string;
}

const statusLabels: Record<TicketStatus, string> = {
  abierto: "Abierto",
  en_progreso: "En progreso",
  resuelto: "Resuelto",
};

const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, author: "Juan Pérez", role: "client", content: "Al intentar finalizar la compra con tarjeta Visa, el sistema muestra error 500. Adjunto captura de pantalla.", timestamp: "14:30" },
    { id: 2, author: "Carlos Dev", role: "team", content: "Recibido Juan, estamos revisando los logs del servidor. ¿Podés confirmar si el error ocurre con todas las tarjetas o solo con Visa?", timestamp: "14:45" },
    { id: 3, author: "Juan Pérez", role: "client", content: "Probé con Mastercard también y da el mismo error. Parece que es con cualquier tarjeta.", timestamp: "15:10" },
  ],
  2: [
    { id: 1, author: "María López", role: "client", content: "Necesitamos actualizar el logo del header con la nueva versión que les envié por mail.", timestamp: "09:00" },
  ],
  3: [
    { id: 1, author: "Carlos Ruiz", role: "client", content: "El dashboard tarda mucho en cargar. Antes cargaba en 2 segundos y ahora pasan más de 10.", timestamp: "10:00" },
    { id: 2, author: "Laura DA", role: "team", content: "Vamos a revisar las queries del dashboard. ¿Notaste esto con algún filtro en particular?", timestamp: "10:30" },
    { id: 3, author: "Carlos Ruiz", role: "client", content: "Sí, cuando selecciono el rango de fechas del último trimestre es cuando más tarda.", timestamp: "11:00" },
    { id: 4, author: "Laura DA", role: "team", content: "Encontré el problema, hay un full table scan en la query de ventas trimestrales. Lo estoy optimizando.", timestamp: "14:00" },
    { id: 5, author: "Carlos Ruiz", role: "client", content: "¡Genial! Quedo atento. Gracias Laura.", timestamp: "14:15" },
  ],
  4: [
    { id: 1, author: "Ana García", role: "client", content: "Necesitamos agregar el campo CUIT/CUIL al formulario de registro.", timestamp: "08:00" },
    { id: 2, author: "Ana CX", role: "team", content: "Perfecto Ana, ya creamos la tarea. ¿El campo debe ser obligatorio?", timestamp: "08:30" },
    { id: 3, author: "Ana García", role: "client", content: "Sí, obligatorio y con validación de formato.", timestamp: "09:00" },
    { id: 4, author: "Pedro Dev", role: "team", content: "Implementando. Voy a agregar validación de dígito verificador también.", timestamp: "10:00" },
    { id: 5, author: "Ana García", role: "client", content: "Excelente, eso sería ideal.", timestamp: "10:15" },
    { id: 6, author: "Pedro Dev", role: "team", content: "Ya está desplegado en staging para que lo revisen.", timestamp: "16:00" },
    { id: 7, author: "Ana García", role: "client", content: "Lo probé y funciona perfecto. ¿Cuándo pasa a producción?", timestamp: "16:30" },
    { id: 8, author: "Pedro Dev", role: "team", content: "Mañana a primera hora hacemos el deploy.", timestamp: "17:00" },
  ],
  5: [
    { id: 1, author: "Juan Pérez", role: "client", content: "La API de reportes devuelve error 500 cuando consulto datos del último mes.", timestamp: "11:00" },
    { id: 2, author: "Carlos Dev", role: "team", content: "Revisando. ¿Podés compartir el endpoint exacto que estás usando?", timestamp: "11:30" },
  ],
  6: [
    { id: 1, author: "Laura Martín", role: "client", content: "Al exportar a CSV las columnas de fecha aparecen vacías.", timestamp: "09:00" },
    { id: 2, author: "Laura DA", role: "team", content: "Era un bug en el formato de serialización. Ya está corregido.", timestamp: "14:00" },
    { id: 3, author: "Laura Martín", role: "client", content: "Confirmado, ahora funciona correctamente. Gracias!", timestamp: "15:00" },
    { id: 4, author: "Laura DA", role: "team", content: "De nada, cerramos el ticket.", timestamp: "15:10" },
  ],
};

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = mockTickets.find((t) => t.id === Number(id));
  const [messages, setMessages] = useState<Message[]>(mockMessages[Number(id)] || []);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState<TicketStatus>(ticket?.status || "abierto");

  if (!ticket) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Ticket no encontrado.</p>
        <Button variant="outline" onClick={() => navigate("/tickets")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      author: "Tú (Equipo)",
      role: "team",
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, msg]);
    setNewMessage("");
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col max-w-5xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/tickets")} className="self-start mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Tickets
      </Button>

      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Conversation panel */}
        <div className="flex-1 flex flex-col rounded-xl border border-border bg-card min-h-0">
          {/* Ticket header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-base font-semibold text-card-foreground">{ticket.title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{ticket.client} · {ticket.created}</p>
              </div>
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shrink-0",
                status === "abierto" ? "bg-destructive/10 text-destructive" :
                status === "en_progreso" ? "bg-warning/10 text-warning" :
                "bg-success/10 text-success"
              )}>
                {statusLabels[status]}
              </span>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "team" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                    msg.role === "team" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                  )}>
                    {msg.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className={cn(
                    "rounded-xl px-4 py-2.5",
                    msg.role === "team"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">{msg.author}</span>
                      <span className={cn("text-xs", msg.role === "team" ? "text-primary-foreground/60" : "text-muted-foreground")}>{msg.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {messages.length === 0 && (
                <div className="text-center py-12 text-sm text-muted-foreground">No hay mensajes aún.</div>
              )}
            </div>
          </ScrollArea>

          {/* Message input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="min-h-[44px] max-h-32 resize-none"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <div className="flex flex-col gap-1">
                <Button size="sm" onClick={handleSend} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="w-full lg:w-72 space-y-3 shrink-0">
          {/* Details */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground">Detalles</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Tipo</span>
                <span className="font-medium text-card-foreground">{ticket.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" /> Prioridad</span>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  ticket.priority === "alta" ? "bg-destructive/10 text-destructive" :
                  ticket.priority === "media" ? "bg-warning/10 text-warning" :
                  "bg-muted text-muted-foreground"
                )}>
                  {ticket.priority}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> Asignado</span>
                <span className="font-medium text-card-foreground">{ticket.assignee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Creado</span>
                <span className="text-card-foreground">{ticket.created}</span>
              </div>
            </div>
          </div>

          {/* Status actions */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-card-foreground">Cambiar estado</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {(["abierto", "en_progreso", "resuelto"] as TicketStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={cn(
                    "text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors border",
                    status === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {statusLabels[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <h3 className="text-sm font-semibold text-card-foreground">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotifSetting {
  key: string;
  label: string;
  description: string;
}

const notifications: NotifSetting[] = [
  { key: "new_ticket", label: "Nuevo ticket", description: "Cuando un cliente crea un nuevo ticket de soporte" },
  { key: "task_completed", label: "Tarea completada", description: "Cuando una tarea cambia a estado completada" },
  { key: "phase_change", label: "Cambio de fase", description: "Cuando un proyecto avanza de fase" },
  { key: "hours_alert", label: "Alerta de horas", description: "Cuando un cliente supera el umbral de consumo" },
  { key: "team_mention", label: "Menciones", description: "Cuando te mencionan en un comentario o ticket" },
  { key: "weekly_report", label: "Reporte semanal", description: "Resumen semanal de actividad por email" },
];

const SettingsNotifications = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(notifications.map((n) => [n.key, true]))
  );

  const toggle = (key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast.success("Preferencias guardadas");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Elige qué notificaciones quieres recibir.</p>

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {notifications.map((n) => (
          <div key={n.key} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
            <div>
              <Label className="text-sm font-medium text-card-foreground">{n.label}</Label>
              <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
            </div>
            <Switch checked={enabled[n.key]} onCheckedChange={() => toggle(n.key)} />
          </div>
        ))}
      </div>

      <Button size="sm" onClick={handleSave}>Guardar preferencias</Button>
    </div>
  );
};

export default SettingsNotifications;

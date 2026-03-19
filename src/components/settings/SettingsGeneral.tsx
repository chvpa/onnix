import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsGeneral = () => {
  const [companyName, setCompanyName] = useState("Onnix Digital");
  const [timezone, setTimezone] = useState("America/Argentina/Buenos_Aires");
  const [language, setLanguage] = useState("es");

  const handleSave = () => {
    toast.success("Configuración guardada");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Información de la empresa</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre de la empresa</Label>
            <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Zona horaria</Label>
            <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Idioma</Label>
            <Input value={language} onChange={(e) => setLanguage(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h3 className="text-sm font-semibold text-card-foreground">Preferencias del proyecto</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Horas por defecto por paquete</Label>
            <Input type="number" defaultValue={40} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Alerta de consumo (%)</Label>
            <Input type="number" defaultValue={80} />
          </div>
        </div>
      </div>

      <Button onClick={handleSave} size="sm">Guardar cambios</Button>
    </div>
  );
};

export default SettingsGeneral;

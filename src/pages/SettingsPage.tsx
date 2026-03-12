import { Settings, Bell, Shield, Users } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1">Ajustes de la plataforma</p>
      </div>

      <div className="space-y-3">
        {[
          { icon: Settings, title: "General", desc: "Configuración general de la plataforma" },
          { icon: Users, title: "Equipo", desc: "Gestión de miembros y roles del equipo" },
          { icon: Shield, title: "Permisos", desc: "Configuración de permisos por rol" },
          { icon: Bell, title: "Notificaciones", desc: "Preferencias de notificaciones" },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow cursor-pointer"
          >
            <div className="rounded-lg bg-accent p-2.5">
              <item.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-card-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;

import { useState } from "react";
import { Settings, Bell, Shield, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SettingsGeneral from "@/components/settings/SettingsGeneral";
import SettingsTeam from "@/components/settings/SettingsTeam";
import SettingsPermissions from "@/components/settings/SettingsPermissions";
import SettingsNotifications from "@/components/settings/SettingsNotifications";

const tabs = [
  { value: "general", label: "General", icon: Settings },
  { value: "team", label: "Equipo", icon: Users },
  { value: "permissions", label: "Permisos", icon: Shield },
  { value: "notifications", label: "Notificaciones", icon: Bell },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-5 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground mt-1 text-sm">Ajustes de la plataforma</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start bg-muted/50 p-1 h-auto flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <SettingsGeneral />
        </TabsContent>
        <TabsContent value="team" className="mt-4">
          <SettingsTeam />
        </TabsContent>
        <TabsContent value="permissions" className="mt-4">
          <SettingsPermissions />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <SettingsNotifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

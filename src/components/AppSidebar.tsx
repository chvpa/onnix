import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  TicketCheck,
  Settings,
  ChevronLeft,
  Sun,
  Moon,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/clients", icon: Users, label: "Clientes" },
  { to: "/projects", icon: FolderKanban, label: "Proyectos" },
  { to: "/tickets", icon: TicketCheck, label: "Soporte" },
  { to: "/settings", icon: Settings, label: "Configuración" },
];

interface AppSidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppSidebar = ({ darkMode, onToggleDarkMode }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground animate-fade-in">
            Onnix
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="animate-fade-in">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <button
          onClick={onToggleDarkMode}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          {darkMode ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          {!collapsed && <span>{darkMode ? "Modo claro" : "Modo oscuro"}</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 shrink-0 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Colapsar</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

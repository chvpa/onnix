import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const AppLayout = ({ children, darkMode, onToggleDarkMode }: AppLayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;

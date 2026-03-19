import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { AppRole, roleLabels, roleColors, allPermissions, defaultPermissions } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const editableRoles: AppRole[] = ["product_owner", "customer_experience", "developer", "data_analyst", "client"];

const SettingsPermissions = () => {
  const [permissions, setPermissions] = useState<Record<AppRole, string[]>>({ ...defaultPermissions });

  const toggle = (role: AppRole, key: string) => {
    setPermissions((prev) => {
      const current = prev[role];
      const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
      return { ...prev, [role]: next };
    });
  };

  const handleSave = () => {
    toast.success("Permisos actualizados");
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Configura los permisos por rol. Los cambios se aplican a todos los usuarios con ese rol.</p>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-medium text-muted-foreground min-w-[180px]">Permiso</th>
              {editableRoles.map((role) => (
                <th key={role} className="p-3 text-center">
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", roleColors[role])}>
                    {roleLabels[role]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPermissions.map((perm) => (
              <tr key={perm.key} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                <td className="p-3">
                  <p className="font-medium text-card-foreground">{perm.label}</p>
                  <p className="text-muted-foreground mt-0.5">{perm.description}</p>
                </td>
                {editableRoles.map((role) => (
                  <td key={role} className="p-3 text-center">
                    <Checkbox
                      checked={permissions[role].includes(perm.key)}
                      onCheckedChange={() => toggle(role, perm.key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button size="sm" onClick={handleSave}>Guardar permisos</Button>
    </div>
  );
};

export default SettingsPermissions;

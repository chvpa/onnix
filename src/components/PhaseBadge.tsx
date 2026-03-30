import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const phaseBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      phase: {
        pendiente: "bg-phase-pendiente/15 text-phase-pendiente",
        desarrollo: "bg-phase-desarrollo/15 text-phase-desarrollo",
        testing: "bg-phase-testing/15 text-phase-testing",
        produccion: "bg-phase-produccion/15 text-phase-produccion",
        descubrimiento: "bg-phase-descubrimiento/15 text-phase-descubrimiento",
        planificacion: "bg-phase-planificacion/15 text-phase-planificacion",
        en_aprobacion: "bg-phase-en-aprobacion/15 text-phase-en-aprobacion",
      },
    },
    defaultVariants: {
      phase: "pendiente",
    },
  }
);

const phaseLabels: Record<string, string> = {
  pendiente: "Pendiente",
  desarrollo: "Desarrollo",
  testing: "Testing",
  produccion: "Producción",
  descubrimiento: "Descubrimiento",
  planificacion: "Planificación",
  en_aprobacion: "En aprobación",
};

interface PhaseBadgeProps extends VariantProps<typeof phaseBadgeVariants> {
  className?: string;
}

const PhaseBadge = ({ phase, className }: PhaseBadgeProps) => {
  return (
    <span className={cn(phaseBadgeVariants({ phase }), className)}>
      {phaseLabels[phase || "pendiente"]}
    </span>
  );
};

export { PhaseBadge, phaseBadgeVariants };

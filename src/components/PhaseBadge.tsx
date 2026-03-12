import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const phaseBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      phase: {
        discovery: "bg-phase-discovery/15 text-phase-discovery",
        planning: "bg-phase-planning/15 text-phase-planning",
        development: "bg-phase-development/15 text-phase-development",
        testing: "bg-phase-testing/15 text-phase-testing",
        deploy: "bg-phase-deploy/15 text-phase-deploy",
        support: "bg-phase-support/15 text-phase-support",
      },
    },
    defaultVariants: {
      phase: "discovery",
    },
  }
);

const phaseLabels: Record<string, string> = {
  discovery: "Descubrimiento",
  planning: "Planificación",
  development: "Desarrollo",
  testing: "Testing",
  deploy: "Deploy",
  support: "Soporte",
};

interface PhaseBadgeProps extends VariantProps<typeof phaseBadgeVariants> {
  className?: string;
}

const PhaseBadge = ({ phase, className }: PhaseBadgeProps) => {
  return (
    <span className={cn(phaseBadgeVariants({ phase }), className)}>
      {phaseLabels[phase || "discovery"]}
    </span>
  );
};

export { PhaseBadge, phaseBadgeVariants };

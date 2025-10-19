import { useState } from "react";
import {
  Play,
  Zap,
  AlertTriangle,
  Shield,
  Smartphone,
  Code,
} from "lucide-react";

interface AttackScenario {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  hoverBgColor: string;
}

interface AttackButtonsProps {
  onAttackSelect?: (attackId: string) => void;
  disabled?: boolean;
}

const attackScenarios: AttackScenario[] = [
  {
    id: "demo",
    label: "Run Full Demo",
    icon: Play,
    color: "text-white",
    bgColor: "bg-gradient-to-r from-status-critical to-red-900",
    hoverBgColor: "hover:from-status-critical hover:to-red-800",
  },
  {
    id: "ddos",
    label: "DDoS Attack",
    icon: Zap,
    color: "text-white",
    bgColor: "bg-status-high",
    hoverBgColor: "hover:bg-orange-600",
  },
  {
    id: "simswap",
    label: "SIM Swap",
    icon: Smartphone,
    color: "text-white",
    bgColor: "bg-blue-600",
    hoverBgColor: "hover:bg-blue-700",
  },
  {
    id: "cred",
    label: "Credential Theft",
    icon: AlertTriangle,
    color: "text-white",
    bgColor: "bg-status-normal",
    hoverBgColor: "hover:bg-amber-600",
  },
  {
    id: "malware",
    label: "Malware",
    icon: Shield,
    color: "text-white",
    bgColor: "bg-purple-600",
    hoverBgColor: "hover:bg-purple-700",
  },
  {
    id: "custom",
    label: "Custom Attack",
    icon: Code,
    color: "text-white",
    bgColor: "bg-slate-600",
    hoverBgColor: "hover:bg-slate-700",
  },
];

export default function AttackButtons({
  onAttackSelect,
  disabled = false,
}: AttackButtonsProps) {
  const [activeAttack, setActiveAttack] = useState<string | null>(null);
  const [executingAttack, setExecutingAttack] = useState<string | null>(null);

  const handleAttackClick = async (attackId: string) => {
    if (disabled) return;

    setActiveAttack(attackId);
    setExecutingAttack(attackId);
    onAttackSelect?.(attackId);

    // Simulate attack execution
    setTimeout(() => {
      setExecutingAttack(null);
    }, 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        ATTACK SCENARIOS - Choose & Execute
      </h2>

      <div className="flex flex-wrap gap-3">
        {attackScenarios.map((attack) => {
          const Icon = attack.icon;
          const isExecuting = executingAttack === attack.id;
          const isActive = activeAttack === attack.id;

          return (
            <button
              key={attack.id}
              onClick={() => handleAttackClick(attack.id)}
              disabled={disabled}
              className={`attack-button gap-2 px-4 py-2 text-sm font-semibold ${attack.bgColor} ${attack.hoverBgColor} ${attack.color} ${
                isExecuting ? "animate-pulse" : ""
              } ${isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" />
              {attack.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
        <p>
          💡 Click any button to simulate an attack scenario and see real-time
          detection.
        </p>
      </div>
    </div>
  );
}

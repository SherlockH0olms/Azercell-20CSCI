import { useEffect, useState } from "react";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

type ThreatLevel = "CRITICAL" | "HIGH" | "NORMAL" | "SAFE";

interface HeaderProps {
  threatLevel?: ThreatLevel;
  onRefresh?: () => void;
}

const getThreatColor = (level: ThreatLevel) => {
  switch (level) {
    case "CRITICAL":
      return "text-status-critical";
    case "HIGH":
      return "text-status-high";
    case "NORMAL":
      return "text-status-normal";
    case "SAFE":
      return "text-status-safe";
    default:
      return "text-status-safe";
  }
};

const getThreatBgColor = (level: ThreatLevel) => {
  switch (level) {
    case "CRITICAL":
      return "bg-status-critical/10 border-status-critical";
    case "HIGH":
      return "bg-status-high/10 border-status-high";
    case "NORMAL":
      return "bg-status-normal/10 border-status-normal";
    case "SAFE":
      return "bg-status-safe/10 border-status-safe";
    default:
      return "bg-status-safe/10 border-status-safe";
  }
};

export default function Header({
  threatLevel = "SAFE",
  onRefresh,
}: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [lastAttack, setLastAttack] = useState<string>("2 minutes ago");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="border-b border-border bg-card">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <AlertCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Azercell CSCI
              </h1>
              <p className="text-xs text-muted-foreground">
                Security Operations Center
              </p>
            </div>
          </div>

          {/* Center: Status and Time */}
          <div className="flex flex-1 items-center justify-center gap-6">
            {/* Threat Level */}
            <div
              className={`status-indicator ${getThreatBgColor(threatLevel)} border`}
            >
              <div
                className={`h-2 w-2 rounded-full ${getThreatColor(threatLevel)} animate-pulse`}
              />
              <span className={getThreatColor(threatLevel)}>{threatLevel}</span>
            </div>

            {/* Network Status */}
            <div className="status-indicator bg-status-safe/10 border border-status-safe">
              <div className="h-2 w-2 rounded-full bg-status-safe" />
              <span className="text-status-safe">Online</span>
            </div>

            {/* Clock */}
            <div className="text-center">
              <div className="font-mono text-lg font-bold text-foreground">
                {time || "00:00:00"}
              </div>
              <div className="text-xs text-muted-foreground">UTC+4</div>
            </div>
          </div>

          {/* Right: Last Attack and Refresh */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Last Attack</p>
              <p className="text-sm font-medium text-foreground">
                {lastAttack}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`attack-button h-10 w-10 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 ${
                isRefreshing ? "animate-spin" : ""
              }`}
              aria-label="Refresh dashboard"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

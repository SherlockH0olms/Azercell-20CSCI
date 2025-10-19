import { useEffect, useState } from 'react';
import {
  Network,
  Shield,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface Metric {
  id: string;
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface MetricsGridProps {
  metrics?: Metric[];
}

const defaultMetrics: Metric[] = [
  {
    id: 'requests',
    label: 'Total Requests',
    value: 1284567,
    icon: Network,
    color: 'text-blue-400',
    trend: { value: 12, isPositive: true },
  },
  {
    id: 'blocked',
    label: 'Blocked Attacks',
    value: 342,
    icon: Shield,
    color: 'text-status-critical',
    trend: { value: 8, isPositive: false },
  },
  {
    id: 'detection',
    label: 'Detection Time (ms)',
    value: 145,
    icon: Clock,
    color: 'text-status-safe',
    trend: { value: 23, isPositive: true },
  },
  {
    id: 'threat',
    label: 'Threat Level',
    value: 62,
    icon: AlertTriangle,
    color: 'text-status-normal',
    trend: { value: 5, isPositive: false },
  },
  {
    id: 'active',
    label: 'Active Threats',
    value: 18,
    icon: Zap,
    color: 'text-status-high',
    trend: { value: 3, isPositive: false },
  },
  {
    id: 'health',
    label: 'System Health',
    value: 98,
    icon: TrendingUp,
    color: 'text-blue-300',
    trend: { value: 2, isPositive: true },
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      current = Math.min(stepValue * stepCount, value);
      setDisplayValue(Math.floor(current));

      if (stepCount >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function MetricsGrid({ metrics = defaultMetrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend?.isPositive ? TrendingUp : TrendingUp;

        return (
          <div
            key={metric.id}
            className="metric-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`rounded-lg bg-primary/10 p-3 ${metric.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              {metric.trend && (
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    metric.trend.isPositive
                      ? 'text-status-safe'
                      : 'text-status-critical'
                  }`}
                >
                  <TrendIcon className="h-4 w-4" />
                  <span>{metric.trend.value}%</span>
                </div>
              )}
            </div>

            <div className="mb-2">
              <div className="text-3xl font-bold text-foreground mb-1">
                <AnimatedNumber value={metric.value} />
              </div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

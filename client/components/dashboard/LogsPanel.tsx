import { useEffect, useRef, useState } from 'react';
import { AlertCircle, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

type LogSeverity = 'BLOCKED' | 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';

interface LogEntry {
  id: string;
  timestamp: string;
  type: string;
  severity: LogSeverity;
  details: string;
  additionalInfo?: string;
}

interface LogsPanelProps {
  logs?: LogEntry[];
  maxVisible?: number;
}

const severityConfig: Record<LogSeverity, { color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  BLOCKED: {
    color: 'border-status-critical',
    bgColor: 'bg-status-critical/5',
    icon: XCircle,
  },
  CRITICAL: {
    color: 'border-status-high',
    bgColor: 'bg-status-high/5',
    icon: AlertCircle,
  },
  WARNING: {
    color: 'border-status-normal',
    bgColor: 'bg-status-normal/5',
    icon: AlertTriangle,
  },
  INFO: {
    color: 'border-blue-500',
    bgColor: 'bg-blue-500/5',
    icon: Info,
  },
  SUCCESS: {
    color: 'border-status-safe',
    bgColor: 'bg-status-safe/5',
    icon: CheckCircle,
  },
};

function generateMockLogs(): LogEntry[] {
  const types = [
    'SQL Injection Attempt',
    'XSS Attack Detected',
    'DDoS Wave Incoming',
    'Credential Stuffing',
    'Malware Signature Match',
    'Suspicious Login',
    'Rate Limit Exceeded',
    'Invalid SSL Certificate',
    'Bot Traffic Detected',
    'Brute Force Attempt',
  ];

  const severities: LogSeverity[] = ['BLOCKED', 'CRITICAL', 'WARNING', 'INFO', 'SUCCESS'];

  const logs: LogEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 20; i++) {
    const time = new Date(now.getTime() - i * 3000);
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    logs.push({
      id: `log-${i}`,
      timestamp: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      type,
      severity,
      details: `Request from IP 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} - ${type.toLowerCase()}`,
      additionalInfo: `Action: ${severity === 'BLOCKED' ? 'Blocked & Logged' : 'Monitored'}`,
    });
  }

  return logs;
}

export default function LogsPanel({ logs: initialLogs, maxVisible = 20 }: LogsPanelProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs || generateMockLogs());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = [
        'SQL Injection Attempt',
        'XSS Attack Detected',
        'DDoS Wave Incoming',
        'Credential Stuffing',
        'Malware Signature Match',
        'Suspicious Login',
        'Rate Limit Exceeded',
        'Invalid SSL Certificate',
        'Bot Traffic Detected',
        'Brute Force Attempt',
      ];

      const severities: LogSeverity[] = ['BLOCKED', 'CRITICAL', 'WARNING', 'INFO', 'SUCCESS'];
      const type = types[Math.floor(Math.random() * types.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const now = new Date();

      const newLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
        type,
        severity,
        details: `Request from IP 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)} - ${type.toLowerCase()}`,
        additionalInfo: `Action: ${severity === 'BLOCKED' ? 'Blocked & Logged' : 'Monitored'}`,
      };

      setLogs((prevLogs) => {
        const updated = [newLog, ...prevLogs];
        return updated.slice(0, maxVisible);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [maxVisible]);

  return (
    <div className="rounded-lg border border-border bg-card p-6 flex flex-col h-full">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        REAL-TIME SECURITY LOGS ({logs.length} visible)
      </h2>

      {/* Logs Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-2 pr-2 min-h-0"
      >
        {logs.map((log) => {
          const config = severityConfig[log.severity];
          const Icon = config.icon;

          return (
            <div
              key={log.id}
              className={`log-entry ${config.color} ${config.bgColor} group`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-foreground" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>[{log.timestamp}]</span>
                    <span className="font-semibold text-foreground">{log.severity}</span>
                  </div>

                  <p className="mt-1 text-sm text-foreground truncate">
                    {log.type}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground truncate">
                    {log.details}
                  </p>

                  {log.additionalInfo && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {log.additionalInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {logs.length === 0 && (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <p>No security logs yet. Waiting for threats...</p>
        </div>
      )}
    </div>
  );
}

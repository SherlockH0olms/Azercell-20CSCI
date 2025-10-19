import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface TimelineEvent {
  timestamp: string;
  type: 'success' | 'blocked';
}

interface NetworkTimelineProps {
  events?: TimelineEvent[];
}

function generateMockEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    const type = Math.random() > 0.85 ? 'blocked' : 'success';

    events.push({
      timestamp: time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      type,
    });
  }

  return events;
}

export default function NetworkTimeline({ events: initialEvents }: NetworkTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents || generateMockEvents());
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prevEvents) => {
        const newEvents = [...prevEvents];
        const type = Math.random() > 0.85 ? 'blocked' : 'success';

        newEvents.shift(); // Remove oldest
        newEvents.push({
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }),
          type,
        });

        return newEvents;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const blockedCount = events.filter((e) => e.type === 'blocked').length;
  const successCount = events.length - blockedCount;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            NETWORK ACTIVITY - Last 30 seconds
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Green blocks = Normal traffic | Red blocks = Attack (Blocked)
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-status-safe" />
            <span className="text-muted-foreground">Success: {successCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-status-critical" />
            <span className="text-muted-foreground">Blocked: {blockedCount}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Timeline Blocks */}
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-background/50 p-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="group relative flex-shrink-0"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className={`h-8 w-6 rounded-sm transition-all duration-200 ${
                  event.type === 'success'
                    ? 'bg-status-safe hover:bg-status-safe/80'
                    : 'bg-status-critical hover:bg-status-critical/80'
                }`}
              />

              {/* Tooltip */}
              {hoveredIndex === index && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background font-medium z-10">
                  {event.timestamp}
                  <br />
                  {event.type === 'success' ? 'Normal Traffic' : 'Attack Blocked'}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline Labels */}
        <div className="flex justify-between text-xs text-muted-foreground font-mono">
          <span>{events[0]?.timestamp || '00:00:00'}</span>
          <span>Rolling timeline (newest on right)</span>
          <span>{events[events.length - 1]?.timestamp || '00:00:00'}</span>
        </div>
      </div>
    </div>
  );
}

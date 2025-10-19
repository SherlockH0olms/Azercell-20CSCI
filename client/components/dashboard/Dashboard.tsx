import { useState, useCallback } from "react";
import Header from "./Header";
import MetricsGrid from "./MetricsGrid";
import AttackButtons from "./AttackButtons";
import NetworkTimeline from "./NetworkTimeline";
import LogsPanel from "./LogsPanel";
import Charts from "./Charts";

type ThreatLevel = "CRITICAL" | "HIGH" | "NORMAL" | "SAFE";

export default function Dashboard() {
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("NORMAL");

  const handleAttackSelect = useCallback((attackId: string) => {
    // Simulate threat level changes based on attack
    const threatMap: Record<string, ThreatLevel> = {
      demo: "CRITICAL",
      ddos: "HIGH",
      simswap: "HIGH",
      cred: "NORMAL",
      malware: "CRITICAL",
      custom: "NORMAL",
    };

    setThreatLevel(threatMap[attackId] || "NORMAL");

    // Reset after 5 seconds
    setTimeout(() => {
      setThreatLevel("NORMAL");
    }, 5000);
  }, []);

  const handleRefresh = useCallback(() => {
    // Trigger dashboard refresh
    console.log("Dashboard refreshed");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header threatLevel={threatLevel} onRefresh={handleRefresh} />

      {/* Main Content */}
      <div className="flex flex-col gap-6 p-6">
        {/* Metrics Grid */}
        <section>
          <MetricsGrid />
        </section>

        {/* Attack Buttons */}
        <section>
          <AttackButtons onAttackSelect={handleAttackSelect} />
        </section>

        {/* Network Timeline */}
        <section>
          <NetworkTimeline />
        </section>

        {/* Three Column Layout: Charts and Logs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Charts */}
          <div className="lg:col-span-2">
            <Charts />
          </div>

          {/* Right: Logs Panel */}
          <div className="lg:col-span-1">
            <LogsPanel maxVisible={15} />
          </div>
        </div>
      </div>
    </div>
  );
}

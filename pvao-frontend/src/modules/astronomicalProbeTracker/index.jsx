import React, { useState, useEffect } from "react";
import { ProbeTrackerHeader } from "./ProbeTrackerHeader";
import { ProbeTelemetryCard } from "./ProbeTelemetryCard";
import { OrbitCanvas } from "./OrbitCanvas";
import { ProbeKpiHeader } from "./ProbeKpiHeader";
import { ProbeGroundTrack } from "./ProbeGroundTrack";
import { ProbeTimeControl } from "./ProbeTimeControl";
import { ProbeScientificTable } from "./ProbeScientificTable";
import { getProbesByTarget, getLiveTelemetry } from "./probeApi";
import styles from './astronomicalProbeTracker.module.css';

export default function AstronomicalProbeTracker() {
  const [target, setTarget] = useState("earth");
  const [probes, setProbes] = useState([]);
  const [telemetryMap, setTelemetryMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedProbe, setSelectedProbe] = useState(null);
  const [hoveredProbe, setHoveredProbe] = useState(null);
  const [isLive, setIsLive] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [lastSync, setLastSync] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProbesByTarget(target).then(async (data) => {
      const probeList = data?.probes || [];
      if (!isMounted) return;

      setProbes(probeList);
      setSelectedProbe(null); // Clear previous target probe state

      const results = {};
      await Promise.all(
        probeList.map(async (p) => {
          try {
            const liveData = await getLiveTelemetry(target, p.id);
            results[p.id] = liveData;
          } catch (e) {
            console.warn(`Live telemetry pending for ${p.id}`, e);
          }
        })
      );

      if (isMounted) {
        setTelemetryMap(results);
        setLastSync(new Date().toLocaleTimeString());

        // Automatically set telemetry to the first active probe of the target
        if (probeList.length > 0 && results[probeList[0].id]) {
          setSelectedProbe(results[probeList[0].id]);
        }
      }
    });

    return () => { isMounted = false; };
  }, [target]);

  const handleSelectProbe = async (probe) => {
    try {
      const freshData = await getLiveTelemetry(target, probe.id);
      setSelectedProbe(freshData);
      setTelemetryMap((prev) => ({ ...prev, [probe.id]: freshData }));
    } catch (err) {
      setSelectedProbe(telemetryMap[probe.id] || probe);
    }
    setSearch("");
  };

  const activeData = selectedProbe || hoveredProbe;
  const filteredProbes = probes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.aptModuleLayout}>
      <ProbeTrackerHeader
        activeBody={target}
        setActiveBody={setTarget}
        searchQuery={search}
        setSearchQuery={setSearch}
      />

      <ProbeKpiHeader
        activeCount={filteredProbes.length}
        targetBody={target}
        lastUpdated={lastSync}
      />

      <ProbeScientificTable telemetry={activeData} />

      <div className={styles.aptViewport}>
        <OrbitCanvas
          target={target}
          allProbes={probes}
          filteredProbes={filteredProbes}
          telemetryMap={telemetryMap}
          onSelectProbe={handleSelectProbe}
          onHoverProbe={setHoveredProbe}
          selectedProbe={selectedProbe}
          timeMultiplier={speed}
          isLive={isLive}
        />

        <ProbeTimeControl
          isLive={isLive}
          timeMultiplier={speed}
          onToggleLive={() => setIsLive(!isLive)}
          onSpeedChange={setSpeed}
        />

        <ProbeGroundTrack telemetry={activeData} />

        <ProbeTelemetryCard
          telemetry={selectedProbe}
          hoveredProbe={hoveredProbe}
          onClose={() => setSelectedProbe(null)}
        />
      </div>
    </div>
  );
}
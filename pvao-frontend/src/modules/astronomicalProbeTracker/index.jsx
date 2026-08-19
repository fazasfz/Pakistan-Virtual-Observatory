/**
 * Root entry point for the Astronomical Probe Tracker module.
 * Manages global state for target selection, active probes, and live telemetry.
 * Composes the header, 3D orbit canvas, and telemetry cards.
 */
import React, { useState, useEffect } from "react";
import { ProbeTrackerHeader } from "./ProbeTrackerHeader";
import { ProbeTelemetryCard } from "./ProbeTelemetryCard";
import { OrbitCanvas } from "./OrbitCanvas";
import { getProbesByTarget, getLiveTelemetry } from "./probeApi";
import "./astronomicalProbeTracker.css";

export default function AstronomicalProbeTracker() {
  const [target, setTarget] = useState("earth");
  const [probes, setProbes] = useState([]);
  const [telemetryMap, setTelemetryMap] = useState({});
  const [search, setSearch] = useState("");
  const [selectedProbe, setSelectedProbe] = useState(null);
  const [hoveredProbe, setHoveredProbe] = useState(null);

  const bodyAnimations = {
    earth: "/assets/animations/earth.gif",
    moon: "/assets/animations/moon.gif",
    mars: "/assets/animations/mars.gif",
    sun: "/assets/animations/sun.gif",
  };

  useEffect(() => {
    let isMounted = true;
    getProbesByTarget(target).then(async (data) => {
      const probeList = data.probes || [];
      if (!isMounted) return;
      setProbes(probeList);
      setSelectedProbe(null);

      // Concurrently fetch telemetry for all probes
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
      }
    });

    return () => {
      isMounted = false;
    };
  }, [target]);

  const handleSelectProbe = async (probe) => {
    // Immediate response from cache or direct fresh fetch
    try {
      const freshData = await getLiveTelemetry(target, probe.id);
      setSelectedProbe(freshData);
      setTelemetryMap((prev) => ({ ...prev, [probe.id]: freshData }));
    } catch (err) {
      setSelectedProbe(telemetryMap[probe.id] || probe);
    }
    setSearch("");
  };

  const filteredProbes = probes.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="apt-module-layout">
      <ProbeTrackerHeader
        currentTarget={target}
        onSelectTarget={setTarget}
        searchQuery={search}
        onSearchChange={setSearch}
        searchResults={filteredProbes}
        onSelectSearchResult={handleSelectProbe}
      />

      <div className="apt-viewport">
        <OrbitCanvas
          target={target}
          probes={probes}
          telemetryMap={telemetryMap}
          onSelectProbe={handleSelectProbe}
          onHoverProbe={setHoveredProbe}
          selectedProbe={selectedProbe}
          bodyAnimationSrc={bodyAnimations[target]}
        />

        <ProbeTelemetryCard
          telemetry={selectedProbe}
          hoveredProbe={hoveredProbe}
          onClose={() => setSelectedProbe(null)}
        />
      </div>
    </div>
  );
}
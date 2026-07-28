import React, { useRef, useMemo } from 'react';
import type { NightSkyObject } from './ObjectCard';
import { useFrame } from '@react-three/fiber';
import { Html, Line, Ring } from '@react-three/drei';
import * as THREE from 'three';

const planetColors: Record<string, string> = {
  Sun: '#ffaa00',
  Mercury: '#a8a8a8',
  Venus: '#e3bb76',
  Earth: '#3b82f6',
  Moon: '#d1d5db',
  Mars: '#ef4444',
  Jupiter: '#f59e0b',
  Saturn: '#fde047',
  Uranus: '#2dd4bf',
  Neptune: '#2563eb',
};

const categoryColors: Record<string, string> = {
  planet: '#38bdf8', 
  moon: '#c084fc', 
  constellation: '#fde047', 
  meteor_shower: '#f97316',
  satellite: '#22c55e',
};

interface ObjectPointProps {
  data: NightSkyObject;
  position: [number, number, number];
  isHovered: boolean;
  isSelected?: boolean;
  onSelect: (data: NightSkyObject) => void;
  onHover: (data: NightSkyObject | null) => void;
}

export const ObjectPoint: React.FC<ObjectPointProps> = ({ data, position, isHovered, isSelected, onSelect, onHover }) => {
  const groupRef = useRef<THREE.Group>(null);
  const reticleRef = useRef<THREE.Group>(null);
  
  const color = planetColors[data.name] || categoryColors[data.category] || '#ffffff';
  
  // Calculate apparent size based on magnitude if available
  const magnitude = data.magnitude ?? 0;
  // Brighter (lower mag) = bigger. Mag 0 = scale 1. Mag -10 = scale 2. Mag 6 = scale 0.4
  const magScale = Math.max(0.3, Math.min(2.5, 1.0 - (magnitude / 10)));
  
  const isVisible = !!data.visible_now;
  const isActive = isHovered || isSelected;
  const baseScale = isActive ? magScale * 1.5 : (isVisible ? magScale * 1.2 : magScale * 0.8);
  const baseOpacity = isActive ? 1.0 : (isVisible ? 0.8 : 0.4);

  const isConstellation = data.category === 'constellation' || data.category === 'meteor_shower';

  // Procedural Constellation Points scaled up for the dome
  const constellationPoints = useMemo(() => {
    if (!isConstellation) return { nodes: [], lines: [] };
    const seed = data.object_id.charCodeAt(0) || 1;
    const numPoints = 4 + (seed % 3);
    const pts = [new THREE.Vector3(0, 0, 0)];
    for(let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 + (seed * 0.1);
      // Scale points out for 50-radius dome so they look like a constellation
      const r = 2.0 + ((seed * i) % 5) * 0.5;
      pts.push(new THREE.Vector3(r * Math.cos(angle), r * Math.sin(angle), (r * Math.cos(angle*2)) * 0.5));
    }
    const linePts = [];
    for(let i = 0; i < pts.length; i++) {
      linePts.push(pts[i]);
      if (i > 0 && i % 2 === 0) {
        linePts.push(pts[0]);
      }
    }
    return { nodes: pts, lines: linePts };
  }, [isConstellation, data.object_id]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Slight pulsating effect for stars/planets
      const pulse = !isConstellation ? Math.sin(time * 3 + position[0]) * 0.1 : 0;
      const scale = baseScale + pulse;
      groupRef.current.scale.set(scale, scale, scale);
    }
    if (reticleRef.current && isActive) {
      reticleRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(data);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(data);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <group ref={groupRef}>
        {isConstellation ? (
          <group>
            <Line points={constellationPoints.lines} color={color} lineWidth={1.5} transparent opacity={baseOpacity * 0.5} />
            {constellationPoints.nodes.map((pt, idx) => (
              <mesh key={idx} position={pt}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={baseOpacity} transparent opacity={baseOpacity} />
              </mesh>
            ))}
          </group>
        ) : (
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={baseOpacity * 1.5}
              transparent
              opacity={baseOpacity}
            />
          </mesh>
        )}
      </group>

      {/* Stellarium-style Reticle */}
      {isActive && (
        <group ref={reticleRef}>
          <Ring args={[1.5, 1.6, 32]} material-color="#e2e8f0" material-transparent material-opacity={0.8} />
          <Line points={[[-2, 0, 0], [-1.2, 0, 0]]} color="#e2e8f0" lineWidth={2} />
          <Line points={[[1.2, 0, 0], [2, 0, 0]]} color="#e2e8f0" lineWidth={2} />
          <Line points={[[0, -2, 0], [0, -1.2, 0]]} color="#e2e8f0" lineWidth={2} />
          <Line points={[[0, 1.2, 0], [0, 2, 0]]} color="#e2e8f0" lineWidth={2} />
        </group>
      )}

      {(isActive || isVisible) && (
        <Html distanceFactor={40}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            color: '#f8fafc',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '14px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            transform: 'translate3d(15px, -50%, 0)',
            border: `1px solid ${color}`,
            boxShadow: `0 0 10px rgba(0,0,0,0.5)`,
            backdropFilter: 'blur(4px)'
          }}>
            <div style={{ fontWeight: 600 }}>{String(data.name)}</div>
            {data.magnitude !== undefined && (
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Mag: {data.magnitude}</div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
};


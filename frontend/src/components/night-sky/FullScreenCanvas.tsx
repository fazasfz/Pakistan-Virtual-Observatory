// src/components/night-sky/FullScreenCanvas.tsx
import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { NightSkyObject } from './ObjectCard';
import { ObjectPoint } from './ObjectPoint';
import './scene.css';

interface FullScreenCanvasProps {
  objects: NightSkyObject[];
  onSelectObject: (obj: NightSkyObject) => void;
  hoveredObj: NightSkyObject | null;
  selectedObj?: NightSkyObject | null;
  onHoverObject: (obj: NightSkyObject | null) => void;
  zoom: number;
  telescopeMode: boolean;
}

// Custom component to handle dynamic FOV zoom
const CameraManager = ({ zoom }: { zoom: number }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      // Base FOV is 60, zoom values > 10 decrease FOV (zoom in)
      const targetFov = Math.max(10, 60 * (10 / Math.max(zoom, 1)));
      camera.fov = targetFov;
      camera.updateProjectionMatrix();
    }
  }, [zoom, camera]);
  return null;
};

const DOME_RADIUS = 50;

const FullScreenCanvas: React.FC<FullScreenCanvasProps> = ({ objects, onSelectObject, hoveredObj, selectedObj, onHoverObject, zoom, telescopeMode }) => {
  const cardinalMarkers = useMemo(() => {
    const markers = [
      { label: 'N', az: 0 },
      { label: 'NE', az: 45 },
      { label: 'E', az: 90 },
      { label: 'SE', az: 135 },
      { label: 'S', az: 180 },
      { label: 'SW', az: 225 },
      { label: 'W', az: 270 },
      { label: 'NW', az: 315 },
    ];
    return markers.map(m => {
      const rad = THREE.MathUtils.degToRad(m.az);
      // Place slightly below the horizon (radius 48) on the ground plane
      const x = 48 * Math.sin(rad);
      const z = -48 * Math.cos(rad);
      return (
        <Text
          key={m.label}
          position={[x, -0.5, z]}
          rotation={[-Math.PI / 2, 0, -rad]}
          fontSize={2}
          color="rgba(56, 189, 248, 0.5)"
          anchorX="center"
          anchorY="middle"
        >
          {m.label}
        </Text>
      );
    });
  }, []);

  return (
    <div className="night-sky-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 0.1], near: 0.1, far: 200 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#03050a"]} />
        <fog attach="fog" args={["#03050a", 30, 100]} />
        <CameraManager zoom={zoom} />
        
        {/* Procedural Stars projected on dome */}
        <Stars radius={45} depth={5} count={5000} factor={4} fade speed={0.2} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />
        
        {/* Ground / Horizon Plane */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[100, 64]} />
          <meshBasicMaterial color="#020306" transparent opacity={0.95} />
        </mesh>
        
        {/* Cardinal Directions */}
        {cardinalMarkers}
        
        {/* Celestial Grid (Alt/Az) */}
        <group position={[0, 0, 0]}>
          <polarGridHelper args={[DOME_RADIUS, 16, 8, 64, 0x1e293b, 0x0f172a]} />
        </group>
        
        <OrbitControls
          enablePan={false}
          enableZoom={false} // We handle zoom via FOV
          autoRotate={!telescopeMode}
          autoRotateSpeed={0.2}
          target={[0, 0, 0]}
          minDistance={0.1}
          maxDistance={0.1}
          maxPolarAngle={Math.PI / 2 + 0.1} // Allow looking slightly below horizon
        />
        
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.15} luminanceSmoothing={0.8} />
        </EffectComposer>
        
        {objects.map((obj) => {
          // If no alt/az is provided, default to somewhat random or fixed positions based on ID
          let alt = obj.alt;
          let az = obj.az;
          
          if (alt === undefined || alt === null || az === undefined || az === null) {
            // Mock Alt/Az for objects without data to still show them somewhere
            const hash = obj.object_id.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
            alt = 10 + (hash % 70); // 10 to 80 degrees
            az = (hash * 13) % 360;
          }
          
          // Map Alt/Az to Cartesian (N = -Z, E = +X)
          const altRad = THREE.MathUtils.degToRad(alt);
          const azRad = THREE.MathUtils.degToRad(az);
          
          const position: [number, number, number] = [
            DOME_RADIUS * Math.cos(altRad) * Math.sin(azRad),
            DOME_RADIUS * Math.sin(altRad),
            -DOME_RADIUS * Math.cos(altRad) * Math.cos(azRad),
          ];
          
          return (
            <ObjectPoint
              key={obj.object_id}
              data={obj}
              position={position}
              isHovered={hoveredObj?.object_id === obj.object_id}
              isSelected={selectedObj?.object_id === obj.object_id}
              onSelect={onSelectObject}
              onHover={onHoverObject}
            />
          );
        })}
      </Canvas>
    </div>
  );
};

export default FullScreenCanvas;

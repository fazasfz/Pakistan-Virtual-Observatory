/**
 * 3D WebGL viewer using React Three Fiber to display a target celestial body and its orbiting probes.
 * Props: target (string).
 */
import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars } from "@react-three/drei";

const MODEL_PATHS = {
    earth: "/models/planet_earth.glb",
    moon: "/models/our_moon.glb",
    mars: "/models/mars.glb",
    sun: "/models/sun.glb",
};

function CelestialBody3D({ target }) {
    const bodyRef = useRef();
    const { scene } = useGLTF(MODEL_PATHS[target] || MODEL_PATHS.earth);

    useFrame(() => {
        if (bodyRef.current) bodyRef.current.rotation.y += 0.001;
    });

    return <primitive ref={bodyRef} object={scene} scale={target === "sun" ? 1.8 : 2.2} />;
}

export const OrbitCanvas = ({
    target = "earth",
    probes = [],
    telemetryMap = {},
    onSelectProbe,
    onHoverProbe,
    selectedProbe,
}) => {
    return (
        <div className="apt-canvas-container">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={target === "sun" ? 2.5 : 1.2} />
                <directionalLight position={[5, 3, 5]} intensity={target === "sun" ? 0.5 : 2.5} />
                <Stars radius={300} depth={60} count={15000} factor={7} fade />
                <Suspense fallback={null}>
                    <CelestialBody3D key={target} target={target} />
                </Suspense>
                <OrbitControls enableZoom={true} enablePan={false} rotateSpeed={0.4} />
            </Canvas>

            <div className="apt-probes-overlay">
                {probes.map((probe, idx) => {
                    const live = telemetryMap[probe.id] || probe;
                    const rawX = Number(live.x ?? 0);
                    const rawY = Number(live.y ?? 0);
                    const rawZ = Number(live.z ?? 0);
                    const realDist = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

                    const angle = realDist > 0 ? Math.atan2(rawY, rawX) : (idx * (360 / Math.max(probes.length, 1))) * (Math.PI / 180);
                    const radius = realDist > 0 ? Math.min(220, Math.max(110, 110 + Math.log10(realDist) * 20)) : 130 + idx * 28;

                    const posX = Math.cos(angle) * radius;
                    const posY = Math.sin(angle) * (radius * 0.5);
                    const isSelected = selectedProbe?.id === probe.id;

                    return (
                        <div
                            key={probe.id}
                            className={`apt-probe-node ${isSelected ? "apt-probe-selected" : ""}`}
                            style={{ "--pos-x": `${posX}px`, "--pos-y": `${posY}px` }}
                            onClick={() => onSelectProbe(probe)}
                            onMouseEnter={() => onHoverProbe?.(live)}
                            onMouseLeave={() => onHoverProbe?.(null)}
                        >
                            <span className="apt-probe-dot" />
                            <span className="apt-probe-tag">{probe.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));
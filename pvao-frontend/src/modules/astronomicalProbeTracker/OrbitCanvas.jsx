import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";
import styles from "./astronomicalProbeTracker.module.css";

const MODEL_PATHS = {
    earth: "/models/planet_earth.glb",
    moon: "/models/our_moon.glb",
    mars: "/models/mars.glb",
    sun: "/models/sun.glb",
};

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));

function StandardizedCelestialBody({ target }) {
    const targetKey = target?.toLowerCase() || "earth";
    const path = MODEL_PATHS[targetKey] || MODEL_PATHS.earth;
    const { scene } = useGLTF(path);
    const modelRef = useRef();

    React.useEffect(() => {
        if (modelRef.current) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = new THREE.Vector3();
            box.getCenter(center);
            scene.position.sub(center);

            const sphere = new THREE.Sphere();
            box.getBoundingSphere(sphere);
            if (sphere.radius > 0) {
                const desiredRadius = 2.8;
                const scaleFactor = desiredRadius / sphere.radius;
                modelRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }
        }
    }, [scene, targetKey]);

    return (
        <group ref={modelRef} position={[0, 0, 0]}>
            <primitive object={scene} />
        </group>
    );
}

function DynamicOrbitRing({ radius }) {
    const points = useMemo(() => {
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            pts.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
        }
        return pts;
    }, [radius]);

    const lineGeometry = useMemo(() => {
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [points]);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color="#38bdf8" opacity={0.25} transparent />
        </line>
    );
}

// Animated wrapper component handling dynamic time multiplier
function AnimatedProbe({
    probe,
    idx,
    live,
    isSelected,
    isHovered,
    onSelectProbe,
    onHoverProbe,
    setHoveredProbeId,
    totalProbes,
    timeMultiplier,
    isLive
}) {
    const groupRef = useRef();
    const rawX = Number(live?.x ?? 0);
    const rawY = Number(live?.y ?? 0);
    const rawZ = Number(live?.z ?? 0);
    const realDist = Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

    const bodyRadius = 2.8;
    const orbitRadius = bodyRadius + 1.2 + (idx * 0.95);

    let initialAngle = (idx / Math.max(totalProbes, 1)) * Math.PI * 2;
    let inclinationRad = ((idx * 25) % 60 - 30) * (Math.PI / 180);

    if (realDist > 0) {
        initialAngle = Math.atan2(rawZ, rawX);
        inclinationRad = Math.atan2(rawY, Math.sqrt(rawX * rawX + rawZ * rawZ));
    }

    const angleRef = useRef(initialAngle);

    // Frame-by-frame position update according to speed multiplier
    useFrame((_, delta) => {
        if (isLive && groupRef.current) {
            const speedFactor = 0.05 * timeMultiplier;
            angleRef.current += delta * speedFactor;

            groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
            groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
        }
    });

    const showLabel = isSelected || isHovered;

    return (
        <group rotation={[inclinationRad, 0, 0]}>
            <DynamicOrbitRing radius={orbitRadius} />
            <group
                ref={groupRef}
                position={[
                    Math.cos(initialAngle) * orbitRadius,
                    0,
                    Math.sin(initialAngle) * orbitRadius
                ]}
            >
                <mesh
                    onClick={() => onSelectProbe(probe)}
                    onPointerOver={() => {
                        setHoveredProbeId(probe.id);
                        onHoverProbe?.(live || probe);
                    }}
                    onPointerOut={() => {
                        setHoveredProbeId(null);
                        onHoverProbe?.(null);
                    }}
                >
                    <sphereGeometry args={[0.12, 16, 16]} />
                    <meshBasicMaterial color={isSelected ? "#f59e0b" : isHovered ? "#60a5fa" : "#38bdf8"} />
                </mesh>

                {showLabel && (
                    <Html
                        center
                        occlude
                        style={{
                            pointerEvents: "auto",
                            transform: "translate3d(14px, -50%, 0)",
                        }}
                    >
                        <div
                            className={`${styles.aptCleanProbeLabel} ${isSelected ? styles.aptCleanProbeSelected : ""}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectProbe(probe);
                            }}
                        >
                            <span className={styles.aptProbeNameText}>{probe.name}</span>
                        </div>
                    </Html>
                )}
            </group>
        </group>
    );
}

export const OrbitCanvas = ({
    target = "earth",
    allProbes = [],
    filteredProbes = [],
    telemetryMap = {},
    onSelectProbe,
    onHoverProbe,
    selectedProbe,
    timeMultiplier = 1,
    isLive = true
}) => {
    const [hoveredProbeId, setHoveredProbeId] = useState(null);

    return (
        <div className={styles.aptCanvasContainer}>
            <Canvas
                camera={{ position: [0, 10, 16], fov: 45 }}
                gl={{ preserveDrawingBuffer: true, powerPreference: "high-performance" }}
            >
                <ambientLight intensity={target?.toLowerCase() === "sun" ? 3.0 : 1.6} />
                <directionalLight position={[6, 4, 6]} intensity={2.2} />
                <directionalLight position={[-6, -4, -6]} intensity={0.8} />

                <Stars radius={300} depth={60} count={12000} factor={6} saturation={0} fade speed={1} />

                <React.Suspense fallback={null}>
                    <StandardizedCelestialBody key={target} target={target} />
                </React.Suspense>

                {allProbes.map((probe, idx) => {
                    const isVisible = filteredProbes.some((p) => p.id === probe.id);
                    if (!isVisible) return null;

                    const live = telemetryMap[probe.id] || probe;
                    const isSelected = selectedProbe?.id === probe.id;
                    const isHovered = hoveredProbeId === probe.id;

                    return (
                        <AnimatedProbe
                            key={probe.id}
                            probe={probe}
                            idx={idx}
                            live={live}
                            isSelected={isSelected}
                            isHovered={isHovered}
                            onSelectProbe={onSelectProbe}
                            onHoverProbe={onHoverProbe}
                            setHoveredProbeId={setHoveredProbeId}
                            totalProbes={allProbes.length}
                            timeMultiplier={timeMultiplier}
                            isLive={isLive}
                        />
                    );
                })}

                <OrbitControls enableZoom={true} enablePan={false} rotateSpeed={0.5} maxDistance={32} minDistance={5} />
            </Canvas>
        </div>
    );
};

export default OrbitCanvas;
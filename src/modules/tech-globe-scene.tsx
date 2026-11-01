"use client";

import { Billboard, Line, OrbitControls, Text, useProgress } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import type { Group, PerspectiveCamera as ThreePerspectiveCamera } from "three";
import {
  TECH_GLOBE_EDGES,
  TECH_GLOBE_NODES,
  techGlobeNodeMap,
  type TechGlobeNode,
} from "@/data/tech-globe";

const INK = "#242823";
const MUTED = "#646B60";
const ACTION = "#BB4B2C";
const PAPER = "#F7F5F0";

/** Closest / farthest camera distance (larger distance = smaller on-screen graph). */
const ORBIT_MIN_DISTANCE = 1.7;
const ORBIT_MAX_DISTANCE = 3.8;

/** Camera start — same view direction as before, parked at max zoom-out. */
const INITIAL_CAMERA_POSITION: [number, number, number] = [1.691, 1.126, 3.228];
const CONTROLS_TARGET: [number, number, number] = [0, 0.05, 0];

type SceneProps = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  reduceMotion: boolean;
  interactive: boolean;
  onReady: () => void;
};

function NetworkEdges({ selectedId }: { selectedId: string | null }) {
  const nodes = useMemo(() => techGlobeNodeMap(), []);

  return (
    <>
      {TECH_GLOBE_EDGES.map((edge) => {
        const from = nodes.get(edge.from);
        const to = nodes.get(edge.to);
        if (!from || !to) return null;
        const active =
          selectedId !== null &&
          (edge.from === selectedId || edge.to === selectedId);
        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            points={[from.position, to.position]}
            color={active ? ACTION : MUTED}
            lineWidth={active ? 1.8 : 1.1}
            transparent
            opacity={active ? 0.9 : 0.38}
          />
        );
      })}
    </>
  );
}

function TechNodeMarker({
  node,
  selected,
  onSelect,
  reduceMotion,
  interactive,
}: {
  node: TechGlobeNode;
  selected: boolean;
  onSelect: (id: string) => void;
  reduceMotion: boolean;
  interactive: boolean;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    const group = groupRef.current;
    if (!group) return;
    const pulse =
      selected && !reduceMotion
        ? 1.08 + Math.sin(clock.elapsedTime * 3) * 0.05
        : selected
          ? 1.08
          : 1;
    group.scale.setScalar(pulse);
  });

  return (
    <group ref={groupRef} position={node.position}>
      <mesh
        onClick={
          interactive
            ? (event: ThreeEvent<MouseEvent>) => {
                event.stopPropagation();
                onSelect(node.id);
              }
            : undefined
        }
      >
        <sphereGeometry args={[selected ? 0.048 : 0.036, 18, 18]} />
        <meshStandardMaterial
          color={selected ? ACTION : INK}
          emissive={selected ? ACTION : "#000000"}
          emissiveIntensity={selected ? 0.22 : 0}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>
      <Billboard position={[0, 0.1, 0]}>
        <Text
          fontSize={0.095}
          letterSpacing={0.02}
          color={selected ? ACTION : INK}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.012}
          outlineColor={PAPER}
          maxWidth={1.4}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  );
}

function SceneReadySignal({ onReady }: { onReady: () => void }) {
  const { active } = useProgress();
  const frames = useRef(0);
  const signaled = useRef(false);

  useFrame(() => {
    if (signaled.current) return;
    if (active) {
      frames.current = 0;
      return;
    }
    frames.current += 1;
    // Wait a few settled frames after assets/fonts finish so the first paint is stable.
    if (frames.current < 4) return;
    signaled.current = true;
    onReady();
  });

  return null;
}

function SceneContent({
  selectedId,
  onSelect,
  reduceMotion,
  interactive,
  onReady,
}: SceneProps) {
  return (
    <>
      <color attach="background" args={[PAPER]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[4, 5, 3]} intensity={1.05} color="#fff8f0" />
      <directionalLight
        position={[-3, -1, -4]}
        intensity={0.28}
        color="#dfe4d6"
      />
      <group scale={1.75}>
        <NetworkEdges selectedId={selectedId} />
        {TECH_GLOBE_NODES.map((node) => (
          <TechNodeMarker
            key={node.id}
            node={node}
            selected={node.id === selectedId}
            onSelect={onSelect}
            reduceMotion={reduceMotion}
            interactive={interactive}
          />
        ))}
      </group>
      <OrbitControls
        enabled={interactive}
        enablePan={false}
        enableZoom={interactive}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
        autoRotate={interactive && !reduceMotion}
        autoRotateSpeed={0.35}
        rotateSpeed={0.7}
        target={CONTROLS_TARGET}
        makeDefault
      />
      <SceneReadySignal onReady={onReady} />
    </>
  );
}

export default function TechGlobeScene({
  selectedId,
  onSelect,
  reduceMotion,
  interactive,
  onReady,
}: SceneProps) {
  return (
    <Canvas
      className={`h-full w-full ${interactive ? "touch-none" : "pointer-events-none touch-none"}`}
      dpr={[1, 1.5]}
      camera={{
        position: INITIAL_CAMERA_POSITION,
        fov: 46,
        near: 0.1,
        far: 40,
      }}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      onCreated={({ camera, gl }) => {
        (camera as ThreePerspectiveCamera).lookAt(...CONTROLS_TARGET);
        gl.setClearColor(PAPER, 1);
      }}
      onPointerMissed={
        interactive
          ? () => {
              onSelect(null);
            }
          : undefined
      }
    >
      <Suspense fallback={null}>
        <SceneContent
          selectedId={selectedId}
          onSelect={onSelect}
          reduceMotion={reduceMotion}
          interactive={interactive}
          onReady={onReady}
        />
      </Suspense>
    </Canvas>
  );
}

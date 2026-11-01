"use client";

import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
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

type SceneProps = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  reduceMotion: boolean;
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
}: {
  node: TechGlobeNode;
  selected: boolean;
  onSelect: (id: string) => void;
  reduceMotion: boolean;
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
        onClick={(event: ThreeEvent<MouseEvent>) => {
          event.stopPropagation();
          onSelect(node.id);
        }}
        onPointerOver={(event: ThreeEvent<PointerEvent>) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[selected ? 0.078 : 0.06, 20, 20]} />
        <meshStandardMaterial
          color={selected ? ACTION : INK}
          emissive={selected ? ACTION : "#000000"}
          emissiveIntensity={selected ? 0.22 : 0}
          roughness={0.42}
          metalness={0.12}
        />
      </mesh>
      <Billboard position={[0, 0.14, 0]}>
        <Text
          fontSize={0.11}
          letterSpacing={0.02}
          color={selected ? ACTION : INK}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.014}
          outlineColor={PAPER}
          maxWidth={1.4}
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  );
}

function SceneContent({ selectedId, onSelect, reduceMotion }: SceneProps) {
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
          />
        ))}
      </group>
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={1.7}
        maxDistance={3.8}
        autoRotate={!reduceMotion}
        autoRotateSpeed={0.35}
        rotateSpeed={0.7}
        target={[0, 0.05, 0]}
        makeDefault
      />
    </>
  );
}

export default function TechGlobeScene({
  selectedId,
  onSelect,
  reduceMotion,
}: SceneProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="h-full w-full bg-[var(--card)]" aria-hidden />;
  }

  return (
    <Canvas
      className="h-full w-full touch-none"
      dpr={[1, 1.5]}
      camera={{ position: [1.1, 0.75, 2.1], fov: 46, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false, powerPreference: "default" }}
      onCreated={({ camera, gl }) => {
        (camera as ThreePerspectiveCamera).lookAt(0, 0.05, 0);
        gl.setClearColor(PAPER, 1);
      }}
      onPointerMissed={() => onSelect(null)}
    >
      <SceneContent
        selectedId={selectedId}
        onSelect={onSelect}
        reduceMotion={reduceMotion}
      />
    </Canvas>
  );
}

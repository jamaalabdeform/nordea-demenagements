"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { cells, GRID } from "./cargo";

/**
 * Scène WebGL : la caisse du camion se remplit à mesure que l'inventaire
 * grandit. Une seule InstancedMesh (160 caisses max) → un seul draw call.
 * Chargée à la demande (next/dynamic), desktop uniquement.
 */

const CELL = { x: 1, y: 0.62, z: 0.62 };
const GAP = 0.06;
const SIZE = { x: GRID.x * CELL.x, y: GRID.y * CELL.y, z: GRID.z * CELL.z };

function Crates({ filled }: { filled: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const scales = useRef(new Float32Array(cells.length));
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    cells.forEach((c, i) => {
      color.set("#c9a276").multiplyScalar(0.92 + c.tint * 0.12);
      m.setColorAt(i, color);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [color, dummy]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    let dirty = false;
    cells.forEach((c, i) => {
      const target = c.order < filled ? 1 : 0;
      const cur = scales.current[i];
      if (Math.abs(cur - target) < 0.001) return;
      // délai d'apparition en cascade, amorti
      const next = cur + (target - cur) * Math.min(1, delta * (target ? 9 - (c.order % 8) * 0.6 : 14));
      scales.current[i] = Math.abs(next - target) < 0.002 ? target : next;
      const s = scales.current[i];
      dummy.position.set(
        c.x * CELL.x + CELL.x / 2 - SIZE.x / 2,
        c.y * CELL.y + CELL.y / 2 + (1 - s) * 0.5,
        c.z * CELL.z + CELL.z / 2 - SIZE.z / 2,
      );
      dummy.scale.set((CELL.x - GAP) * s, (CELL.y - GAP) * s, (CELL.z - GAP) * s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      dirty = true;
    });
    if (dirty) m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, cells.length]} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial roughness={0.85} metalness={0} />
    </instancedMesh>
  );
}

function Container() {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE.x, SIZE.y, SIZE.z)), []);
  return (
    <group position={[0, SIZE.y / 2, 0]}>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#1d3a31" transparent opacity={0.45} />
      </lineSegments>
      {/* paroi côté cabine */}
      <mesh position={[-SIZE.x / 2 - 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[SIZE.z, SIZE.y]} />
        <meshStandardMaterial color="#d3e0da" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Rig({ filled }: { filled: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = Math.sin(clock.elapsedTime * 0.25) * 0.06;
  });
  return (
    <group ref={group}>
      <Container />
      <Crates filled={filled} />
    </group>
  );
}

export default function CargoScene({ filled }: { filled: number }) {
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [4.5, 6, 11], zoom: 30, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      onCreated={({ camera }) => camera.lookAt(0, 1, 0)}
      aria-hidden
    >
      <ambientLight intensity={1.4} color="#fff6ea" />
      <directionalLight position={[6, 10, 4]} intensity={2.2} color="#fff1dd" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-6, 4, -2]} intensity={0.5} color="#dfe8e4" />
      <Rig filled={filled} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial opacity={0.07} />
      </mesh>
    </Canvas>
  );
}

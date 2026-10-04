'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

function OrbitCore({ animate }: { animate: boolean }) {
  const system = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const wide = viewport.width > 7;

  useFrame((state, delta) => {
    const group = system.current;
    if (!group || !animate) return;
    group.rotation.y += delta * 0.12;
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, state.pointer.y * 0.12, 3, delta);
    group.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
  });

  return (
    <group ref={system} position={[wide ? 1.65 : 0.35, 0.12, 0]} scale={wide ? 1 : 0.68}>
      <mesh>
        <icosahedronGeometry args={[0.78, 2]} />
        <meshStandardMaterial color="#C7A56A" wireframe transparent opacity={0.48} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshPhysicalMaterial color="#A78348" metalness={0.78} roughness={0.28} clearcoat={0.8} transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[Math.PI / 2.7, 0.2, 0.1]}>
        <torusGeometry args={[1.3, 0.012, 8, 160]} />
        <meshBasicMaterial color="#D8C7A1" transparent opacity={0.62} />
      </mesh>
      <mesh rotation={[0.4, Math.PI / 2.5, 0.8]}>
        <torusGeometry args={[1.58, 0.009, 8, 160]} />
        <meshBasicMaterial color="#8FA9A0" transparent opacity={0.7} />
      </mesh>
      {[
        [1.3, 0, 0], [-1.3, 0, 0], [0, 1.3, 0], [0, -1.3, 0],
        [0.9, 0.9, 0.15], [-0.9, 0.9, -0.15], [0.45, -1.2, 0.25],
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[index % 2 ? 0.045 : 0.06, 16, 16]} />
          <meshStandardMaterial color={index % 2 ? '#8FA9A0' : '#E5C98B'} emissive={index % 2 ? '#31413B' : '#5B4524'} emissiveIntensity={0.65} />
        </mesh>
      ))}
      <pointLight position={[0.8, 0.4, 1.7]} color="#D9B56D" intensity={18} distance={5} />
    </group>
  );
}

export default function SkillsCanvas({ animate }: { animate: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.65} />
      <directionalLight position={[2.5, 3, 4]} intensity={1.8} color="#F5F1E8" />
      <OrbitCore animate={animate} />
    </Canvas>
  );
}
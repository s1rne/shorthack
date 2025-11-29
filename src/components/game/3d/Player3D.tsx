'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Player3D() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.8;
      bodyRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 3]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        {/* Тело */}
        <mesh ref={bodyRef} castShadow position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.4, 0.8, 16, 32]} />
          <meshStandardMaterial
            color="#58CC02"
            emissive="#58CC02"
            emissiveIntensity={0.3}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Голова */}
        <mesh castShadow position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color="#FFE082"
            emissive="#FFE082"
            emissiveIntensity={0.1}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>

        {/* Глаза */}
        <mesh position={[-0.12, 1.85, 0.28]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.12, 1.85, 0.28]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>

        {/* Блики в глазах */}
        <mesh position={[-0.1, 1.87, 0.34]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.14, 1.87, 0.34]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
        </mesh>

        {/* Аура */}
        <Sparkles
          count={20}
          scale={[2, 3, 2]}
          size={2}
          speed={0.3}
          opacity={0.5}
          color="#58CC02"
        />

        {/* Свечение под персонажем */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial
            color="#58CC02"
            emissive="#58CC02"
            emissiveIntensity={0.5}
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      {/* Точечный свет от персонажа */}
      <pointLight position={[0, 1.5, 0]} color="#58CC02" intensity={2} distance={5} />
    </group>
  );
}


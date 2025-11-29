'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Ground() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group>
      {/* Основная земля */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#0f0f1a"
          metalness={0.8}
          roughness={0.4}
        />
      </mesh>

      {/* Светящаяся сетка */}
      <gridHelper
        ref={gridRef}
        args={[50, 50, '#667eea', '#1a1a2e']}
        position={[0, 0.01, 0]}
      />

      {/* Центральная платформа */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.5, 0.1, 64]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#667eea"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Внешнее кольцо платформы */}
      <mesh position={[0, 0.06, 0]}>
        <torusGeometry args={[3.2, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#667eea"
          emissive="#667eea"
          emissiveIntensity={1}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Декоративные элементы по углам */}
      {[
        [-8, 0.5, -8],
        [8, 0.5, -8],
        [-8, 0.5, 8],
        [8, 0.5, 8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial
            color={['#58CC02', '#1CB0F6', '#FF9600', '#E74C3C'][i]}
            emissive={['#58CC02', '#1CB0F6', '#FF9600', '#E74C3C'][i]}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}


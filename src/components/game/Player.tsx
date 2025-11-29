'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerProps {
  position: [number, number, number];
}

export function Player({ position }: PlayerProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Легкое покачивание игрока
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Тело игрока */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.8, 1.5, 0.8]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
      
      {/* Голова */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>

      {/* Руки */}
      <mesh position={[-0.6, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
      <mesh position={[0.6, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>
    </group>
  );
}


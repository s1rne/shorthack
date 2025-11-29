'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import * as THREE from 'three';

interface QuestObjectProps {
  questId: number;
  position: [number, number, number];
  onComplete?: (questId: number) => void;
}

export function QuestObject({ questId, position, onComplete }: QuestObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current && !clicked) {
      // Вращение и подпрыгивание объекта
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  const handleClick = () => {
    if (!clicked) {
      setClicked(true);
      // Анимация исчезновения
      if (meshRef.current) {
        const scale = { x: 1, y: 1, z: 1 };
        const animate = () => {
          scale.x *= 0.9;
          scale.y *= 0.9;
          scale.z *= 0.9;
          if (meshRef.current) {
            meshRef.current.scale.set(scale.x, scale.y, scale.z);
            if (scale.x > 0.1) {
              requestAnimationFrame(animate);
            } else {
              onComplete?.(questId);
            }
          }
        };
        animate();
      }
    }
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={hovered ? '#10b981' : '#f59e0b'} 
          emissive={hovered ? '#10b981' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>
      
      {/* Свечение вокруг объекта */}
      {hovered && (
        <mesh>
          <ringGeometry args={[1.2, 1.5, 32]} />
          <meshStandardMaterial 
            color="#10b981" 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}


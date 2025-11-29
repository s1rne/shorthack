'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface MascotProps {
  mood: 'idle' | 'happy' | 'sad';
}

export function MascotCharacter({ mood }: MascotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const capeRef = useRef<THREE.Mesh>(null);
  const crownRef = useRef<THREE.Group>(null);

  // Цвета в стиле X5 + фэнтези
  const primaryColor = mood === 'happy' ? '#00A651' : '#8B0048'; // Зелёный/Пурпурный
  const secondaryColor = '#1a0a2e'; // Тёмно-фиолетовый
  const goldColor = '#FFD700';
  const skinColor = '#F5D0B9';

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;

    // Плавное покачивание
    groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
    
    if (mood === 'happy') {
      groupRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 3) * 0.15;
    } else if (mood === 'sad') {
      groupRef.current.rotation.x = 0.1;
      groupRef.current.position.y = -0.05 + Math.sin(t) * 0.02;
    } else {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.03;
    }

    // Анимация мантии
    if (capeRef.current) {
      capeRef.current.rotation.x = Math.sin(t * 2) * 0.05 + 0.2;
    }

    // Анимация короны
    if (crownRef.current) {
      crownRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={0.55} position={[0, -0.3, 0]}>
      {/* Освещение */}
      <Environment preset="city" />
      
      {/* === ТЕЛО === */}
      <group position={[0, 0, 0]}>
        {/* Торс - основа */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.45, 1.2, 32]} />
          <meshStandardMaterial
            color={secondaryColor}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Грудная пластина */}
        <mesh position={[0, 0.5, 0.2]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.15]} />
          <meshStandardMaterial
            color={primaryColor}
            metalness={0.8}
            roughness={0.2}
            emissive={primaryColor}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Золотой орнамент на груди */}
        <mesh position={[0, 0.55, 0.29]}>
          <torusGeometry args={[0.12, 0.02, 8, 32]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={1}
            roughness={0.1}
            emissive={goldColor}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Пояс */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <torusGeometry args={[0.4, 0.08, 8, 32]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={1}
            roughness={0.15}
          />
        </mesh>

        {/* Пряжка пояса */}
        <mesh position={[0, -0.1, 0.4]}>
          <octahedronGeometry args={[0.1]} />
          <meshStandardMaterial
            color="#9B59B6"
            metalness={0.9}
            roughness={0.1}
            emissive="#9B59B6"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* === ГОЛОВА === */}
      <group position={[0, 1.2, 0]}>
        {/* Основа головы */}
        <mesh castShadow>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={skinColor}
            metalness={0.1}
            roughness={0.8}
          />
        </mesh>

        {/* Волосы */}
        <mesh position={[0, 0.15, -0.05]} castShadow>
          <sphereGeometry args={[0.36, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#2C1810"
            metalness={0.3}
            roughness={0.6}
          />
        </mesh>

        {/* Глаза */}
        <group position={[0, 0.05, 0.28]}>
          {/* Левый глаз */}
          <mesh position={[-0.1, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <mesh position={[-0.08, 0.02, 0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
          </mesh>
          
          {/* Правый глаз */}
          <mesh position={[0.1, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#1a1a2e" />
          </mesh>
          <mesh position={[0.12, 0.02, 0.04]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={1} />
          </mesh>
        </group>

        {/* Брови */}
        <mesh position={[-0.1, 0.15, 0.3]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#2C1810" />
        </mesh>
        <mesh position={[0.1, 0.15, 0.3]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.08, 0.02, 0.02]} />
          <meshStandardMaterial color="#2C1810" />
        </mesh>

        {/* Рот */}
        <mesh position={[0, -0.1, 0.32]} rotation={[0, 0, mood === 'sad' ? Math.PI : 0]}>
          <torusGeometry args={[0.05, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#C0392B" />
        </mesh>
      </group>

      {/* === КОРОНА === */}
      <group ref={crownRef} position={[0, 1.6, 0]}>
        {/* База короны */}
        <mesh>
          <cylinderGeometry args={[0.25, 0.28, 0.15, 32]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Зубцы короны */}
        {[0, 1, 2, 3, 4].map((i) => (
          <group key={i} rotation={[0, (i / 5) * Math.PI * 2, 0]}>
            <mesh position={[0.22, 0.15, 0]}>
              <coneGeometry args={[0.05, 0.2, 4]} />
              <meshStandardMaterial
                color={goldColor}
                metalness={1}
                roughness={0.1}
              />
            </mesh>
            {/* Драгоценный камень */}
            <mesh position={[0.22, 0.08, 0]}>
              <octahedronGeometry args={[0.04]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#E31E24' : '#00A651'}
                metalness={0.9}
                roughness={0.1}
                emissive={i % 2 === 0 ? '#E31E24' : '#00A651'}
                emissiveIntensity={0.8}
              />
            </mesh>
          </group>
        ))}

        {/* Центральный камень короны */}
        <mesh position={[0, 0.25, 0]}>
          <octahedronGeometry args={[0.08]} />
          <meshStandardMaterial
            color="#9B59B6"
            metalness={0.9}
            roughness={0.05}
            emissive="#9B59B6"
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* === МАНТИЯ === */}
      <group position={[0, 0.6, -0.3]}>
        {/* Основа мантии */}
        <mesh ref={capeRef} position={[0, -0.3, -0.2]} rotation={[0.2, 0, 0]} castShadow>
          <coneGeometry args={[0.8, 1.5, 32, 1, true]} />
          <meshStandardMaterial
            color="#4A0E4E"
            metalness={0.4}
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Меховой воротник */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.4, 0.12, 16, 32, Math.PI * 1.5]} />
          <meshStandardMaterial
            color="#F5F5DC"
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>

        {/* Золотая застёжка мантии */}
        <mesh position={[0, 0.3, 0.35]}>
          <cylinderGeometry args={[0.08, 0.08, 0.03, 16]} />
          <meshStandardMaterial
            color={goldColor}
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* === РУКИ === */}
      <group>
        {/* Левая рука */}
        <group position={[-0.55, 0.3, 0]} rotation={[0, 0, 0.3]}>
          {/* Плечо */}
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Предплечье */}
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
            <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Наруч */}
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.15, 16]} />
            <meshStandardMaterial color={goldColor} metalness={1} roughness={0.1} />
          </mesh>
          {/* Кисть */}
          <mesh position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={skinColor} metalness={0.1} roughness={0.8} />
          </mesh>
        </group>

        {/* Правая рука со скипетром */}
        <group position={[0.55, 0.3, 0]} rotation={[0, 0, -0.3]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
            <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.35, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.15, 16]} />
            <meshStandardMaterial color={goldColor} metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[0, -0.55, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={skinColor} metalness={0.1} roughness={0.8} />
          </mesh>

          {/* Скипетр */}
          <group position={[0.1, -0.5, 0.1]} rotation={[0.3, 0, 0.2]}>
            <mesh>
              <cylinderGeometry args={[0.03, 0.04, 0.8, 8]} />
              <meshStandardMaterial color={goldColor} metalness={1} roughness={0.1} />
            </mesh>
            {/* Навершие скипетра */}
            <mesh position={[0, 0.5, 0]}>
              <octahedronGeometry args={[0.1]} />
              <meshStandardMaterial
                color="#00A651"
                metalness={0.9}
                roughness={0.05}
                emissive="#00A651"
                emissiveIntensity={mood === 'happy' ? 1.5 : 0.5}
              />
            </mesh>
          </group>
        </group>
      </group>

      {/* === НОГИ === */}
      <group position={[0, -0.6, 0]}>
        {/* Левая нога */}
        <mesh position={[-0.18, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[-0.18, -0.4, 0.05]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.5} />
        </mesh>

        {/* Правая нога */}
        <mesh position={[0.18, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.5, 8, 16]} />
          <meshStandardMaterial color={secondaryColor} metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0.18, -0.4, 0.05]}>
          <boxGeometry args={[0.15, 0.1, 0.25]} />
          <meshStandardMaterial color="#1a0a2e" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* === ЭФФЕКТЫ === */}
      {mood === 'happy' && (
        <group>
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin((i / 6) * Math.PI * 2) * 0.8,
                1.2 + Math.cos((i / 6) * Math.PI * 2) * 0.3,
                Math.cos((i / 6) * Math.PI * 2) * 0.3,
              ]}
            >
              <octahedronGeometry args={[0.05]} />
              <meshStandardMaterial
                color="#FFD700"
                emissive="#FFD700"
                emissiveIntensity={2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Аура */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Подсветка снизу */}
      <pointLight position={[0, -1, 1]} color={primaryColor} intensity={2} distance={3} />
      <pointLight position={[0, 2, 1]} color={goldColor} intensity={1} distance={3} />
    </group>
  );
}

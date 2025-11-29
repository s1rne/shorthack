'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { QuestObject } from './QuestObject';
import { Player } from './Player';

interface GameSceneProps {
  currentQuest?: number;
  onQuestComplete?: (questId: number) => void;
}

export function GameScene({ currentQuest, onQuestComplete }: GameSceneProps) {
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          <Environment preset="sunset" />
          
          {/* Пол */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#4a5568" />
          </mesh>

          {/* Игрок */}
          <Player position={[0, 1, 0]} />

          {/* Объекты квестов */}
          {currentQuest !== undefined && (
            <QuestObject 
              questId={currentQuest} 
              position={[3, 1, 3]}
              onComplete={onQuestComplete}
            />
          )}

          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}


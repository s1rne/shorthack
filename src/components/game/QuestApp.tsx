'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Float, ContactShadows, Environment } from '@react-three/drei';
import { MascotCharacter } from './MascotCharacter';
import { LevelPath } from './LevelPath';
import { QuestionCard } from './QuestionCard';

export interface Quest {
  id: number;
  title: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  xp: number;
  icon: string;
  completed: boolean;
  locked: boolean;
}

const initialQuests: Quest[] = [
  {
    id: 1,
    title: 'API',
    question: 'Что такое API?',
    answers: ['Интерфейс программирования', 'База данных', 'Язык программирования', 'Веб-сервер'],
    correctAnswer: 0,
    xp: 10,
    icon: '🎯',
    completed: false,
    locked: false,
  },
  {
    id: 2,
    title: 'HTTP',
    question: 'Метод для получения данных?',
    answers: ['POST', 'GET', 'PUT', 'DELETE'],
    correctAnswer: 1,
    xp: 15,
    icon: '🌐',
    completed: false,
    locked: true,
  },
  {
    id: 3,
    title: 'REST',
    question: 'Что означает REST?',
    answers: ['Remote Server', 'Representational State Transfer', 'Real-time System', 'Resource State'],
    correctAnswer: 1,
    xp: 20,
    icon: '⚡',
    completed: false,
    locked: true,
  },
  {
    id: 4,
    title: 'JSON',
    question: 'JSON это?',
    answers: ['Java Object', 'JavaScript Object Notation', 'Java System', 'Just Object'],
    correctAnswer: 1,
    xp: 15,
    icon: '📦',
    completed: false,
    locked: true,
  },
  {
    id: 5,
    title: 'NoSQL',
    question: 'MongoDB — это?',
    answers: ['SQL БД', 'NoSQL БД', 'Графовая БД', 'Кэш'],
    correctAnswer: 1,
    xp: 25,
    icon: '💾',
    completed: false,
    locked: true,
  },
  {
    id: 6,
    title: 'JWT',
    question: 'JWT используется для?',
    answers: ['Стилей', 'Аутентификации', 'Анимации', 'Кэша'],
    correctAnswer: 1,
    xp: 30,
    icon: '🏆',
    completed: false,
    locked: true,
  },
];

export function QuestApp() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(5);
  const [mood, setMood] = useState<'idle' | 'happy' | 'sad'>('idle');
  const [showResult, setShowResult] = useState<'success' | 'error' | null>(null);

  const completedCount = quests.filter((q) => q.completed).length;

  const handleSelect = (quest: Quest) => {
    if (!quest.locked && !quest.completed) {
      setActiveQuest(quest);
    }
  };

  const handleAnswer = (index: number) => {
    if (!activeQuest) return;
    const correct = index === activeQuest.correctAnswer;

    if (correct) {
      setMood('happy');
      setShowResult('success');
      setQuests((prev) =>
        prev.map((q) => ({
          ...q,
          completed: q.id === activeQuest.id ? true : q.completed,
          locked: q.id === activeQuest.id + 1 ? false : q.locked,
        }))
      );
      setXP((prev) => prev + activeQuest.xp);
      setTimeout(() => {
        setShowResult(null);
        setActiveQuest(null);
        setMood('idle');
      }, 1500);
    } else {
      setMood('sad');
      setShowResult('error');
      setHearts((h) => Math.max(0, h - 1));
      setTimeout(() => {
        setShowResult(null);
        setMood('idle');
      }, 1200);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'linear-gradient(180deg, #0D0D1A 0%, #1a0a2e 50%, #0D0D1A 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.3)',
          borderBottom: '1px solid rgba(255,215,0,0.2)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: '800',
              color: '#FFD700',
              border: '2px solid #FFD700',
              boxShadow: '0 0 15px rgba(155, 89, 182, 0.5)',
            }}
          >
            {level}
          </div>
          <div
            style={{
              width: '80px',
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid rgba(255,215,0,0.3)',
            }}
          >
            <div
              style={{
                width: `${(xp % 100)}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #9B59B6, #00A651)',
                borderRadius: '3px',
              }}
            />
          </div>
        </div>

        <div
          style={{
            fontSize: '16px',
            fontWeight: '800',
            color: '#FFD700',
            textShadow: '0 0 10px rgba(255,215,0,0.5)',
            letterSpacing: '2px',
          }}
        >
          X5 QUEST
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                background: i < hearts 
                  ? 'linear-gradient(135deg, #E31E24, #C41A1F)' 
                  : 'rgba(255,255,255,0.1)',
                boxShadow: i < hearts ? '0 0 8px rgba(227, 30, 36, 0.5)' : 'none',
              }}
            />
          ))}
        </div>
      </header>

      {/* 3D Character */}
      <div
        style={{
          height: '200px',
          flexShrink: 0,
          position: 'relative',
          background: 'radial-gradient(ellipse at center bottom, rgba(155,89,182,0.2) 0%, transparent 70%)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          shadows
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <pointLight position={[-3, 2, 2]} intensity={0.5} color="#9B59B6" />
            <pointLight position={[3, 2, 2]} intensity={0.5} color="#00A651" />
            
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
              <MascotCharacter mood={mood} />
            </Float>

            <ContactShadows
              position={[0, -1.2, 0]}
              opacity={0.4}
              scale={3}
              blur={2}
              far={2}
            />
          </Suspense>
        </Canvas>
        
        {/* Speech bubble */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(26,10,46,0.95), rgba(13,13,26,0.95))',
            padding: '10px 20px',
            borderRadius: '20px',
            border: '1px solid rgba(255,215,0,0.3)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}
        >
          <p style={{ margin: 0, color: '#FFD700', fontSize: '14px', fontWeight: '600' }}>
            {mood === 'idle' && '⚔️ Выбери своё испытание, герой!'}
            {mood === 'happy' && '🏆 Великолепно! Ты достоин короны!'}
            {mood === 'sad' && '💪 Не сдавайся, воин!'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {activeQuest ? (
          <QuestionCard
            quest={activeQuest}
            onAnswer={handleAnswer}
            onClose={() => { setActiveQuest(null); setMood('idle'); }}
            showResult={showResult}
          />
        ) : (
          <LevelPath
            quests={quests}
            onSelect={handleSelect}
            completedCount={completedCount}
          />
        )}
      </main>
    </div>
  );
}

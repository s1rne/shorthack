'use client';

import { useState, useEffect } from 'react';
import { Character } from './Character';
import { InteractiveQuest } from './InteractiveQuest';
import { QuestDialog } from './QuestDialog';
import { ProgressBar } from './ProgressBar';

export interface Quest {
  id: number;
  title: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  xp: number;
  position: { x: number; y: number };
  completed: boolean;
  icon: string;
  color: string;
}

const initialQuests: Quest[] = [
  {
    id: 1,
    title: 'Основы API',
    question: 'Что такое API?',
    answers: ['Интерфейс программирования приложений', 'База данных', 'Язык программирования', 'Фреймворк'],
    correctAnswer: 0,
    xp: 10,
    position: { x: 15, y: 35 },
    completed: false,
    icon: '📡',
    color: '#58CC02',
  },
  {
    id: 2,
    title: 'HTTP методы',
    question: 'Какой метод HTTP используется для получения данных?',
    answers: ['POST', 'GET', 'PUT', 'DELETE'],
    correctAnswer: 1,
    xp: 15,
    position: { x: 50, y: 25 },
    completed: false,
    icon: '🌐',
    color: '#1CB0F6',
  },
  {
    id: 3,
    title: 'REST API',
    question: 'Что означает REST?',
    answers: ['Remote Server Technology', 'Representational State Transfer', 'Real-time System Transfer', 'Resource State Technology'],
    correctAnswer: 1,
    xp: 20,
    position: { x: 85, y: 40 },
    completed: false,
    icon: '⚡',
    color: '#FF9600',
  },
];

export function GameScene2D() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [currentXP, setCurrentXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [hearts, setHearts] = useState(5);

  const levelXP = level * 100;

  const handleQuestClick = (quest: Quest) => {
    if (!quest.completed) {
      setActiveQuest(quest);
    }
  };

  const handleAnswer = (questId: number, answerIndex: number) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const isCorrect = answerIndex === quest.correctAnswer;

    if (isCorrect) {
      setQuests((prev) =>
        prev.map((q) => (q.id === questId ? { ...q, completed: true } : q))
      );

      setCurrentXP((prev) => {
        const newXP = prev + quest.xp;
        if (newXP >= levelXP) {
          setLevel((prev) => prev + 1);
          return newXP % levelXP;
        }
        return newXP;
      });

      setSuccessMessage(`+${quest.xp} XP`);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setActiveQuest(null);
      }, 2000);
    } else {
      setHearts((prev) => Math.max(0, prev - 1));
      // Показываем ошибку с анимацией
      const errorEl = document.createElement('div');
      errorEl.textContent = '❌ Неправильно!';
      errorEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        font-weight: bold;
        color: #FF4B4B;
        z-index: 1000;
        animation: shake 0.5s ease-in-out;
        pointer-events: none;
      `;
      document.body.appendChild(errorEl);
      setTimeout(() => {
        document.body.removeChild(errorEl);
      }, 1000);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #58CC02 0%, #1CB0F6 50%, #FF9600 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Прогресс-бар сверху */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '700px',
          zIndex: 100,
        }}
      >
        <ProgressBar currentXP={currentXP} levelXP={levelXP} level={level} hearts={hearts} />
      </div>

      {/* Игровая сцена - интерактивная */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '120px',
        }}
      >
        {/* Анимированный фон */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Декоративные элементы */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="floating-shape"
              style={{
                position: 'absolute',
                width: `${60 + i * 10}px`,
                height: `${60 + i * 10}px`,
                background: `rgba(255, 255, 255, ${0.1 + i * 0.02})`,
                borderRadius: '50%',
                left: `${(i * 12.5) % 100}%`,
                top: `${20 + (i * 10) % 60}%`,
                animation: `floatShape ${10 + i * 2}s infinite ease-in-out`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Центральная игровая область */}
        <div
          style={{
            position: 'relative',
            width: '90%',
            maxWidth: '1200px',
            height: '70%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '40px',
          }}
        >
          {/* Персонаж в центре */}
          <Character />

          {/* Интерактивные квесты */}
          {quests.map((quest) => (
            <InteractiveQuest
              key={quest.id}
              quest={quest}
              onClick={() => handleQuestClick(quest)}
            />
          ))}
        </div>

        {/* Эффект успеха */}
        {showSuccess && (
          <div
            className="success-animation"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#58CC02',
              textShadow: '0 0 30px rgba(88, 204, 2, 0.8), 0 4px 8px rgba(0,0,0,0.3)',
              zIndex: 1000,
              pointerEvents: 'none',
            }}
          >
            ✓ {successMessage}
          </div>
        )}
      </div>

      {/* Диалог с заданием */}
      {activeQuest && (
        <QuestDialog
          quest={activeQuest}
          onAnswer={(answerIndex) => handleAnswer(activeQuest.id, answerIndex)}
          onClose={() => setActiveQuest(null)}
        />
      )}

      <style jsx>{`
        @keyframes floatShape {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) translateX(20px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes success-animation {
          0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translate(-50%, -50%) translateX(0);
          }
          25% {
            transform: translate(-50%, -50%) translateX(-10px);
          }
          75% {
            transform: translate(-50%, -50%) translateX(10px);
          }
        }

        .success-animation {
          animation: success-animation 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
  );
}

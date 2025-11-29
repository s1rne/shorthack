'use client';

import { useState, useEffect } from 'react';
import { Quest } from './GameScene2D';

interface QuestObject2DProps {
  quest: Quest;
  onClick: () => void;
}

export function QuestObject2D({ quest, onClick }: QuestObject2DProps) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (quest.completed) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${quest.position.x}%`,
          bottom: `${quest.position.y}%`,
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          opacity: 0.5,
        }}
      >
        ✓
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${quest.position.x}%`,
        bottom: `${quest.position.y}%`,
        transform: 'translateX(-50%)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Объект квеста - книга/свиток */}
      <div
        style={{
          width: hovered ? '70px' : '60px',
          height: hovered ? '70px' : '60px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: '8px',
          boxShadow: hovered
            ? '0 8px 16px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.4)'
            : '0 4px 8px rgba(0,0,0,0.3)',
          transform: hovered
            ? 'translateY(-10px) rotateY(10deg) scale(1.1)'
            : pulse
            ? 'translateY(0px) rotateY(0deg)'
            : 'translateY(-5px) rotateY(5deg)',
          transition: 'all 0.3s ease',
          position: 'relative',
          border: '3px solid #FF8C00',
          animation: pulse ? 'glow 2s ease-in-out infinite' : 'none',
        }}
      >
        {/* Иконка вопроса */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFF',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          ?
        </div>

        {/* Свечение при наведении */}
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              right: '-10px',
              bottom: '-10px',
              borderRadius: '12px',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
              animation: 'pulseGlow 1s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Подсказка при наведении */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {quest.title}
        </div>
      )}

      <style jsx>{`
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 215, 0, 0.6);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}


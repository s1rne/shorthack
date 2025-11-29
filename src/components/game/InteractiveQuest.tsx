'use client';

import { useState, useEffect } from 'react';
import { Quest } from './GameScene2D';

interface InteractiveQuestProps {
  quest: Quest;
  onClick: () => void;
}

export function InteractiveQuest({ quest, onClick }: InteractiveQuestProps) {
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (quest.completed) {
    return (
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '140px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.6,
        }}
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #58CC02 0%, #4CAF50 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            boxShadow: '0 4px 16px rgba(88, 204, 2, 0.3)',
            border: '4px solid #4CAF50',
          }}
        >
          ✓
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '160px',
        height: '160px',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Основной круг */}
      <div
        style={{
          width: hovered ? '160px' : '140px',
          height: hovered ? '160px' : '140px',
          background: `linear-gradient(135deg, ${quest.color} 0%, ${quest.color}dd 100%)`,
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: hovered
            ? `0 12px 32px ${quest.color}80, 0 0 40px ${quest.color}60`
            : pulse
            ? `0 8px 24px ${quest.color}60, 0 0 20px ${quest.color}40`
            : `0 6px 20px ${quest.color}50`,
          transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          border: `4px solid ${quest.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: hovered ? '70px' : '60px',
          animation: pulse && !hovered ? 'pulseGlow 2s ease-in-out infinite' : 'none',
        }}
      >
        {quest.icon}
      </div>

      {/* Внешнее свечение */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${quest.color}40 0%, transparent 70%)`,
            animation: 'expandGlow 1s ease-in-out infinite',
          }}
        />
      )}

      {/* Подсказка */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.85)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'slideUp 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {quest.title}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid rgba(0, 0, 0, 0.85)',
            }}
          />
        </div>
      )}

      {/* XP бейдж */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          color: '#333',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.5)',
          border: '3px solid #FFA500',
        }}
      >
        +{quest.xp}
      </div>

      <style jsx>{`
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 6px 20px ${quest.color}50, 0 0 15px ${quest.color}30;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 10px 28px ${quest.color}70, 0 0 30px ${quest.color}50;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }

        @keyframes expandGlow {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
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


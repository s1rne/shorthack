'use client';

interface ProgressBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  hearts?: number;
  streak?: number;
}

export function ProgressBar({ currentXP, levelXP, level, hearts = 5, streak = 0 }: ProgressBarProps) {
  const progressPercent = (currentXP / levelXP) * 100;

  return (
    <div
      style={{
        width: '100%',
        padding: '20px 28px',
        background: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        backdropFilter: 'blur(20px)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        {/* Левая часть - Уровень и сердца */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '28px' }}>🏆</span>
            <span
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#333',
                fontFamily: '"Nunito", sans-serif',
              }}
            >
              Уровень {level}
            </span>
          </div>

          {/* Сердца */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '24px',
                  opacity: i < hearts ? 1 : 0.3,
                  transition: 'opacity 0.3s ease',
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Правая часть - Серия */}
        {streak > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #FF9600 0%, #FF6B00 100%)',
              borderRadius: '16px',
              fontSize: '16px',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(255, 150, 0, 0.4)',
            }}
          >
            <span>🔥</span>
            <span>{streak} дней</span>
          </div>
        )}
      </div>

      {/* Прогресс-бар */}
      <div
        style={{
          width: '100%',
          height: '28px',
          background: '#e5e7eb',
          borderRadius: '14px',
          overflow: 'hidden',
          marginBottom: '12px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #58CC02 0%, #4CAF50 50%, #58CC02 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '14px',
            transition: 'width 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            boxShadow: '0 2px 8px rgba(88, 204, 2, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            animation: 'progressShine 2s infinite',
          }}
        >
          {/* Блики */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </div>
      </div>

      {/* XP информация */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px',
          color: '#666',
          fontWeight: '600',
        }}
      >
        <span>{currentXP} / {levelXP} XP</span>
        <span style={{ color: '#58CC02' }}>
          До следующего уровня: {levelXP - currentXP} XP
        </span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes progressShine {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  );
}

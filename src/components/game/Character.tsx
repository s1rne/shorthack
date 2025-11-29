'use client';

import { useEffect, useState } from 'react';

export function Character() {
  const [animation, setAnimation] = useState<'idle' | 'happy' | 'dance'>('idle');
  const [mood, setMood] = useState<'normal' | 'excited'>('normal');

  useEffect(() => {
    // Случайные анимации
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.7) {
        setAnimation('dance');
        setMood('excited');
        setTimeout(() => {
          setAnimation('idle');
          setMood('normal');
        }, 2000);
      } else if (rand > 0.4) {
        setAnimation('happy');
        setTimeout(() => setAnimation('idle'), 1000);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="character-container"
      style={{
        position: 'relative',
        width: '200px',
        height: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: animation === 'idle' ? 'breathe 2s ease-in-out infinite' : 
                   animation === 'happy' ? 'bounce 0.6s ease-in-out' :
                   'dance 1s ease-in-out infinite',
      }}
    >
      {/* Duolingo-style персонаж */}
      <div
        style={{
          position: 'relative',
          width: '180px',
          height: '220px',
        }}
      >
        {/* Тело (зелёное как в Duolingo) */}
        <div
          className="character-body"
          style={{
            width: '140px',
            height: '140px',
            background: 'linear-gradient(135deg, #58CC02 0%, #4CAF50 100%)',
            borderRadius: '50%',
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 8px 24px rgba(88, 204, 2, 0.4), inset 0 -4px 8px rgba(0,0,0,0.1)',
            border: '4px solid #4CAF50',
          }}
        />

        {/* Голова */}
        <div
          className="character-head"
          style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #FFE082 0%, #FFD54F 100%)',
            borderRadius: '50%',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)',
            border: '4px solid #FFC107',
          }}
        >
          {/* Глаза */}
          <div
            style={{
              position: 'absolute',
              top: '35%',
              left: '25%',
              width: '18px',
              height: '18px',
              background: '#000',
              borderRadius: '50%',
              boxShadow: 'inset -2px -2px 0 0 #fff',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '35%',
              right: '25%',
              width: '18px',
              height: '18px',
              background: '#000',
              borderRadius: '50%',
              boxShadow: 'inset -2px -2px 0 0 #fff',
            }}
          />

          {/* Брови */}
          <div
            style={{
              position: 'absolute',
              top: '28%',
              left: '20%',
              width: '25px',
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              transform: mood === 'excited' ? 'rotate(-10deg)' : 'rotate(-5deg)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '28%',
              right: '20%',
              width: '25px',
              height: '8px',
              background: '#333',
              borderRadius: '4px',
              transform: mood === 'excited' ? 'rotate(10deg)' : 'rotate(5deg)',
            }}
          />

          {/* Улыбка */}
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: mood === 'excited' ? '50px' : '40px',
              height: mood === 'excited' ? '25px' : '20px',
              border: '3px solid #000',
              borderTop: 'none',
              borderRadius: '0 0 50px 50px',
              transition: 'all 0.3s ease',
            }}
          />
        </div>

        {/* Крылья/руки */}
        <div
          className="character-wing character-wing-left"
          style={{
            position: 'absolute',
            top: '80px',
            left: '10px',
            width: '50px',
            height: '80px',
            background: 'linear-gradient(135deg, #58CC02 0%, #4CAF50 100%)',
            borderRadius: '50px 50px 50px 0',
            transformOrigin: 'top center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            border: '3px solid #4CAF50',
          }}
        />
        <div
          className="character-wing character-wing-right"
          style={{
            position: 'absolute',
            top: '80px',
            right: '10px',
            width: '50px',
            height: '80px',
            background: 'linear-gradient(135deg, #58CC02 0%, #4CAF50 100%)',
            borderRadius: '50px 50px 0 50px',
            transformOrigin: 'top center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            border: '3px solid #4CAF50',
          }}
        />
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.15) translateY(-20px);
          }
        }

        @keyframes dance {
          0%, 100% {
            transform: rotate(0deg) translateY(0);
          }
          25% {
            transform: rotate(-10deg) translateY(-10px);
          }
          75% {
            transform: rotate(10deg) translateY(-10px);
          }
        }

        .character-wing-left {
          animation: ${animation === 'dance' ? 'wingFlap 0.5s ease-in-out infinite' : 
                      animation === 'happy' ? 'wingFlap 0.3s ease-in-out 3' : 'none'};
        }

        .character-wing-right {
          animation: ${animation === 'dance' ? 'wingFlap 0.5s ease-in-out infinite reverse' : 
                      animation === 'happy' ? 'wingFlap 0.3s ease-in-out 3 reverse' : 'none'};
        }

        @keyframes wingFlap {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(20deg);
          }
        }
      `}</style>
    </div>
  );
}

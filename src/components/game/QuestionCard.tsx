'use client';

import { Quest } from './QuestApp';

interface QuestionCardProps {
  quest: Quest;
  onAnswer: (index: number) => void;
  onClose: () => void;
  showResult: 'success' | 'error' | null;
}

export function QuestionCard({ quest, onAnswer, onClose, showResult }: QuestionCardProps) {
  return (
    <div style={{ animation: 'fadeIn 0.2s ease' }}>
      {/* Back button */}
      <button
        onClick={onClose}
        style={{
          background: 'rgba(155,89,182,0.2)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: '12px',
          padding: '10px 18px',
          color: '#FFD700',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        ← Отступить
      </button>

      {/* Question card */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(26,10,46,0.9), rgba(13,13,26,0.9))',
          borderRadius: '24px',
          padding: '24px',
          border: '2px solid rgba(255,215,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #9B59B6, #8E44AD)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              border: '2px solid rgba(255,215,0,0.4)',
              boxShadow: '0 4px 16px rgba(155,89,182,0.4)',
            }}
          >
            {quest.icon}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,215,0,0.7)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Испытание {quest.id}
            </div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD700' }}>
              {quest.title}
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              background: 'rgba(0, 166, 81, 0.2)',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              color: '#00C853',
              border: '1px solid rgba(0, 166, 81, 0.3)',
            }}
          >
            +{quest.xp} ⚡
          </div>
        </div>

        {/* Question */}
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.4',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {quest.question}
        </h2>

        {/* Answers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {quest.answers.map((answer, index) => {
            const isCorrect = index === quest.correctAnswer;
            const showCorrect = showResult && isCorrect;

            return (
              <button
                key={index}
                onClick={() => !showResult && onAnswer(index)}
                disabled={showResult !== null}
                style={{
                  padding: '16px 18px',
                  fontSize: '15px',
                  fontWeight: '600',
                  background: showCorrect
                    ? 'linear-gradient(135deg, rgba(0,166,81,0.4), rgba(0,140,68,0.4))'
                    : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  border: showCorrect
                    ? '2px solid #00C853'
                    : '2px solid rgba(255,255,255,0.1)',
                  borderRadius: '14px',
                  cursor: showResult ? 'default' : 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.15s ease',
                  boxShadow: showCorrect ? '0 0 20px rgba(0,166,81,0.3)' : 'none',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: showCorrect 
                      ? 'linear-gradient(135deg, #00A651, #00C853)' 
                      : 'rgba(155,89,182,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    flexShrink: 0,
                    color: '#FFD700',
                    border: '1px solid rgba(255,215,0,0.2)',
                  }}
                >
                  {showCorrect ? '✓' : String.fromCharCode(65 + index)}
                </span>
                {answer}
              </button>
            );
          })}
        </div>

        {/* Result overlay */}
        {showResult && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: showResult === 'success'
                ? 'rgba(0, 166, 81, 0.15)'
                : 'rgba(227, 30, 36, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                animation: 'pop 0.3s ease',
                textShadow: showResult === 'success'
                  ? '0 0 40px rgba(0, 166, 81, 0.8)'
                  : '0 0 40px rgba(227, 30, 36, 0.8)',
              }}
            >
              {showResult === 'success' ? '👑' : '⚔️'}
            </div>
          </div>
        )}

        {/* Decorative corners */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid rgba(255,215,0,0.3)',
          borderLeft: '2px solid rgba(255,215,0,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderTop: '2px solid rgba(255,215,0,0.3)',
          borderRight: '2px solid rgba(255,215,0,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid rgba(255,215,0,0.3)',
          borderLeft: '2px solid rgba(255,215,0,0.3)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          borderBottom: '2px solid rgba(255,215,0,0.3)',
          borderRight: '2px solid rgba(255,215,0,0.3)',
        }} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

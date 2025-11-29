'use client';

import { Quest } from './GameScene2D';

interface QuestDialogProps {
  quest: Quest;
  onAnswer: (answerIndex: number) => void;
  onClose: () => void;
}

export function QuestDialog({ quest, onAnswer, onClose }: QuestDialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
        backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          padding: '40px',
          maxWidth: '600px',
          width: '90%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
          transform: 'scale(1)',
          animation: 'slideUpScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          border: `4px solid ${quest.color}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок с иконкой */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              background: `linear-gradient(135deg, ${quest.color} 0%, ${quest.color}dd 100%)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              boxShadow: `0 4px 16px ${quest.color}60`,
            }}
          >
            {quest.icon}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            {quest.title}
          </h2>
        </div>

        {/* Вопрос */}
        <p
          style={{
            fontSize: '20px',
            marginBottom: '32px',
            color: '#555',
            lineHeight: '1.6',
            fontWeight: '500',
          }}
        >
          {quest.question}
        </p>

        {/* Варианты ответов */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quest.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index)}
              className="answer-button"
              style={{
                padding: '20px 24px',
                fontSize: '18px',
                background: 'white',
                color: '#333',
                border: `3px solid ${quest.color}`,
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                e.currentTarget.style.background = `${quest.color}15`;
                e.currentTarget.style.boxShadow = `0 6px 20px ${quest.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              {answer}
            </button>
          ))}
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: '#f3f4f6',
            color: '#666',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6';
          }}
        >
          Закрыть
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpScale {
          from {
            transform: translateY(50px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

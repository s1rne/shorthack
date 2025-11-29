'use client';

import dynamic from 'next/dynamic';

const QuestApp = dynamic(() => import('@/components/game/QuestApp').then((mod) => mod.QuestApp), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '24px',
          fontWeight: '800',
          background: 'linear-gradient(90deg, #E31E24, #00A651)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        X5 QUEST
      </div>
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(227, 30, 36, 0.3)',
          borderTopColor: '#E31E24',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  ),
});

export default function GamePage() {
  return <QuestApp />;
}

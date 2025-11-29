'use client';

import { Quest } from './QuestApp';

interface LevelPathProps {
  quests: Quest[];
  onSelect: (quest: Quest) => void;
  completedCount: number;
}

export function LevelPath({ quests, onSelect, completedCount }: LevelPathProps) {
  return (
    <div style={{ paddingBottom: '32px' }}>
      {/* Progress header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div
          style={{
            fontSize: '11px',
            color: 'rgba(255,215,0,0.7)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Путь героя
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          {quests.map((q) => (
            <div
              key={q.id}
              style={{
                width: '32px',
                height: '6px',
                borderRadius: '3px',
                background: q.completed 
                  ? 'linear-gradient(90deg, #00A651, #00C853)' 
                  : 'rgba(255,255,255,0.1)',
                boxShadow: q.completed ? '0 0 10px rgba(0, 166, 81, 0.5)' : 'none',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
          <span style={{ color: '#FFD700' }}>{completedCount}</span> / {quests.length} испытаний
        </span>
      </div>

      {/* Level cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quests.map((quest) => {
          const isAvailable = !quest.locked && !quest.completed;
          const isCompleted = quest.completed;
          const isLocked = quest.locked;

          return (
            <div
              key={quest.id}
              onClick={() => onSelect(quest)}
              style={{
                background: isCompleted
                  ? 'linear-gradient(135deg, rgba(0,166,81,0.3), rgba(0,140,68,0.3))'
                  : isAvailable
                  ? 'linear-gradient(135deg, rgba(155,89,182,0.4), rgba(142,68,173,0.4))'
                  : 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.4 : 1,
                border: isAvailable 
                  ? '2px solid rgba(255,215,0,0.4)' 
                  : isCompleted 
                  ? '2px solid rgba(0,166,81,0.4)'
                  : '1px solid rgba(255,255,255,0.05)',
                boxShadow: isAvailable 
                  ? '0 0 20px rgba(155,89,182,0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : isCompleted
                  ? '0 0 15px rgba(0,166,81,0.2)'
                  : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: isCompleted
                    ? 'linear-gradient(135deg, #00A651, #00C853)'
                    : isAvailable
                    ? 'linear-gradient(135deg, #9B59B6, #8E44AD)'
                    : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0,
                  border: '2px solid rgba(255,215,0,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
              >
                {isCompleted ? '✓' : isLocked ? '🔒' : quest.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: isLocked ? 'rgba(255,255,255,0.4)' : '#FFD700',
                    marginBottom: '4px',
                    textShadow: isAvailable ? '0 0 10px rgba(255,215,0,0.3)' : 'none',
                  }}
                >
                  Испытание {quest.id}: {quest.title}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: isCompleted ? '#00C853' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {isCompleted ? '✓ Пройдено' : isLocked ? 'Заблокировано' : `+${quest.xp} опыта`}
                </div>
              </div>

              {/* Arrow */}
              {isAvailable && (
                <div style={{ 
                  fontSize: '20px', 
                  color: '#FFD700',
                  textShadow: '0 0 10px rgba(255,215,0,0.5)',
                }}>
                  ⚔️
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete message */}
      {completedCount === quests.length && (
        <div
          style={{
            marginTop: '24px',
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,165,0,0.3))',
            borderRadius: '20px',
            textAlign: 'center',
            border: '2px solid #FFD700',
            boxShadow: '0 0 30px rgba(255,215,0,0.3)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>👑</div>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFD700' }}>
            Ты стал Легендой!
          </div>
        </div>
      )}
    </div>
  );
}

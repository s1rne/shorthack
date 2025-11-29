'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';

// ========== 3D ДЕКОРАТИВНЫЙ ФОН ==========
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {[...Array(12)].map((_, i) => (
        <mesh
          key={`g-${i}`}
          position={[
            Math.sin(i * 0.5) * 5,
            Math.cos(i * 0.7) * 3,
            -4 + Math.cos(i * 0.3) * 2,
          ]}
        >
          <octahedronGeometry args={[0.12 + Math.random() * 0.08]} />
          <meshBasicMaterial color="#98FF4C" transparent opacity={0.12} />
        </mesh>
      ))}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={`p-${i}`}
          position={[
            Math.cos(i * 0.9) * 4,
            Math.sin(i * 0.6) * 2.5,
            -3 + Math.sin(i * 0.4) * 2,
          ]}
        >
          <octahedronGeometry args={[0.1 + Math.random() * 0.06]} />
          <meshBasicMaterial color="#C3B7FF" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function Background3D() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ========== ТИПЫ ==========
type Screen = 'welcome' | 'directions' | 'website' | 'interview' | 'projects' | 'benefits' | 'surveys';

const directions = [
  { id: 'testing', label: 'Тестирование', icon: '🧪' },
  { id: 'data', label: 'Data analyst / Data scientist', icon: '📊' },
  { id: 'hr', label: 'IT HR', icon: '👥' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' },
  { id: 'support', label: 'IT-поддержка', icon: '🛠️' },
  { id: 'dev', label: 'Разработка', icon: '💻' },
  { id: 'infra', label: 'Инфраструктура', icon: '🏗️' },
  { id: 'analysis', label: 'Системный анализ', icon: '📋' },
];

// ========== КОМПОНЕНТЫ ==========
function ChatBubble({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      style={{
        background: 'rgba(61, 54, 84, 0.4)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 20px',
        borderRadius: '20px',
        borderTopLeftRadius: '6px',
        maxWidth: '92%',
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      style={{
        background: 'rgba(61, 54, 84, 0.3)',
        backdropFilter: 'blur(10px)',
        padding: '16px 24px',
        borderRadius: '20px',
        borderTopLeftRadius: '6px',
        width: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#98FF4C',
              animation: `typing 1.4s infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '8px' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: '700',
          color: '#0D0B14',
          flexShrink: 0,
          boxShadow: '0 4px 20px rgba(152, 255, 76, 0.3)',
        }}
      >
        М
      </div>
      <span style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '13px', fontWeight: '500' }}>
        Михаил • X5 Tech
      </span>
    </div>
  );
}

function NeonButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  fullWidth,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}) {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: fullWidth ? 1 : 'none',
        background: isPrimary
          ? 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)'
          : 'rgba(61, 54, 84, 0.4)',
        border: isPrimary ? 'none' : '1px solid rgba(195, 183, 255, 0.3)',
        borderRadius: '16px',
        padding: '18px 28px',
        color: isPrimary ? '#0D0B14' : '#C3B7FF',
        fontSize: '15px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        boxShadow: isPrimary ? '0 8px 32px rgba(152, 255, 76, 0.25)' : 'none',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
      }}
    >
      {children}
    </button>
  );
}

// ========== ГЛАВНОЕ ==========
export function QuestApp() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [screen]);

  const handleDirection = (id: string) => {
    setSelectedDirection(id);
    setTimeout(() => setScreen('website'), 600);
  };

  const handleRestart = () => {
    setScreen('welcome');
    setSelectedDirection(null);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'linear-gradient(180deg, #0D0B14 0%, #1a1625 50%, #0D0B14 100%)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
      }}
    >
      <Background3D />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'radial-gradient(ellipse at top, rgba(152, 255, 76, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <header
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
          background: 'rgba(13, 11, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(152, 255, 76, 0.3)',
            }}
          >
            <span style={{ fontWeight: '800', fontSize: '18px', color: '#0D0B14' }}>X5</span>
          </div>
          <div>
            <span style={{ color: '#FAFAFA', fontWeight: '600', fontSize: '15px' }}>Tech</span>
            <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px' }}>Career Quest</div>
          </div>
        </div>

        {screen === 'surveys' && (
          <button
            onClick={handleRestart}
            style={{
              background: 'rgba(195, 183, 255, 0.1)',
              border: '1px solid rgba(195, 183, 255, 0.2)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#C3B7FF',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            ← Начало
          </button>
        )}
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          zIndex: 10,
          overflow: 'auto',
          gap: '12px',
        }}
      >
        {/* ===== WELCOME ===== */}
        {screen === 'welcome' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Привет! 👋 Ты попал на стенд <span style={{ color: '#98FF4C', fontWeight: '600' }}>X5 Tech</span> на ярмарке вакансий твоего университета!
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Давай подскажу как попасть к нам на стажировку!
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== DIRECTIONS ===== */}
        {screen === 'directions' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Мы набираем людей из разных направлений: тестирование, аналитика, разработка и многое другое.
                  </p>
                </ChatBubble>
                <ChatBubble delay={300}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Что тебе интересно?
                  </p>
                </ChatBubble>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    marginTop: '12px',
                    animation: 'fadeIn 0.4s ease 0.5s both',
                  }}
                >
                  {directions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleDirection(d.id)}
                      style={{
                        background:
                          selectedDirection === d.id
                            ? 'linear-gradient(135deg, rgba(152, 255, 76, 0.2), rgba(152, 255, 76, 0.05))'
                            : 'rgba(61, 54, 84, 0.3)',
                        border:
                          selectedDirection === d.id
                            ? '1px solid rgba(152, 255, 76, 0.4)'
                            : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        padding: '14px 12px',
                        color: '#FAFAFA',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>{d.icon}</span>
                      <span style={{ textAlign: 'left', lineHeight: 1.3 }}>{d.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ===== WEBSITE ===== */}
        {screen === 'website' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Это наш сайт — здесь ты можешь узнать о компании и отправить анкету на стажировку!
                  </p>
                </ChatBubble>

                {/* Website preview */}
                <div
                  style={{
                    background: 'rgba(61, 54, 84, 0.3)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    marginTop: '4px',
                    animation: 'fadeIn 0.4s ease 0.3s both',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27ca41' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>
                      techcrew.start.x5.ru
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '28px 20px',
                      background: 'linear-gradient(135deg, #0D0B14 0%, #1a1625 100%)',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #98FF4C, #7ACC3D)',
                        borderRadius: '14px',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        color: '#0D0B14',
                      }}
                    >
                      X5
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#FAFAFA', marginBottom: '6px' }}>
                      X5 Tech Careers
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(195, 183, 255, 0.6)' }}>
                      Стажировка и карьера в IT
                    </div>
                  </div>
                </div>

                <ChatBubble delay={500}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Предлагаю отправить анкету и перейти к собеседованиям! 📝
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== INTERVIEW ===== */}
        {screen === 'interview' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    После заполнения анкеты следует <span style={{ color: '#C3B7FF', fontWeight: '600' }}>HR-интервью</span>.
                  </p>
                </ChatBubble>
                <ChatBubble delay={300}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    С тобой пообщается специалист компании и задаст вопросы.
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== PROJECTS ===== */}
        {screen === 'projects' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Наши команды создают платформу по управлению данными и BI аналитике, цифровую платформу для поставщиков, систему сбора обратной связи для торговых сетей, платформу для A/B тестирования бизнес-процессов и другие проекты цифровизации группы компаний X5.
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    У нас в работе <span style={{ color: '#98FF4C', fontWeight: '700' }}>больше 100 проектов</span> и <span style={{ color: '#98FF4C', fontWeight: '700' }}>50 продуктов</span>! 🚀
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== BENEFITS ===== */}
        {screen === 'benefits' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    У нас нет дресс-кода, зато есть <span style={{ color: '#C3B7FF', fontWeight: '600' }}>гибкий график</span> и сплоченная команда экспертов! 💪
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    А ещё каждый может выбрать удобный формат работы — офис (в Москве, Иннополисе и Ижевске) или удалёнку.
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== SURVEYS (Опросы) ===== */}
        {screen === 'surveys' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Ждём тебя в команде <span style={{ color: '#98FF4C', fontWeight: '600' }}>X5 Tech</span>! 🎉
                  </p>
                </ChatBubble>
                <ChatBubble delay={300}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    А теперь пройди опросы и получи <span style={{ color: '#98FF4C', fontWeight: '700' }}>мерч</span>! 🎁
                  </p>
                </ChatBubble>

                {/* Surveys section */}
                <div
                  style={{
                    marginTop: '16px',
                    animation: 'fadeIn 0.4s ease 0.5s both',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(195, 183, 255, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '1.5px',
                      marginBottom: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Доступные опросы
                  </div>

                  {/* Placeholder for surveys from admin */}
                  <div
                    style={{
                      background: 'rgba(61, 54, 84, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                      Опросы скоро появятся
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '16px 20px',
          paddingBottom: '28px',
          zIndex: 10,
          background: 'rgba(13, 11, 20, 0.8)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {screen === 'welcome' && !typing && (
          <NeonButton fullWidth onClick={() => setScreen('directions')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'directions' && !typing && selectedDirection && (
          <NeonButton fullWidth onClick={() => setScreen('website')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'website' && !typing && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <NeonButton variant="secondary" onClick={() => window.open('https://techcrew.start.x5.ru/', '_blank')}>
              🌐 Сайт
            </NeonButton>
            <NeonButton fullWidth onClick={() => setScreen('interview')}>
              Далее →
            </NeonButton>
          </div>
        )}

        {screen === 'interview' && !typing && (
          <NeonButton fullWidth onClick={() => setScreen('projects')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'projects' && !typing && (
          <NeonButton fullWidth onClick={() => setScreen('benefits')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'benefits' && !typing && (
          <NeonButton fullWidth onClick={() => setScreen('surveys')}>
            К опросам 🎁
          </NeonButton>
        )}

        {screen === 'surveys' && !typing && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <NeonButton variant="secondary" onClick={handleRestart}>
              ← Начало
            </NeonButton>
            <NeonButton fullWidth onClick={() => window.open('https://techcrew.start.x5.ru/', '_blank')}>
              На стажировку 🚀
            </NeonButton>
          </div>
        )}
      </footer>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes typing {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

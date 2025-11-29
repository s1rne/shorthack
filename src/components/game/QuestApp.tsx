'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { trpc } from '@/lib/trpc/client';

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
type Screen =
  | 'welcome'
  | 'directions'
  | 'website'
  | 'interview'
  | 'projects'
  | 'benefits'
  | 'testTask'
  | 'techInterview'
  | 'final'
  | 'surveys';

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

// Секция с опросами
function SurveysSection({ typing }: { typing: boolean }) {
  const { data: surveys, isLoading } = trpc.survey.getAll.useQuery();

  return (
    <>
      <Avatar />
      {typing ? (
        <TypingIndicator />
      ) : (
        <>
          <ChatBubble>
            <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
              Пройди опросы и получи <span style={{ color: '#98FF4C', fontWeight: '700' }}>мерч X5 Tech</span>! 🎁
            </p>
          </ChatBubble>

          <div style={{ marginTop: '16px', animation: 'fadeIn 0.4s ease 0.3s both' }}>
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

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '2px solid rgba(152, 255, 76, 0.2)',
                    borderTopColor: '#98FF4C',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              </div>
            ) : surveys && surveys.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {surveys.map((survey) => (
                  <a
                    key={survey._id.toString()}
                    href={`/survey/${survey._id.toString()}`}
                    style={{
                      background: 'rgba(61, 54, 84, 0.3)',
                      border: '1px solid rgba(152, 255, 76, 0.2)',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.2), rgba(152, 255, 76, 0.05))',
                        border: '1px solid rgba(152, 255, 76, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      📋
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#FAFAFA', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                        {survey.title}
                      </div>
                      <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '13px' }}>
                        {survey.questions.length} вопросов
                      </div>
                    </div>
                    <div style={{ color: '#98FF4C', fontSize: '18px' }}>→</div>
                  </a>
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(61, 54, 84, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📋</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' }}>
                  Опросы скоро появятся
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                  Следи за обновлениями
                </div>
              </div>
            )}
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
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
    // Сохраняем выбор в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('x5_direction', id);
    }
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
            opacity: screen === 'welcome' ? 0 : 1,
            pointerEvents: screen === 'welcome' ? 'none' : 'auto',
          }}
        >
          ← Начало
        </button>
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

        {/* ===== TEST TASK ===== */}
        {screen === 'testTask' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    А после HR-интервью тебя ждёт <span style={{ color: '#98FF4C', fontWeight: '600' }}>тестовое задание</span>. 📋
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Оно может отличаться в зависимости от команды и направления.
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== TECH INTERVIEW ===== */}
        {screen === 'techInterview' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Последняя часть — <span style={{ color: '#C3B7FF', fontWeight: '600' }}>техническое интервью</span>. После него ты попадёшь в команду! 🎉
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Тебя встретит ментор, расскажет подробнее о компании и том, чем тебе предстоит заниматься.
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

        {/* ===== FINAL ===== */}
        {screen === 'final' && (
          <>
            <Avatar />
            {typing ? (
              <TypingIndicator />
            ) : (
              <>
                <ChatBubble>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Теперь предлагаю тебе <span style={{ color: '#98FF4C', fontWeight: '600' }}>оставить анкету</span> на стажировку и пройти этот путь! 🚀
                  </p>
                </ChatBubble>
                <ChatBubble delay={400}>
                  <p style={{ margin: 0, color: '#FAFAFA', fontSize: '15px', lineHeight: 1.6 }}>
                    Переходи в <span style={{ color: '#C3B7FF', fontWeight: '600' }}>личный кабинет</span>, проходи опросы и получай мерч! 🎁
                  </p>
                </ChatBubble>
              </>
            )}
          </>
        )}

        {/* ===== SURVEYS ===== */}
        {screen === 'surveys' && <SurveysSection typing={typing} />}
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
          <NeonButton fullWidth onClick={() => setScreen('testTask')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'testTask' && !typing && (
          <NeonButton fullWidth onClick={() => setScreen('techInterview')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'techInterview' && !typing && (
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
          <NeonButton fullWidth onClick={() => setScreen('final')}>
            Далее →
          </NeonButton>
        )}

        {screen === 'final' && !typing && (
          <NeonButton fullWidth onClick={() => window.location.href = '/profile'}>
            Личный кабинет →
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

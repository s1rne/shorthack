'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';
import { trpc } from '@/lib/trpc/client';

// ========== 3D ФОН ==========
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
        <mesh key={i} position={[Math.sin(i * 0.5) * 5, Math.cos(i * 0.7) * 3, -4 + Math.cos(i * 0.3) * 2]}>
          <octahedronGeometry args={[0.12]} />
          <meshBasicMaterial color="#98FF4C" transparent opacity={0.12} />
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
interface UserProfile {
  visitorId: string;
  totalPoints: number;
  completedSurveys: {
    surveyId: string;
    surveyTitle: string;
    score: number;
    totalPoints: number;
    passed: boolean;
    promoCode: string;
    completedAt: string;
  }[];
  selectedDirection: string | null;
}

// ========== КОМПОНЕНТЫ ==========
function NeonButton({
  children,
  onClick,
  variant = 'primary',
  fullWidth,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}) {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      style={{
        flex: fullWidth ? 1 : 'none',
        background: isPrimary ? 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)' : 'rgba(61, 54, 84, 0.4)',
        border: isPrimary ? 'none' : '1px solid rgba(195, 183, 255, 0.3)',
        borderRadius: '16px',
        padding: '18px 28px',
        color: isPrimary ? '#0D0B14' : '#C3B7FF',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: isPrimary ? '0 8px 32px rgba(152, 255, 76, 0.25)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </button>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { data: surveys } = trpc.survey.getAll.useQuery();

  useEffect(() => {
    // Загрузка профиля из localStorage
    const loadProfile = () => {
      const stored = localStorage.getItem('x5_user_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        // Создаём новый профиль
        const visitorId = localStorage.getItem('x5_visitor_id') || `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('x5_visitor_id', visitorId);
        
        const newProfile: UserProfile = {
          visitorId,
          totalPoints: 0,
          completedSurveys: [],
          selectedDirection: localStorage.getItem('x5_direction'),
        };
        localStorage.setItem('x5_user_profile', JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    };
    loadProfile();
  }, []);

  const availableSurveys = surveys?.filter(
    (s) => !profile?.completedSurveys.some((c) => c.surveyId === s._id.toString())
  );

  const directions: Record<string, string> = {
    testing: '🧪 Тестирование',
    data: '📊 Data Analyst',
    hr: '👥 IT HR',
    devops: '⚙️ DevOps',
    support: '🛠️ IT-поддержка',
    dev: '💻 Разработка',
    infra: '🏗️ Инфраструктура',
    analysis: '📋 Системный анализ',
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
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative',
      }}
    >
      <Background3D />

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
              background: 'linear-gradient(135deg, #98FF4C, #7ACC3D)',
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
            <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px' }}>Личный кабинет</div>
          </div>
        </div>

        <a
          href="/"
          style={{
            background: 'rgba(195, 183, 255, 0.1)',
            border: '1px solid rgba(195, 183, 255, 0.2)',
            borderRadius: '10px',
            padding: '8px 14px',
            color: '#C3B7FF',
            fontSize: '13px',
            fontWeight: '500',
            textDecoration: 'none',
          }}
        >
          ← Назад
        </a>
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
          gap: '16px',
        }}
      >
        {/* Points card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.15), rgba(152, 255, 76, 0.05))',
            border: '1px solid rgba(152, 255, 76, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: 'rgba(152, 255, 76, 0.7)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
            Твои баллы
          </div>
          <div
            style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#98FF4C',
              textShadow: '0 0 30px rgba(152, 255, 76, 0.5)',
              marginBottom: '8px',
            }}
          >
            {profile?.totalPoints || 0}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Пройдено опросов: {profile?.completedSurveys.length || 0}
          </div>
        </div>

        {/* Direction */}
        {profile?.selectedDirection && (
          <div
            style={{
              background: 'rgba(61, 54, 84, 0.3)',
              border: '1px solid rgba(195, 183, 255, 0.2)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '24px' }}>{directions[profile.selectedDirection]?.split(' ')[0]}</div>
            <div>
              <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', marginBottom: '2px' }}>
                Твоё направление
              </div>
              <div style={{ color: '#FAFAFA', fontSize: '15px', fontWeight: '600' }}>
                {directions[profile.selectedDirection]?.split(' ').slice(1).join(' ')}
              </div>
            </div>
          </div>
        )}

        {/* Promo codes */}
        {profile?.completedSurveys.some((s) => s.passed && s.promoCode) && (
          <div>
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
              Твои промокоды
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {profile.completedSurveys
                .filter((s) => s.passed && s.promoCode)
                .map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.1), rgba(152, 255, 76, 0.02))',
                      border: '1px solid rgba(152, 255, 76, 0.3)',
                      borderRadius: '14px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '4px' }}>
                        {s.surveyTitle}
                      </div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#98FF4C',
                          fontFamily: 'ui-monospace, monospace',
                          letterSpacing: '2px',
                        }}
                      >
                        {s.promoCode}
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#98FF4C',
                        color: '#0D0B14',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                      }}
                    >
                      +{s.score}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Available surveys */}
        <div>
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

          {availableSurveys && availableSurveys.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {availableSurveys.map((survey) => (
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
                    }}
                  >
                    📋
                  </div>
                  <div style={{ flex: 1 }}>
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
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                Все опросы пройдены!
              </div>
            </div>
          )}
        </div>

        {/* History */}
        {profile?.completedSurveys && profile.completedSurveys.length > 0 && (
          <div>
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
              История
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.completedSurveys.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(61, 54, 84, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: '#FAFAFA', fontSize: '14px', fontWeight: '500' }}>
                      {s.surveyTitle}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>
                      {s.score}/{s.totalPoints} баллов
                    </div>
                  </div>
                  <div
                    style={{
                      background: s.passed ? 'rgba(152, 255, 76, 0.2)' : 'rgba(248, 204, 199, 0.2)',
                      color: s.passed ? '#98FF4C' : '#F8CCC7',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {s.passed ? 'Пройден' : 'Не пройден'}
                  </div>
                </div>
              ))}
            </div>
          </div>
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
        <NeonButton fullWidth onClick={() => window.open('https://techcrew.start.x5.ru/', '_blank')}>
          Подать заявку на стажировку 🚀
        </NeonButton>
      </footer>
    </div>
  );
}


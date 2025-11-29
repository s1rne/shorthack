'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense } from 'react';
import * as THREE from 'three';

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

// ========== КОМПОНЕНТЫ ==========
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
        background: isPrimary ? 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)' : 'rgba(61, 54, 84, 0.4)',
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
      }}
    >
      {children}
    </button>
  );
}

export default function SurveyPage() {
  const params = useParams();
  const surveyId = params.id as string;

  const [visitorId] = useState(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('x5_visitor_id');
      if (!id) {
        id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('x5_visitor_id', id);
      }
      return id;
    }
    return '';
  });

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ score: number; totalPoints: number; passed: boolean; promoCode: string } | null>(null);

  const { data: survey, isLoading, error } = trpc.survey.getById.useQuery({ id: surveyId });
  const submitMutation = trpc.survey.submit.useMutation();

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (survey && currentQ < survey.questions.length - 1) {
        setCurrentQ((q) => q + 1);
        setSelectedAnswer(null);
      } else {
        // Отправка результата
        submitMutation.mutate(
          { surveyId, visitorId, answers: newAnswers },
          {
            onSuccess: (data) => {
              setResult(data);
              setShowResult(true);
              
              // Сохраняем в localStorage профиля
              if (typeof window !== 'undefined' && survey) {
                const stored = localStorage.getItem('x5_user_profile');
                const profile = stored ? JSON.parse(stored) : {
                  visitorId,
                  totalPoints: 0,
                  completedSurveys: [],
                  selectedDirection: localStorage.getItem('x5_direction'),
                };
                
                // Добавляем результат
                profile.completedSurveys.push({
                  surveyId,
                  surveyTitle: survey.title,
                  score: data.score,
                  totalPoints: data.totalPoints,
                  passed: data.passed,
                  promoCode: data.promoCode,
                  completedAt: new Date().toISOString(),
                });
                
                // Обновляем общие баллы
                profile.totalPoints += data.score;
                
                localStorage.setItem('x5_user_profile', JSON.stringify(profile));
              }
            },
          }
        );
      }
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          background: '#0D0B14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(152, 255, 76, 0.2)',
              borderTopColor: '#98FF4C',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Загрузка опроса...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100dvh',
          background: '#0D0B14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
          <h2 style={{ color: '#FAFAFA', marginBottom: '8px' }}>Опрос не найден</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
            Возможно, он был удалён или ссылка неверная
          </p>
          <NeonButton onClick={() => window.location.href = '/game'}>
            ← На главную
          </NeonButton>
        </div>
      </div>
    );
  }

  const question = survey.questions[currentQ];

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
            <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px' }}>Опрос</div>
          </div>
        </div>

        {!showResult && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(152, 255, 76, 0.1)',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(152, 255, 76, 0.2)',
            }}
          >
            <span style={{ color: '#98FF4C', fontSize: '13px', fontWeight: '600' }}>
              {currentQ + 1}/{survey.questions.length}
            </span>
          </div>
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
          gap: '16px',
        }}
      >
        {!showResult ? (
          <>
            {/* Survey title */}
            <div
              style={{
                background: 'rgba(61, 54, 84, 0.3)',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <h1 style={{ margin: 0, color: '#FAFAFA', fontSize: '18px', fontWeight: '600' }}>
                {survey.title}
              </h1>
              {survey.description && (
                <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                  {survey.description}
                </p>
              )}
            </div>

            {/* Progress */}
            <div
              style={{
                width: '100%',
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${((currentQ + 1) / survey.questions.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #98FF4C, #7ACC3D)',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Question */}
            <div
              style={{
                background: 'rgba(61, 54, 84, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                borderRadius: '20px',
              }}
            >
              <p style={{ margin: 0, color: '#FAFAFA', fontSize: '17px', lineHeight: 1.6, fontWeight: '500' }}>
                {question.question}
              </p>
            </div>

            {/* Answers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {question.answers.map((ans: string, idx: number) => {
                const isCorrect = idx === question.correctAnswer;
                const isSelected = selectedAnswer === idx;
                const showAnswerResult = selectedAnswer !== null;

                let bg = 'rgba(61, 54, 84, 0.3)';
                let border = '1px solid rgba(255, 255, 255, 0.08)';

                if (showAnswerResult) {
                  if (isCorrect) {
                    bg = 'rgba(152, 255, 76, 0.15)';
                    border = '1px solid rgba(152, 255, 76, 0.5)';
                  } else if (isSelected) {
                    bg = 'rgba(248, 204, 199, 0.15)';
                    border = '1px solid rgba(248, 204, 199, 0.5)';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    style={{
                      background: bg,
                      border,
                      borderRadius: '14px',
                      padding: '16px 18px',
                      color: '#FAFAFA',
                      fontSize: '15px',
                      fontWeight: '500',
                      cursor: selectedAnswer !== null ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        background:
                          showAnswerResult && isCorrect
                            ? '#98FF4C'
                            : showAnswerResult && isSelected
                            ? '#F8CCC7'
                            : 'rgba(195, 183, 255, 0.15)',
                        color: showAnswerResult && (isCorrect || isSelected) ? '#0D0B14' : '#C3B7FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {showAnswerResult && isCorrect
                        ? '✓'
                        : showAnswerResult && isSelected
                        ? '✗'
                        : String.fromCharCode(65 + idx)}
                    </span>
                    {ans}
                  </button>
                );
              })}
            </div>

            {/* Points info */}
            <div style={{ textAlign: 'center', color: 'rgba(195, 183, 255, 0.5)', fontSize: '13px' }}>
              За правильный ответ: <span style={{ color: '#98FF4C' }}>+{question.points} баллов</span>
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: result?.passed
                    ? 'linear-gradient(135deg, rgba(152, 255, 76, 0.2), rgba(152, 255, 76, 0.05))'
                    : 'linear-gradient(135deg, rgba(248, 204, 199, 0.2), rgba(248, 204, 199, 0.05))',
                  border: result?.passed
                    ? '2px solid rgba(152, 255, 76, 0.4)'
                    : '2px solid rgba(248, 204, 199, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}
              >
                <span style={{ fontSize: '24px', fontWeight: '800', color: result?.passed ? '#98FF4C' : '#F8CCC7' }}>
                  {result?.score}/{result?.totalPoints}
                </span>
              </div>

              <h2 style={{ color: '#FAFAFA', fontSize: '24px', marginBottom: '8px' }}>
                {result?.passed ? 'Отлично! 🎉' : 'Попробуй ещё раз!'}
              </h2>

              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '24px' }}>
                {result?.passed
                  ? 'Покажи промокод на стенде и получи мерч!'
                  : 'Нужно набрать минимум 60% для получения мерча'}
              </p>

              {result?.passed && result.promoCode && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.1), rgba(152, 255, 76, 0.02))',
                    border: '1px solid rgba(152, 255, 76, 0.3)',
                    borderRadius: '20px',
                    padding: '28px',
                    marginBottom: '24px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(152, 255, 76, 0.7)',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontWeight: '600',
                    }}
                  >
                    Твой промокод
                  </div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: '800',
                      color: '#98FF4C',
                      letterSpacing: '4px',
                      fontFamily: 'ui-monospace, monospace',
                      textShadow: '0 0 30px rgba(152, 255, 76, 0.5)',
                    }}
                  >
                    {result.promoCode}
                  </div>
                </div>
              )}
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
        {showResult && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <NeonButton variant="secondary" onClick={handleRestart}>
              Заново
            </NeonButton>
            <NeonButton fullWidth onClick={() => window.location.href = '/game'}>
              На главную
            </NeonButton>
          </div>
        )}
      </footer>
    </div>
  );
}


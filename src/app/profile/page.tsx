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

const allDirections = [
  { id: 'testing', label: 'Тестирование', icon: '🧪' },
  { id: 'data', label: 'Data analyst / Data scientist', icon: '📊' },
  { id: 'hr', label: 'IT HR', icon: '👥' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' },
  { id: 'support', label: 'IT-поддержка', icon: '🛠️' },
  { id: 'dev', label: 'Разработка', icon: '💻' },
  { id: 'infra', label: 'Инфраструктура', icon: '🏗️' },
  { id: 'analysis', label: 'Системный анализ', icon: '📋' },
];

export default function ProfilePage() {
  const [telegram, setTelegram] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUniversity, setEditUniversity] = useState('');
  const [editCourse, setEditCourse] = useState(1);
  const [editDirections, setEditDirections] = useState<string[]>([]);
  const [editError, setEditError] = useState<string | null>(null);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const storedTelegram = localStorage.getItem('x5_telegram');
    if (!storedTelegram) {
      window.location.href = '/';
      return;
    }
    setTelegram(storedTelegram);
  }, []);
  
  // Получаем все данные из БД
  const { data: surveys } = trpc.survey.getAll.useQuery();
  const { data: profile, isLoading, refetch: refetchPlayer } = trpc.player.getProfile.useQuery(
    { telegram: telegram || '' },
    { enabled: !!telegram }
  );

  // Мерч
  const { data: merchList } = trpc.merch.getAll.useQuery();
  const { data: myPurchases, refetch: refetchPurchases } = trpc.merch.getMyPurchases.useQuery(
    { telegram: telegram || '' },
    { enabled: !!telegram }
  );

  // Мероприятия
  const { data: eventsList } = trpc.event.getAll.useQuery();

  const purchaseMutation = trpc.merch.purchase.useMutation({
    onSuccess: () => {
      refetchPlayer();
      refetchPurchases();
    },
  });

  const updateProfileMutation = trpc.player.updateProfile.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      setEditError(null);
      refetchPlayer();
    },
    onError: (error) => {
      setEditError(error.message);
    },
  });

  const startEditing = () => {
    if (profile) {
      setEditUniversity(profile.university);
      setEditCourse(profile.course);
      setEditDirections(profile.selectedDirections);
    }
    setIsEditing(true);
    setEditError(null);
  };

  const handleSaveProfile = () => {
    if (!telegram) return;

    if (!editUniversity.trim()) {
      setEditError('Укажите ВУЗ');
      return;
    }

    updateProfileMutation.mutate({
      telegram,
      university: editUniversity,
      course: editCourse,
      selectedDirections: editDirections,
    });
  };

  const toggleDirection = (id: string) => {
    setEditDirections((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

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

  // Вычисляем доступные баллы (заработано - потрачено)
  const earnedPoints = profile?.totalPoints || 0;
  const spentPoints = myPurchases?.reduce((sum, p) => sum + p.pointsSpent, 0) || 0;
  const availablePoints = earnedPoints - spentPoints;

  // Показываем загрузку пока данные не получены
  if (!telegram || isLoading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #0D0B14 0%, #1a1625 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(152, 255, 76, 0.2)',
            borderTopColor: '#98FF4C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '14px' }}>
          Загрузка профиля...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={startEditing}
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
            ✏️ Изменить
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('x5_telegram');
              localStorage.removeItem('x5_directions');
              localStorage.removeItem('x5_user_profile');
              window.location.href = '/';
            }}
            style={{
              background: 'rgba(248, 113, 113, 0.15)',
              border: '1px solid rgba(248, 113, 113, 0.3)',
              borderRadius: '10px',
              padding: '8px 14px',
              color: '#F87171',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Выйти
          </button>
        </div>
      </header>

      {/* Modal редактирования */}
      {isEditing && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #1a1625 0%, #0D0B14 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              padding: '28px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, color: '#FAFAFA', fontSize: '20px', fontWeight: '600' }}>
                Редактирование профиля
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(195, 183, 255, 0.6)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Telegram (только отображение) */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Telegram
                </label>
                <div
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(61, 54, 84, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    color: 'rgba(195, 183, 255, 0.5)',
                    fontSize: '15px',
                  }}
                >
                  {profile?.telegram || telegram}
                </div>
              </div>

              {/* ВУЗ */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ВУЗ
                </label>
                <input
                  type="text"
                  value={editUniversity}
                  onChange={(e) => setEditUniversity(e.target.value)}
                  placeholder="Название университета"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(61, 54, 84, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#FAFAFA',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Курс */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Курс
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3, 4, 5, 6].map((c) => (
                    <button
                      key={c}
                      onClick={() => setEditCourse(c)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: editCourse === c ? 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)' : 'rgba(61, 54, 84, 0.4)',
                        border: editCourse === c ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: editCourse === c ? '#0D0B14' : '#FAFAFA',
                        fontSize: '15px',
                        fontWeight: editCourse === c ? '700' : '500',
                        cursor: 'pointer',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Направления */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Направления
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {allDirections.map((d) => {
                    const isSelected = editDirections.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        onClick={() => toggleDirection(d.id)}
                        style={{
                          background: isSelected ? 'linear-gradient(135deg, rgba(152, 255, 76, 0.2), rgba(152, 255, 76, 0.05))' : 'rgba(61, 54, 84, 0.3)',
                          border: isSelected ? '1px solid rgba(152, 255, 76, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '10px',
                          padding: '10px',
                          color: '#FAFAFA',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          textAlign: 'left',
                        }}
                      >
                        <span>{d.icon}</span>
                        <span style={{ flex: 1 }}>{d.label}</span>
                        {isSelected && <span style={{ color: '#98FF4C' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ошибка */}
              {editError && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(248, 113, 113, 0.15)',
                    border: '1px solid rgba(248, 113, 113, 0.3)',
                    borderRadius: '10px',
                    color: '#F87171',
                    fontSize: '14px',
                  }}
                >
                  {editError}
                </div>
              )}

              {/* Кнопки */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'rgba(61, 54, 84, 0.4)',
                    border: '1px solid rgba(195, 183, 255, 0.3)',
                    borderRadius: '12px',
                    color: '#C3B7FF',
                    fontSize: '15px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  style={{
                    flex: 1,
                    padding: '14px',
                    background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#0D0B14',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {updateProfileMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {availablePoints}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '4px' }}>
            Доступно баллов
          </div>
          {spentPoints > 0 && (
            <div style={{ color: 'rgba(252, 234, 170, 0.6)', fontSize: '12px' }}>
              Потрачено: {spentPoints} | Заработано: {earnedPoints}
            </div>
          )}
        </div>

        {/* Directions */}
        {profile?.selectedDirections && profile.selectedDirections.length > 0 && (
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
              {profile.selectedDirections.length === 1 ? 'Твоё направление' : 'Твои направления'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.selectedDirections.map((dirId: string) => (
                <div
                  key={dirId}
                  style={{
                    background: 'rgba(61, 54, 84, 0.3)',
                    border: '1px solid rgba(195, 183, 255, 0.2)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div style={{ fontSize: '22px' }}>{directions[dirId]?.split(' ')[0]}</div>
                  <div style={{ color: '#FAFAFA', fontSize: '14px', fontWeight: '500' }}>
                    {directions[dirId]?.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merch Shop */}
        {merchList && merchList.length > 0 && (
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
              🎁 Магазин мерча
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.08), rgba(152, 255, 76, 0.02))',
                border: '1px solid rgba(152, 255, 76, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Доступно баллов:</span>
                <span style={{ color: '#98FF4C', fontSize: '24px', fontWeight: '700' }}>{availablePoints}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {merchList.map((item) => {
                const canAfford = availablePoints >= item.pointsCost;
                const outOfStock = item.stock === 0;
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'rgba(61, 54, 84, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: '#FAFAFA', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                        {item.description && (
                          <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '13px', marginBottom: '8px' }}>{item.description}</div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ color: '#FCEAAA', fontSize: '16px', fontWeight: '700' }}>{item.pointsCost} баллов</span>
                          {item.stock !== -1 && (
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>Осталось: {item.stock}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (canAfford && !outOfStock && telegram) {
                            purchaseMutation.mutate({ telegram, merchId: item.id });
                          }
                        }}
                        disabled={!canAfford || outOfStock || purchaseMutation.isPending}
                        style={{
                          padding: '10px 20px',
                          background: canAfford && !outOfStock ? 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)' : 'rgba(61, 54, 84, 0.5)',
                          border: 'none',
                          borderRadius: '10px',
                          color: canAfford && !outOfStock ? '#0D0B14' : 'rgba(255,255,255,0.4)',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: canAfford && !outOfStock ? 'pointer' : 'not-allowed',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {outOfStock ? 'Нет в наличии' : !canAfford ? 'Не хватает баллов' : purchaseMutation.isPending ? '...' : 'Получить'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Promo Codes from Purchases */}
        {myPurchases && myPurchases.length > 0 && (
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
              🏷️ Твои промокоды
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myPurchases.map((p) => (
                <div
                  key={p.id}
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
                      {p.merchTitle}
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
                      {p.promoCode}
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(252, 234, 170, 0.2)',
                      color: '#FCEAAA',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    -{p.pointsSpent}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {eventsList && eventsList.length > 0 && (
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
              📅 Мероприятия
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {eventsList.map((event) => {
                const startDate = new Date(event.startTime);
                const endDate = new Date(event.endTime);
                const now = new Date();
                const isOngoing = now >= startDate && now <= endDate;
                const isPast = now > endDate;
                return (
                  <div
                    key={event.id}
                    style={{
                      background: isOngoing
                        ? 'linear-gradient(135deg, rgba(152, 255, 76, 0.1), rgba(152, 255, 76, 0.02))'
                        : 'rgba(61, 54, 84, 0.3)',
                      border: isOngoing ? '1px solid rgba(152, 255, 76, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ color: '#FAFAFA', fontSize: '15px', fontWeight: '600' }}>{event.title}</div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: isOngoing ? 'rgba(152, 255, 76, 0.2)' : isPast ? 'rgba(195, 183, 255, 0.15)' : 'rgba(252, 234, 170, 0.15)',
                          color: isOngoing ? '#98FF4C' : isPast ? '#C3B7FF' : '#FCEAAA',
                        }}
                      >
                        {isOngoing ? '● Сейчас' : isPast ? 'Завершено' : 'Скоро'}
                      </span>
                    </div>
                    {event.description && (
                      <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '13px', marginBottom: '8px' }}>{event.description}</div>
                    )}
                    <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>
                      🕐 {startDate.toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} — {endDate.toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
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
                      background: s.score === 0 
                        ? 'rgba(255, 107, 107, 0.2)' 
                        : s.score === s.totalPoints 
                          ? 'rgba(152, 255, 76, 0.2)' 
                          : 'rgba(252, 234, 170, 0.2)',
                      color: s.score === 0 
                        ? '#FF6B6B' 
                        : s.score === s.totalPoints 
                          ? '#98FF4C' 
                          : '#FCEAAA',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {s.score === 0 ? 'Не пройден' : 'Пройден'}
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


'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
  points: number;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'surveys' | 'create' | 'merch' | 'createMerch' | 'events' | 'createEvent'>('dashboard');
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false); // Закрываем меню при переходе на десктоп
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Форма создания опроса
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', answers: ['', '', '', ''], correctAnswer: 0, points: 10 },
  ]);

  // Форма создания мерча
  const [merchTitle, setMerchTitle] = useState('');
  const [merchDescription, setMerchDescription] = useState('');
  const [merchPointsCost, setMerchPointsCost] = useState(100);
  const [merchPromoPrefix, setMerchPromoPrefix] = useState('MERCH');
  const [merchStock, setMerchStock] = useState(-1);

  // Форма создания мероприятия
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartTime, setEventStartTime] = useState('');
  const [eventEndTime, setEventEndTime] = useState('');

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('x5_admin', data.username);
      setIsLoggedIn(true);
      setLoginError(null);
    },
    onError: (error) => {
      setLoginError(error.message);
    },
  });

  const { data: stats, refetch: refetchStats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const { data: scenarioStats } = trpc.scenario.getStats.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const { data: surveys, refetch: refetchSurveys } = trpc.admin.getSurveys.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const { data: playersList } = trpc.admin.getPlayers.useQuery(undefined, {
    enabled: isLoggedIn && showPlayersModal,
  });

  const createSurveyMutation = trpc.admin.createSurvey.useMutation({
    onSuccess: () => {
      setNewTitle('');
      setNewDescription('');
      setQuestions([{ question: '', answers: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
      refetchStats();
      refetchSurveys();
      setActiveTab('surveys');
    },
  });

  const deleteSurveyMutation = trpc.admin.deleteSurvey.useMutation({
    onSuccess: () => {
      refetchStats();
      refetchSurveys();
    },
  });

  const toggleSurveyMutation = trpc.admin.toggleSurvey.useMutation({
    onSuccess: () => {
      refetchStats();
      refetchSurveys();
    },
  });

  // Мерч
  const { data: merchList, refetch: refetchMerch } = trpc.merch.getAllAdmin.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const { data: merchPurchases } = trpc.merch.getAllPurchases.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const createMerchMutation = trpc.merch.create.useMutation({
    onSuccess: () => {
      setMerchTitle('');
      setMerchDescription('');
      setMerchPointsCost(100);
      setMerchPromoPrefix('MERCH');
      setMerchStock(-1);
      refetchMerch();
      setActiveTab('merch');
    },
  });

  const deleteMerchMutation = trpc.merch.delete.useMutation({
    onSuccess: () => {
      refetchMerch();
    },
  });

  const toggleMerchMutation = trpc.merch.update.useMutation({
    onSuccess: () => {
      refetchMerch();
    },
  });

  // Мероприятия
  const { data: eventsList, refetch: refetchEvents } = trpc.event.getAllAdmin.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  const createEventMutation = trpc.event.create.useMutation({
    onSuccess: () => {
      setEventTitle('');
      setEventDescription('');
      setEventStartTime('');
      setEventEndTime('');
      refetchEvents();
      setActiveTab('events');
    },
  });

  const deleteEventMutation = trpc.event.delete.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  const toggleEventMutation = trpc.event.update.useMutation({
    onSuccess: () => {
      refetchEvents();
    },
  });

  useEffect(() => {
    const admin = localStorage.getItem('x5_admin');
    if (admin) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoginError(null);
    loginMutation.mutate({ username, password });
  };

  const handleLogout = () => {
    localStorage.removeItem('x5_admin');
    setIsLoggedIn(false);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answers: ['', '', '', ''], correctAnswer: 0, points: 10 }]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number | string[]) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateAnswer = (qIndex: number, aIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = value;
    setQuestions(updated);
  };

  const handleCreateSurvey = () => {
    if (!newTitle.trim()) return;
    if (questions.some((q) => !q.question.trim() || q.answers.some((a) => !a.trim()))) return;

    createSurveyMutation.mutate({
      title: newTitle,
      description: newDescription,
      questions,
    });
  };

  const handleCreateMerch = () => {
    if (!merchTitle.trim()) return;
    createMerchMutation.mutate({
      title: merchTitle,
      description: merchDescription,
      pointsCost: merchPointsCost,
      promoCodePrefix: merchPromoPrefix,
      stock: merchStock,
    });
  };

  const handleCreateEvent = () => {
    if (!eventTitle.trim() || !eventStartTime || !eventEndTime) return;
    createEventMutation.mutate({
      title: eventTitle,
      description: eventDescription,
      startTime: eventStartTime,
      endTime: eventEndTime,
    });
  };

  // Экран логина
  if (!isLoggedIn) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #0D0B14 0%, #1a1625 50%, #0D0B14 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(61, 54, 84, 0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '400px',
            margin: '20px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 32px rgba(152, 255, 76, 0.3)',
              }}
            >
              <span style={{ fontWeight: '800', fontSize: '24px', color: '#0D0B14' }}>X5</span>
            </div>
            <h1 style={{ color: '#FAFAFA', fontSize: '24px', margin: 0, fontWeight: '600' }}>
              Админ-панель
            </h1>
            <p style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '14px', marginTop: '8px' }}>
              Войдите для доступа
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Логин
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
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

            <div>
              <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
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

            {loginError && (
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
                {loginError}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
                border: 'none',
                borderRadius: '12px',
                color: '#0D0B14',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '8px',
              }}
            >
              {loginMutation.isPending ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Навигационные пункты
  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: '📊' },
    { id: 'surveys', label: 'Опросы', icon: '📋' },
    { id: 'create', label: 'Создать опрос', icon: '➕' },
    { id: 'merch', label: 'Мерч', icon: '🎁' },
    { id: 'createMerch', label: 'Добавить мерч', icon: '🏷️' },
    { id: 'events', label: 'Мероприятия', icon: '📅' },
    { id: 'createEvent', label: 'Добавить событие', icon: '🗓️' },
  ];

  // Главный интерфейс админки
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0D0B14 0%, #1a1625 50%, #0D0B14 100%)',
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
      }}
    >
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            zIndex: 99,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          minHeight: '100vh',
          background: 'rgba(13, 11, 20, 0.98)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: isMobile ? (sidebarOpen ? 0 : '-260px') : 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          transition: 'left 0.3s ease',
          boxShadow: isMobile && sidebarOpen ? '4px 0 20px rgba(0, 0, 0, 0.5)' : 'none',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '24px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
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
              <div style={{ color: '#FAFAFA', fontWeight: '700', fontSize: '16px' }}>Admin Panel</div>
              <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '11px' }}>Управление системой</div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '8px', padding: '0 8px', color: 'rgba(195, 183, 255, 0.4)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '600' }}>
            Меню
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as typeof activeTab);
                if (isMobile) setSidebarOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                marginBottom: '4px',
                background: activeTab === item.id ? 'linear-gradient(135deg, rgba(152, 255, 76, 0.15), rgba(152, 255, 76, 0.05))' : 'transparent',
                border: activeTab === item.id ? '1px solid rgba(152, 255, 76, 0.2)' : '1px solid transparent',
                borderRadius: '10px',
                color: activeTab === item.id ? '#98FF4C' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(248, 113, 113, 0.1)',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              borderRadius: '10px',
              color: '#F87171',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: isMobile ? 0 : '260px', minHeight: '100vh', transition: 'margin-left 0.3s ease' }}>
        {/* Header */}
        <header
          style={{
            padding: isMobile ? '16px 20px' : '20px 32px',
            background: 'rgba(13, 11, 20, 0.6)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'rgba(61, 54, 84, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px 12px',
                color: '#FAFAFA',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ☰
            </button>
          )}
          <h1 style={{ margin: 0, color: '#FAFAFA', fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
            {navItems.find((n) => n.id === activeTab)?.icon} {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
        </header>

        {/* Content */}
        <div style={{ padding: isMobile ? '20px 16px' : '32px', maxWidth: '1200px' }}>
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            {/* Scenario Conversion Card */}
            {scenarioStats && (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(152, 255, 76, 0.1), rgba(152, 255, 76, 0.02))',
                  border: '1px solid rgba(152, 255, 76, 0.3)',
                  borderRadius: '16px',
                  padding: isMobile ? '16px' : '24px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '12px' : '16px', marginBottom: '16px' }}>
                  <div>
                    <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                      Конверсия сценария
                    </div>
                    <div style={{ color: '#98FF4C', fontSize: isMobile ? '36px' : '48px', fontWeight: '800' }}>
                      {scenarioStats.conversionRate}%
                    </div>
                  </div>
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <div style={{ color: '#FAFAFA', fontSize: isMobile ? '18px' : '24px', fontWeight: '700' }}>
                      {scenarioStats.registeredCount} / {scenarioStats.totalCompletions}
                    </div>
                    <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>
                      зарегались / прошли сценарий
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '8px' : '16px' }}>
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>Зарегистрировались</div>
                    <div style={{ color: '#98FF4C', fontSize: isMobile ? '18px' : '20px', fontWeight: '700' }}>{scenarioStats.registeredCount}</div>
                  </div>
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>Не зарегистрировались</div>
                    <div style={{ color: '#F87171', fontSize: isMobile ? '18px' : '20px', fontWeight: '700' }}>{scenarioStats.notRegisteredCount}</div>
                  </div>
                  <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>Всего прошли</div>
                    <div style={{ color: '#C3B7FF', fontSize: isMobile ? '18px' : '20px', fontWeight: '700' }}>{scenarioStats.totalCompletions}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(160px, 1fr))', gap: isMobile ? '10px' : '16px', marginBottom: '24px' }}>
              {[
                { label: 'Опросов', value: stats.totalSurveys, color: '#98FF4C', clickable: false },
                { label: 'Активных', value: stats.activeSurveys, color: '#7ACC3D', clickable: false },
                { label: 'Прохождений', value: stats.totalResults, color: '#C3B7FF', clickable: false },
                { label: 'Успешных', value: stats.passedResults, color: '#98FF4C', clickable: false },
                { label: 'Pass Rate', value: `${stats.passRate}%`, color: '#FCEAAA', clickable: false },
                { label: 'Студентов', value: stats.totalPlayers, color: '#F8CCC7', clickable: true },
              ].map((stat, i) => (
                <div
                  key={i}
                  onClick={stat.clickable ? () => setShowPlayersModal(true) : undefined}
                  style={{
                    background: 'rgba(61, 54, 84, 0.3)',
                    border: stat.clickable ? '1px solid rgba(248, 204, 199, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: isMobile ? '12px' : '16px',
                    padding: isMobile ? '14px' : '20px',
                    cursor: stat.clickable ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: isMobile ? '10px' : '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    {stat.label} {stat.clickable && '→'}
                  </div>
                  <div style={{ color: stat.color, fontSize: isMobile ? '24px' : '32px', fontWeight: '700' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Survey Stats Table / Cards */}
            <div
              style={{
                background: 'rgba(61, 54, 84, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: isMobile ? '12px' : '16px',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: isMobile ? '12px 16px' : '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <h3 style={{ margin: 0, color: '#FAFAFA', fontSize: isMobile ? '14px' : '16px', fontWeight: '600' }}>Статистика по опросам</h3>
              </div>
              {isMobile ? (
                // Мобильный вид - карточки
                <div style={{ padding: '12px' }}>
                  {stats.surveyStats.map((survey) => (
                    <div
                      key={survey.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                        padding: '12px',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: survey.isActive ? '#98FF4C' : '#F87171' }} />
                        <span style={{ color: '#FAFAFA', fontSize: '14px', fontWeight: '500' }}>{survey.title}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
                        <div><span style={{ color: 'rgba(195, 183, 255, 0.5)' }}>Попыток</span><br/><span style={{ color: '#FAFAFA' }}>{survey.totalAttempts}</span></div>
                        <div><span style={{ color: 'rgba(195, 183, 255, 0.5)' }}>Успех</span><br/><span style={{ color: '#98FF4C' }}>{survey.passedCount}</span></div>
                        <div><span style={{ color: 'rgba(195, 183, 255, 0.5)' }}>Rate</span><br/><span style={{ color: '#FCEAAA' }}>{survey.passRate}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Десктопный вид - таблица
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Название</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Вопросов</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Попыток</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Успешных</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Pass Rate</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Ср. балл</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.surveyStats.map((survey) => (
                        <tr key={survey.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: survey.isActive ? '#98FF4C' : '#F87171' }} />
                              {survey.title}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '14px', textAlign: 'center' }}>{survey.questionsCount}</td>
                          <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '14px', textAlign: 'center' }}>{survey.totalAttempts}</td>
                          <td style={{ padding: '14px 16px', color: '#98FF4C', fontSize: '14px', textAlign: 'center' }}>{survey.passedCount}</td>
                          <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '14px', textAlign: 'center' }}>{survey.passRate}%</td>
                          <td style={{ padding: '14px 16px', color: '#C3B7FF', fontSize: '14px', textAlign: 'center' }}>{survey.avgScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Surveys Tab */}
        {activeTab === 'surveys' && surveys && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {surveys.length === 0 ? (
              <div
                style={{
                  background: 'rgba(61, 54, 84, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Опросов пока нет</div>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    marginTop: '16px',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0D0B14',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Создать первый опрос
                </button>
              </div>
            ) : (
              surveys.map((survey) => (
                <div
                  key={survey._id.toString()}
                  style={{
                    background: 'rgba(61, 54, 84, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '20px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '16px' }}>
                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, color: '#FAFAFA', fontSize: '18px', fontWeight: '600', wordBreak: 'break-word' }}>{survey.title}</h3>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            background: survey.isActive ? 'rgba(152, 255, 76, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                            color: survey.isActive ? '#98FF4C' : '#F87171',
                          }}
                        >
                          {survey.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                      </div>
                      {survey.description && (
                        <p style={{ margin: 0, color: 'rgba(195, 183, 255, 0.6)', fontSize: '14px', wordBreak: 'break-word', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{survey.description}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => toggleSurveyMutation.mutate({ id: survey._id.toString() })}
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(195, 183, 255, 0.1)',
                          border: '1px solid rgba(195, 183, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#C3B7FF',
                          fontSize: '13px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {survey.isActive ? 'Выкл' : 'Вкл'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Удалить опрос?')) {
                            deleteSurveyMutation.mutate({ id: survey._id.toString() });
                          }
                        }}
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(248, 113, 113, 0.15)',
                          border: '1px solid rgba(248, 113, 113, 0.3)',
                          borderRadius: '8px',
                          color: '#F87171',
                          fontSize: '13px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                  <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '13px' }}>
                    {survey.questions.length} вопросов
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Survey Tab */}
        {activeTab === 'create' && (
          <div
            style={{
              background: 'rgba(61, 54, 84, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h2 style={{ margin: '0 0 24px', color: '#FAFAFA', fontSize: '20px', fontWeight: '600' }}>Создание опроса</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Название опроса *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Тест по JavaScript"
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

              {/* Description */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Описание
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Краткое описание опроса"
                  rows={2}
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
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Questions */}
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Вопросы *
                </label>

                {questions.map((q, qIndex) => (
                  <div
                    key={qIndex}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ color: '#98FF4C', fontSize: '14px', fontWeight: '600' }}>Вопрос {qIndex + 1}</span>
                      {questions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(qIndex)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#F87171',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}
                        >
                          Удалить
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                      placeholder="Текст вопроса"
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        background: 'rgba(61, 54, 84, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        color: '#FAFAFA',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '12px',
                      }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {q.answers.map((a, aIndex) => (
                        <div key={aIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="radio"
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === aIndex}
                            onChange={() => updateQuestion(qIndex, 'correctAnswer', aIndex)}
                            style={{ accentColor: '#98FF4C' }}
                          />
                          <input
                            type="text"
                            value={a}
                            onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                            placeholder={`Ответ ${aIndex + 1}`}
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              background: 'rgba(61, 54, 84, 0.4)',
                              border: q.correctAnswer === aIndex ? '1px solid rgba(152, 255, 76, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '8px',
                              color: '#FAFAFA',
                              fontSize: '13px',
                              outline: 'none',
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '13px' }}>Баллы:</label>
                      <input
                        type="number"
                        value={q.points}
                        onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 10)}
                        min={1}
                        style={{
                          width: '80px',
                          padding: '8px 12px',
                          background: 'rgba(61, 54, 84, 0.4)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#FAFAFA',
                          fontSize: '14px',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addQuestion}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(195, 183, 255, 0.1)',
                    border: '1px dashed rgba(195, 183, 255, 0.3)',
                    borderRadius: '10px',
                    color: '#C3B7FF',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  + Добавить вопрос
                </button>
              </div>

              {/* Submit */}
              <button
                onClick={handleCreateSurvey}
                disabled={createSurveyMutation.isPending || !newTitle.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#0D0B14',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  opacity: !newTitle.trim() ? 0.5 : 1,
                }}
              >
                {createSurveyMutation.isPending ? 'Создание...' : 'Создать опрос'}
              </button>
            </div>
          </div>
        )}

        {/* Merch Tab */}
        {activeTab === 'merch' && merchList && (
          <div>
            {/* Merch Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Всего товаров</div>
                <div style={{ color: '#98FF4C', fontSize: '32px', fontWeight: '700' }}>{merchList.length}</div>
              </div>
              <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                <div style={{ color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Покупок</div>
                <div style={{ color: '#C3B7FF', fontSize: '32px', fontWeight: '700' }}>{merchPurchases?.length || 0}</div>
              </div>
            </div>

            {/* Merch List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <h3 style={{ color: '#FAFAFA', fontSize: '18px', fontWeight: '600', margin: 0 }}>Товары</h3>
              {merchList.length === 0 ? (
                <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Товаров пока нет</div>
                  <button onClick={() => setActiveTab('createMerch')} style={{ marginTop: '16px', padding: '12px 24px', background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)', border: 'none', borderRadius: '10px', color: '#0D0B14', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    Добавить первый товар
                  </button>
                </div>
              ) : (
                merchList.map((item) => (
                  <div key={item.id} style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, color: '#FAFAFA', fontSize: '16px', fontWeight: '600' }}>{item.title}</h4>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', background: item.isActive ? 'rgba(152, 255, 76, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: item.isActive ? '#98FF4C' : '#F87171' }}>
                            {item.isActive ? 'Активен' : 'Неактивен'}
                          </span>
                        </div>
                        {item.description && <p style={{ margin: '0 0 8px', color: 'rgba(195, 183, 255, 0.6)', fontSize: '14px' }}>{item.description}</p>}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(195, 183, 255, 0.5)' }}>
                          <span>💰 {item.pointsCost} баллов</span>
                          <span>📦 {item.stock === -1 ? '∞' : item.stock} шт.</span>
                          <span>🏷️ {item.promoCodePrefix}-***</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button onClick={() => toggleMerchMutation.mutate({ id: item.id, isActive: !item.isActive })} style={{ padding: '8px 14px', background: 'rgba(195, 183, 255, 0.1)', border: '1px solid rgba(195, 183, 255, 0.2)', borderRadius: '8px', color: '#C3B7FF', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {item.isActive ? 'Выкл' : 'Вкл'}
                        </button>
                        <button onClick={() => { if (confirm('Удалить товар?')) deleteMerchMutation.mutate({ id: item.id }); }} style={{ padding: '8px 14px', background: 'rgba(248, 113, 113, 0.15)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Purchase History */}
            {merchPurchases && merchPurchases.length > 0 && (
              <div>
                <h3 style={{ color: '#FAFAFA', fontSize: '18px', fontWeight: '600', margin: '0 0 16px' }}>История покупок</h3>
                <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Студент</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Товар</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Баллов</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Промокод</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', textTransform: 'uppercase' }}>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {merchPurchases.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '14px 16px', color: '#98FF4C', fontSize: '14px' }}>{p.playerTelegram}</td>
                          <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '14px' }}>{p.merchTitle}</td>
                          <td style={{ padding: '14px 16px', color: '#FCEAAA', fontSize: '14px', textAlign: 'center' }}>{p.pointsSpent}</td>
                          <td style={{ padding: '14px 16px', color: '#C3B7FF', fontSize: '14px', fontFamily: 'monospace' }}>{p.promoCode}</td>
                          <td style={{ padding: '14px 16px', color: 'rgba(195, 183, 255, 0.5)', fontSize: '13px' }}>{new Date(p.createdAt).toLocaleString('ru')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create Merch Tab */}
        {activeTab === 'createMerch' && (
          <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ margin: '0 0 24px', color: '#FAFAFA', fontSize: '20px', fontWeight: '600' }}>Добавление мерча</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Название товара *
                </label>
                <input
                  type="text"
                  value={merchTitle}
                  onChange={(e) => setMerchTitle(e.target.value)}
                  placeholder="Например: Футболка X5"
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Описание
                </label>
                <textarea
                  value={merchDescription}
                  onChange={(e) => setMerchDescription(e.target.value)}
                  placeholder="Описание товара"
                  rows={2}
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Стоимость (баллы) *
                  </label>
                  <input
                    type="number"
                    value={merchPointsCost}
                    onChange={(e) => setMerchPointsCost(parseInt(e.target.value) || 100)}
                    min={1}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Количество (-1 = безлимит)
                  </label>
                  <input
                    type="number"
                    value={merchStock}
                    onChange={(e) => setMerchStock(parseInt(e.target.value))}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Префикс промокода
                </label>
                <input
                  type="text"
                  value={merchPromoPrefix}
                  onChange={(e) => setMerchPromoPrefix(e.target.value.toUpperCase())}
                  placeholder="MERCH"
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }}
                />
                <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px', marginTop: '6px' }}>
                  Промокод будет вида: {merchPromoPrefix || 'MERCH'}-XXXXXX
                </div>
              </div>

              <button
                onClick={handleCreateMerch}
                disabled={createMerchMutation.isPending || !merchTitle.trim()}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)', border: 'none', borderRadius: '12px', color: '#0D0B14', fontSize: '15px', fontWeight: '600', cursor: 'pointer', opacity: !merchTitle.trim() ? 0.5 : 1 }}
              >
                {createMerchMutation.isPending ? 'Создание...' : 'Добавить товар'}
              </button>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && eventsList && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {eventsList.length === 0 ? (
              <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}>Мероприятий пока нет</div>
                <button onClick={() => setActiveTab('createEvent')} style={{ marginTop: '16px', padding: '12px 24px', background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)', border: 'none', borderRadius: '10px', color: '#0D0B14', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Добавить первое мероприятие
                </button>
              </div>
            ) : (
              eventsList.map((event) => {
                const startDate = new Date(event.startTime);
                const endDate = new Date(event.endTime);
                const now = new Date();
                const isOngoing = now >= startDate && now <= endDate;
                const isPast = now > endDate;
                return (
                  <div key={event.id} style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, color: '#FAFAFA', fontSize: '16px', fontWeight: '600' }}>{event.title}</h4>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', background: !event.isActive ? 'rgba(248, 113, 113, 0.15)' : isOngoing ? 'rgba(152, 255, 76, 0.15)' : isPast ? 'rgba(195, 183, 255, 0.15)' : 'rgba(252, 234, 170, 0.15)', color: !event.isActive ? '#F87171' : isOngoing ? '#98FF4C' : isPast ? '#C3B7FF' : '#FCEAAA' }}>
                            {!event.isActive ? 'Неактивно' : isOngoing ? 'Идёт сейчас' : isPast ? 'Завершено' : 'Скоро'}
                          </span>
                        </div>
                        {event.description && <p style={{ margin: '0 0 8px', color: 'rgba(195, 183, 255, 0.6)', fontSize: '14px' }}>{event.description}</p>}
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'rgba(195, 183, 255, 0.5)' }}>
                          <span>🕐 {startDate.toLocaleString('ru')}</span>
                          <span>→</span>
                          <span>{endDate.toLocaleString('ru')}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button onClick={() => toggleEventMutation.mutate({ id: event.id, isActive: !event.isActive })} style={{ padding: '8px 14px', background: 'rgba(195, 183, 255, 0.1)', border: '1px solid rgba(195, 183, 255, 0.2)', borderRadius: '8px', color: '#C3B7FF', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          {event.isActive ? 'Выкл' : 'Вкл'}
                        </button>
                        <button onClick={() => { if (confirm('Удалить мероприятие?')) deleteEventMutation.mutate({ id: event.id }); }} style={{ padding: '8px 14px', background: 'rgba(248, 113, 113, 0.15)', border: '1px solid rgba(248, 113, 113, 0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Create Event Tab */}
        {activeTab === 'createEvent' && (
          <div style={{ background: 'rgba(61, 54, 84, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            <h2 style={{ margin: '0 0 24px', color: '#FAFAFA', fontSize: '20px', fontWeight: '600' }}>Добавление мероприятия</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Название мероприятия *
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Например: Воркшоп по React"
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Описание
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Описание мероприятия"
                  rows={3}
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Начало *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(195, 183, 255, 0.7)', fontSize: '12px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Окончание *
                  </label>
                  <input
                    type="datetime-local"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(61, 54, 84, 0.4)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', color: '#FAFAFA', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                onClick={handleCreateEvent}
                disabled={createEventMutation.isPending || !eventTitle.trim() || !eventStartTime || !eventEndTime}
                style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)', border: 'none', borderRadius: '12px', color: '#0D0B14', fontSize: '15px', fontWeight: '600', cursor: 'pointer', opacity: (!eventTitle.trim() || !eventStartTime || !eventEndTime) ? 0.5 : 1 }}
              >
                {createEventMutation.isPending ? 'Создание...' : 'Добавить мероприятие'}
              </button>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Players Modal */}
      {showPlayersModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: isMobile ? 0 : '20px',
          }}
          onClick={() => setShowPlayersModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #1a1625 0%, #0D0B14 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: isMobile ? '20px 20px 0 0' : '24px',
              width: '100%',
              maxWidth: isMobile ? '100%' : '900px',
              maxHeight: isMobile ? '90vh' : '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: isMobile ? '16px' : '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: '#FAFAFA', fontSize: isMobile ? '18px' : '20px', fontWeight: '600' }}>
                  👥 Студенты
                </h2>
                <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px', marginTop: '4px' }}>
                  Всего: {playersList?.length || 0}
                </div>
              </div>
              <button
                onClick={() => setShowPlayersModal(false)}
                style={{
                  background: 'rgba(248, 113, 113, 0.15)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: '10px',
                  padding: isMobile ? '8px 12px' : '8px 16px',
                  color: '#F87171',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {isMobile ? '✕' : 'Закрыть'}
              </button>
            </div>

            {/* Content */}
            <div style={{ overflow: 'auto', flex: 1 }}>
              {!playersList ? (
                <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  Загрузка...
                </div>
              ) : playersList.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)' }}>Студентов пока нет</div>
                </div>
              ) : isMobile ? (
                // Мобильный вид - карточки
                <div style={{ padding: '12px' }}>
                  {playersList.map((player) => (
                    <div
                      key={player.id}
                      style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: '12px',
                        padding: '14px',
                        marginBottom: '10px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ color: '#98FF4C', fontSize: '15px', fontWeight: '600' }}>{player.telegram}</div>
                          <div style={{ color: 'rgba(195, 183, 255, 0.5)', fontSize: '12px' }}>{player.university}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#FCEAAA', fontSize: '18px', fontWeight: '700' }}>{player.totalPoints}</div>
                          <div style={{ color: 'rgba(195, 183, 255, 0.4)', fontSize: '11px' }}>баллов</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                        <span style={{ color: 'rgba(195, 183, 255, 0.5)' }}>Курс: <span style={{ color: '#C3B7FF' }}>{player.course}</span></span>
                        <span style={{ color: 'rgba(195, 183, 255, 0.5)' }}>Опросов: <span style={{ color: '#C3B7FF' }}>{player.completedSurveys}</span></span>
                      </div>
                      {player.selectedDirections.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                          {player.selectedDirections.map((d: string, i: number) => (
                            <span key={i} style={{ background: 'rgba(152, 255, 76, 0.1)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', color: 'rgba(195, 183, 255, 0.7)' }}>{d}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Десктопный вид - таблица
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Telegram</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>ВУЗ</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Курс</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Направления</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Баллы</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Опросов</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', color: 'rgba(195, 183, 255, 0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {playersList.map((player) => (
                      <tr key={player.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '14px 16px', color: '#98FF4C', fontSize: '14px', fontWeight: '500' }}>{player.telegram}</td>
                        <td style={{ padding: '14px 16px', color: '#FAFAFA', fontSize: '13px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.university}</td>
                        <td style={{ padding: '14px 16px', color: '#C3B7FF', fontSize: '14px', textAlign: 'center' }}>{player.course}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(195, 183, 255, 0.6)', fontSize: '12px', maxWidth: '200px' }}>
                          {player.selectedDirections.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {player.selectedDirections.slice(0, 2).map((d: string, i: number) => (
                                <span key={i} style={{ background: 'rgba(152, 255, 76, 0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{d}</span>
                              ))}
                              {player.selectedDirections.length > 2 && (
                                <span style={{ color: 'rgba(195, 183, 255, 0.4)', fontSize: '11px' }}>+{player.selectedDirections.length - 2}</span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: 'rgba(195, 183, 255, 0.3)' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#FCEAAA', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>{player.totalPoints}</td>
                        <td style={{ padding: '14px 16px', color: '#C3B7FF', fontSize: '14px', textAlign: 'center' }}>{player.completedSurveys}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(195, 183, 255, 0.4)', fontSize: '12px' }}>{new Date(player.createdAt).toLocaleDateString('ru')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


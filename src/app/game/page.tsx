'use client';

import { useState, useEffect } from 'react';
import { Container, Stack, Title, Group, Button } from '@mantine/core';
import { GameScene } from '@/components/game/GameScene';
import { QuestCard, Quest } from '@/components/game/QuestCard';
import { ProgressBar } from '@/components/game/ProgressBar';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';

// Моковые данные квестов (позже можно подключить к бэкенду)
const initialQuests: Quest[] = [
  {
    id: 1,
    title: 'Первые шаги',
    description: 'Взаимодействуй с объектом в 3D сцене',
    type: 'interactive',
    progress: 0,
    maxProgress: 1,
    completed: false,
    xp: 10,
  },
  {
    id: 2,
    title: 'Исследователь',
    description: 'Изучи все углы сцены',
    type: 'challenge',
    progress: 0,
    maxProgress: 3,
    completed: false,
    xp: 25,
  },
  {
    id: 3,
    title: 'Мастер',
    description: 'Заверши все предыдущие квесты',
    type: 'challenge',
    progress: 0,
    maxProgress: 2,
    completed: false,
    xp: 50,
  },
];

export default function GamePage() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [activeQuestId, setActiveQuestId] = useState<number | null>(null);
  const [currentXP, setCurrentXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(1);

  const levelXP = level * 100; // XP необходимое для уровня

  const handleQuestStart = (questId: number) => {
    setActiveQuestId(questId);
  };

  const handleQuestComplete = (questId: number) => {
    setQuests((prevQuests) => {
      const updated = prevQuests.map((q) => {
        if (q.id === questId) {
          const newProgress = q.progress + 1;
          const completed = newProgress >= q.maxProgress;
          
          if (completed && !q.completed) {
            // Начисляем XP только при первом завершении
            setCurrentXP((prev) => {
              const newXP = prev + q.xp;
              // Проверяем повышение уровня
              if (newXP >= levelXP) {
                setLevel((prev) => prev + 1);
                return newXP % levelXP;
              }
              return newXP;
            });
          }
          
          return {
            ...q,
            progress: newProgress,
            completed: completed,
          };
        }
        return q;
      });
      return updated;
    });
    
    // Закрываем активный квест через небольшую задержку
    setTimeout(() => {
      setActiveQuestId(null);
    }, 1000);
  };

  return (
    <Container size="xl" py="xl" style={{ minHeight: '100vh' }}>
      <Stack gap="xl">
        {/* Заголовок */}
        <Group justify="space-between" align="center">
          <Group>
            <Link href="/">
              <Button variant="subtle" leftSection={<IconArrowLeft size={16} />}>
                Назад
              </Button>
            </Link>
            <Title order={1} c="dark">
              Квест-игра X5 Tech
            </Title>
          </Group>
        </Group>

        {/* Прогресс-бар */}
        <ProgressBar 
          currentXP={currentXP} 
          levelXP={levelXP} 
          level={level} 
          streak={streak}
        />

        {/* Основной контент */}
        <Group align="flex-start" gap="lg">
          {/* 3D Сцена */}
          <div style={{ 
            flex: 1, 
            minHeight: '600px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <GameScene 
              currentQuest={activeQuestId || undefined}
              onQuestComplete={handleQuestComplete}
            />
          </div>

          {/* Список квестов */}
          <div style={{ width: '400px' }}>
            <Title order={2} size="h3" mb="md">
              Квесты
            </Title>
            <Stack gap="md">
              {quests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  isActive={activeQuestId === quest.id}
                  onStart={() => handleQuestStart(quest.id)}
                />
              ))}
            </Stack>
          </div>
        </Group>
      </Stack>
    </Container>
  );
}


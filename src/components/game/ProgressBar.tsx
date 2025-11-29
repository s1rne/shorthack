'use client';

import { Progress, Group, Text, Badge } from '@mantine/core';
import { IconTrophy, IconFlame } from '@tabler/icons-react';

interface ProgressBarProps {
  currentXP: number;
  levelXP: number;
  level: number;
  streak?: number;
}

export function ProgressBar({ currentXP, levelXP, level, streak = 0 }: ProgressBarProps) {
  const progressPercent = (currentXP / levelXP) * 100;

  return (
    <div style={{ width: '100%', padding: '1rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconTrophy size={24} color="#f59e0b" />
          <Text fw={700} size="xl">
            Уровень {level}
          </Text>
        </Group>
        {streak > 0 && (
          <Badge color="orange" size="lg" variant="light">
            <IconFlame size={16} style={{ marginRight: 4 }} />
            Серия: {streak} дней
          </Badge>
        )}
      </Group>
      
      <Progress 
        value={progressPercent} 
        color="gradient" 
        size="xl" 
        radius="xl"
        animated
        style={{ marginBottom: '0.5rem' }}
      />
      
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          {currentXP} / {levelXP} XP
        </Text>
        <Text size="sm" c="dimmed" fw={500}>
          До следующего уровня: {levelXP - currentXP} XP
        </Text>
      </Group>
    </div>
  );
}


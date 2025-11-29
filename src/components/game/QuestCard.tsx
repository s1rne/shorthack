'use client';

import { Card, Text, Badge, Progress, Button, Stack, Group } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface Quest {
  id: number;
  title: string;
  description: string;
  type: 'interactive' | 'quiz' | 'challenge';
  progress: number;
  maxProgress: number;
  completed: boolean;
  xp: number;
}

interface QuestCardProps {
  quest: Quest;
  onStart?: () => void;
  isActive?: boolean;
}

export function QuestCard({ quest, onStart, isActive }: QuestCardProps) {
  const progressPercent = (quest.progress / quest.maxProgress) * 100;

  return (
    <Card
      shadow="md"
      padding="lg"
      radius="md"
      withBorder
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : quest.completed 
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'white',
        color: isActive || quest.completed ? 'white' : 'inherit',
        cursor: !quest.completed ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
      onClick={!quest.completed && onStart ? onStart : undefined}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <div style={{ flex: 1 }}>
            <Group gap="xs" mb="xs">
              <Text fw={700} size="lg" c={isActive || quest.completed ? 'white' : 'dark'}>
                {quest.title}
              </Text>
              {quest.completed && (
                <Badge color="green" variant="light" size="lg">
                  <IconCheck size={14} style={{ marginRight: 4 }} />
                  Завершено
                </Badge>
              )}
            </Group>
            <Text size="sm" c={isActive || quest.completed ? 'white' : 'dimmed'} mb="md">
              {quest.description}
            </Text>
          </div>
          <Badge 
            size="lg" 
            variant="light"
            color={isActive || quest.completed ? 'white' : 'blue'}
          >
            +{quest.xp} XP
          </Badge>
        </Group>

        {!quest.completed && (
          <>
            <Progress 
              value={progressPercent} 
              color={isActive ? 'white' : 'blue'} 
              size="md" 
              radius="xl"
              animated
            />
            <Text size="xs" c={isActive || quest.completed ? 'white' : 'dimmed'}>
              {quest.progress} / {quest.maxProgress} выполнено
            </Text>
          </>
        )}

        {isActive && !quest.completed && onStart && (
          <Button 
            fullWidth 
            variant="light" 
            color="white"
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
          >
            Начать квест
          </Button>
        )}
      </Stack>
    </Card>
  );
}


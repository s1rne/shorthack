'use client';

import { useState } from 'react';
import { Container, Title, Text, TextInput, Button, Stack, Card, Group, ActionIcon } from '@mantine/core';
import { trpc } from '@/lib/trpc/client';
import { IconTrash } from '@tabler/icons-react';

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.user.getAll.useQuery();
  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      setName('');
      setEmail('');
    },
  });
  const deleteUser = trpc.user.delete.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      createUser.mutate({ name, email });
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Shorthack</Title>
          <Text c="dimmed" size="lg" mt="xs">
            Простое одностраничное приложение с Next.js, tRPC, Mantine и MongoDB
          </Text>
        </div>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} size="h3" mb="md">
            Добавить пользователя
          </Title>
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Имя"
                placeholder="Введите имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextInput
                label="Email"
                placeholder="Введите email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={createUser.isPending}>
                Добавить
              </Button>
            </Stack>
          </form>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2} size="h3" mb="md">
            Список пользователей
          </Title>
          {isLoading ? (
            <Text c="dimmed">Загрузка...</Text>
          ) : users && users.length > 0 ? (
            <Stack gap="sm">
              {users.map((user) => (
                <Group key={user._id.toString()} justify="space-between" p="sm" style={{ border: '1px solid #dee2e6', borderRadius: '4px' }}>
                  <div>
                    <Text fw={500}>{user.name}</Text>
                    <Text size="sm" c="dimmed">
                      {user.email}
                    </Text>
                  </div>
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => deleteUser.mutate({ id: user._id.toString() })}
                    loading={deleteUser.isPending}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          ) : (
            <Text c="dimmed">Пользователей пока нет</Text>
          )}
        </Card>
      </Stack>
    </Container>
  );
}


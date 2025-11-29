"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Text,
  TextInput,
  Button,
  Stack,
  Group,
  ActionIcon,
  Box,
  Badge,
  Flex,
} from "@mantine/core";
import { trpc } from "@/lib/trpc/client";
import {
  IconTrash,
  IconPlus,
  IconUsers,
  IconSparkles,
  IconArrowRight,
} from "@tabler/icons-react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.user.getAll.useQuery();
  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      utils.user.getAll.invalidate();
      setName("");
      setEmail("");
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
    <>
      {/* Декоративные элементы фона */}
      <div className="main-gradient" />
      <div className="grid-overlay" />
      <div className="floating-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>

      {/* Header */}
      <Box
        component="header"
        py={20}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: "rgba(13, 11, 20, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <Group gap={12}>
              <Box
                style={{
                  width: 44,
                  height: 44,
                  background:
                    "linear-gradient(135deg, #98FF4C 0%, #7ACC3D 100%)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(152, 255, 76, 0.3)",
                }}
              >
                <Text fw={800} c="#0D0B14" size="xl">
                  S
                </Text>
              </Box>
              <Box>
                <Text
                  fw={700}
                  size="lg"
                  c="#FAFAFA"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  shorthack
                </Text>
                <Text size="xs" c="rgba(195, 183, 255, 0.6)">
                  powered by x5.tech
                </Text>
              </Box>
            </Group>

            <Group gap={8}>
              <Badge
                size="lg"
                radius="md"
                style={{
                  background: "rgba(152, 255, 76, 0.1)",
                  color: "#98FF4C",
                  border: "1px solid rgba(152, 255, 76, 0.2)",
                  fontWeight: 500,
                }}
              >
                <Group gap={6}>
                  <IconSparkles size={14} />
                  beta
                </Group>
              </Badge>
            </Group>
          </Group>
        </Container>
      </Box>

      <Container
        size="xl"
        pt={140}
        pb={80}
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* Hero Section */}
        <Box mb={100} className="animate-slide-up">
          <Flex gap={8} align="center" mb={32}>
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#98FF4C",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            />
            <Text
              size="sm"
              fw={500}
              style={{
                color: "rgba(152, 255, 76, 0.8)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Next.js • tRPC • MongoDB • Mantine
            </Text>
          </Flex>

          <Title
            order={1}
            mb={32}
            style={{
              fontSize: "clamp(48px, 8vw, 88px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            <Text component="span" c="#FAFAFA">
              Создавайте
            </Text>
            <br />
            <Text component="span" className="gradient-text">
              будущее
            </Text>
            <br />
            <Text component="span" c="rgba(250, 250, 250, 0.6)">
              сегодня
            </Text>
          </Title>

          <Text
            c="rgba(250, 250, 250, 0.5)"
            size="xl"
            maw={550}
            mb={40}
            style={{
              lineHeight: 1.8,
              letterSpacing: "-0.01em",
            }}
          >
            Современный стек технологий для создания масштабируемых приложений
            нового поколения
          </Text>

          <Group gap={16}>
            <Button
              size="xl"
              radius="xl"
              className="neon-button"
              rightSection={<IconArrowRight size={20} />}
              style={{
                height: 56,
                paddingInline: 32,
                fontSize: 16,
              }}
            >
              Начать сейчас
            </Button>
            <Button
              size="xl"
              radius="xl"
              variant="outline"
              style={{
                height: 56,
                paddingInline: 32,
                fontSize: 16,
                borderColor: "rgba(195, 183, 255, 0.3)",
                color: "#C3B7FF",
              }}
            >
              Документация
            </Button>
          </Group>
        </Box>

        <Stack gap={32}>
          {/* Форма добавления */}
          <Box className="glass-card animate-slide-up delay-1" p={40}>
            <Group gap={20} mb={32}>
              <Box
                style={{
                  width: 56,
                  height: 56,
                  background:
                    "linear-gradient(135deg, rgba(152, 255, 76, 0.15) 0%, rgba(152, 255, 76, 0.05) 100%)",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(152, 255, 76, 0.2)",
                }}
              >
                <IconPlus size={28} color="#98FF4C" />
              </Box>
              <div>
                <Title
                  order={2}
                  size={28}
                  c="#FAFAFA"
                  fw={600}
                  style={{ letterSpacing: "-0.02em" }}
                >
                  Новый пользователь
                </Title>
                <Text c="rgba(195, 183, 255, 0.6)" size="md" mt={4}>
                  Добавьте участника в систему
                </Text>
              </div>
            </Group>

            <form onSubmit={handleSubmit}>
              <Flex gap={16} mb={24} direction={{ base: "column", sm: "row" }}>
                <TextInput
                  placeholder="Введите имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  size="xl"
                  radius={16}
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      backgroundColor: "rgba(61, 54, 84, 0.3)",
                      color: "#FAFAFA",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: 16,
                      height: 60,
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "rgba(152, 255, 76, 0.5)",
                        backgroundColor: "rgba(61, 54, 84, 0.5)",
                      },
                    },
                  }}
                />
                <TextInput
                  placeholder="Введите email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  size="xl"
                  radius={16}
                  style={{ flex: 1 }}
                  styles={{
                    input: {
                      backgroundColor: "rgba(61, 54, 84, 0.3)",
                      color: "#FAFAFA",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      fontSize: 16,
                      height: 60,
                      transition: "all 0.3s ease",
                      "&:focus": {
                        borderColor: "rgba(152, 255, 76, 0.5)",
                        backgroundColor: "rgba(61, 54, 84, 0.5)",
                      },
                    },
                  }}
                />
              </Flex>

              <Button
                type="submit"
                loading={createUser.isPending}
                size="xl"
                radius={16}
                fullWidth
                className="neon-button"
                style={{
                  height: 60,
                  fontSize: 16,
                }}
              >
                Добавить пользователя
              </Button>
            </form>
          </Box>

          {/* Список пользователей */}
          <Box className="glass-card animate-slide-up delay-2" p={40}>
            <Group gap={20} mb={32} justify="space-between">
              <Group gap={20}>
                <Box
                  style={{
                    width: 56,
                    height: 56,
                    background:
                      "linear-gradient(135deg, rgba(195, 183, 255, 0.15) 0%, rgba(195, 183, 255, 0.05) 100%)",
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(195, 183, 255, 0.2)",
                  }}
                >
                  <IconUsers size={28} color="#C3B7FF" />
                </Box>
                <div>
                  <Title
                    order={2}
                    size={28}
                    c="#FAFAFA"
                    fw={600}
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    Пользователи
                  </Title>
                  <Text c="rgba(195, 183, 255, 0.6)" size="md" mt={4}>
                    Управление участниками
                  </Text>
                </div>
              </Group>

              {users && users.length > 0 && (
                <Badge
                  size="xl"
                  radius={12}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(195, 183, 255, 0.15) 0%, rgba(195, 183, 255, 0.05) 100%)",
                    color: "#C3B7FF",
                    border: "1px solid rgba(195, 183, 255, 0.2)",
                    fontWeight: 700,
                    fontSize: 18,
                    padding: "12px 20px",
                  }}
                >
                  {users.length}
                </Badge>
              )}
            </Group>

            {isLoading ? (
              <Box py={80} ta="center">
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    border: "3px solid rgba(152, 255, 76, 0.2)",
                    borderTopColor: "#98FF4C",
                    margin: "0 auto 16px",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <Text c="rgba(195, 183, 255, 0.6)" size="lg">
                  Загрузка данных...
                </Text>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </Box>
            ) : users && users.length > 0 ? (
              <Stack gap={12}>
                {users.map((user, index) => (
                  <Group
                    key={user._id.toString()}
                    justify="space-between"
                    p={20}
                    className="animate-scale-in"
                    style={{
                      backgroundColor: "rgba(61, 54, 84, 0.2)",
                      borderRadius: 16,
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      transition: "all 0.3s ease",
                      animationDelay: `${index * 0.05}s`,
                    }}
                  >
                    <Group gap={16}>
                      <Box
                        style={{
                          width: 52,
                          height: 52,
                          background: `linear-gradient(135deg, ${
                            index % 3 === 0
                              ? "rgba(152, 255, 76, 0.2), rgba(152, 255, 76, 0.05)"
                              : index % 3 === 1
                              ? "rgba(195, 183, 255, 0.2), rgba(195, 183, 255, 0.05)"
                              : "rgba(248, 204, 199, 0.2), rgba(248, 204, 199, 0.05)"
                          })`,
                          borderRadius: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${
                            index % 3 === 0
                              ? "rgba(152, 255, 76, 0.2)"
                              : index % 3 === 1
                              ? "rgba(195, 183, 255, 0.2)"
                              : "rgba(248, 204, 199, 0.2)"
                          }`,
                        }}
                      >
                        <Text
                          fw={700}
                          size="xl"
                          c={
                            index % 3 === 0
                              ? "#98FF4C"
                              : index % 3 === 1
                              ? "#C3B7FF"
                              : "#F8CCC7"
                          }
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Text>
                      </Box>
                      <div>
                        <Text fw={600} c="#FAFAFA" size="lg">
                          {user.name}
                        </Text>
                        <Text size="sm" c="rgba(195, 183, 255, 0.6)">
                          {user.email}
                        </Text>
                      </div>
                    </Group>

                    <ActionIcon
                      variant="subtle"
                      size={44}
                      radius={12}
                      onClick={() =>
                        deleteUser.mutate({ id: user._id.toString() })
                      }
                      loading={deleteUser.isPending}
                      style={{
                        color: "rgba(248, 204, 199, 0.6)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            ) : (
              <Box
                py={80}
                ta="center"
                style={{
                  background: "rgba(61, 54, 84, 0.15)",
                  borderRadius: 20,
                  border: "1px dashed rgba(255, 255, 255, 0.08)",
                }}
              >
                <Box
                  style={{
                    width: 80,
                    height: 80,
                    background: "rgba(195, 183, 255, 0.1)",
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                  }}
                >
                  <IconUsers size={40} color="rgba(195, 183, 255, 0.4)" />
                </Box>
                <Text c="rgba(195, 183, 255, 0.6)" size="xl" fw={500} mb={8}>
                  Список пуст
                </Text>
                <Text c="rgba(195, 183, 255, 0.4)" size="md">
                  Добавьте первого пользователя
                </Text>
              </Box>
            )}
          </Box>
        </Stack>

        {/* Footer */}
        <Box mt={100}>
          <Box className="gradient-line" mb={40} />
          <Flex justify="space-between" align="center" wrap="wrap" gap={20}>
            <Text c="rgba(250, 250, 250, 0.3)" size="sm">
              © 2025 shorthack — Стилизовано в формате x5.tech
            </Text>
            <Group gap={32}>
              {["Next.js", "tRPC", "MongoDB", "Mantine"].map((tech, i) => (
                <Text
                  key={tech}
                  size="sm"
                  c={
                    i === 0
                      ? "rgba(152, 255, 76, 0.6)"
                      : i === 1
                      ? "rgba(195, 183, 255, 0.6)"
                      : i === 2
                      ? "rgba(248, 204, 199, 0.6)"
                      : "rgba(252, 234, 170, 0.6)"
                  }
                  style={{ cursor: "pointer", transition: "color 0.2s" }}
                >
                  {tech}
                </Text>
              ))}
            </Group>
          </Flex>
        </Box>
      </Container>
    </>
  );
}

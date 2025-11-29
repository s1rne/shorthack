# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# Устанавливаем pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# ============ DEPENDENCIES ============
FROM base AS deps

RUN pnpm install --frozen-lockfile

# ============ BUILD ============
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для билда
ARG MONGODB_URI
ARG NEXT_PUBLIC_APP_URL

ENV MONGODB_URI=${MONGODB_URI}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Билд приложения
RUN pnpm build

# ============ PRODUCTION ============
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Создаём пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]


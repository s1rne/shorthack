# X5 Tech Quest - MAKLAUDS

Интерактивный квест для стендов X5 Tech на ярмарках вакансий.

**PROD version:** http://89.179.244.0:9011/

## Быстрый запуск (Docker)

```bash
docker-compose -f docker-compose.local.yml up -d --build
```

Открыть http://localhost:3000

Всё.

---

## Запуск без Docker

```bash
pnpm install

# Нужна MongoDB (локальная или Atlas)
cp env.example .env
# Отредактировать MONGODB_URI в .env

pnpm dev
```

http://localhost:3000

## Продакшн

```bash
pnpm build
pnpm start
```

## CI/CD (Drone)

При пуше в `master` автоматически:
1. Lint
2. Сборка Docker образа
3. Деплой на сервер
4. Очистка старых образов

Конфиг: `.drone.yml`

## Стек

- Next.js 16
- tRPC
- MongoDB / Mongoose
- Three.js (декоративный 3D-фон)

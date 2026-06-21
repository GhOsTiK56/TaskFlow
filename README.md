<div align="center">
# 📋 TaskFlow
 
**Менеджер задач с офлайн-синхронизацией**
 
Fullstack-приложение: NestJS-бэкенд + Flutter-клиент с offline-first архитектурой
 
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B?logo=flutter&logoColor=white)](https://flutter.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-FF6600?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
 
</div>
---
 
## О проекте
 
TaskFlow — приложение для управления задачами и проектами. Работает без интернета: все действия сохраняются локально и синхронизируются при появлении сети.
 
| | |
|---|---|
| 🔐 | Авторизация по OTP-коду на email, без паролей |
| 📡 | Полноценный offline-first режим с conflict resolution |
| 🔔 | Напоминания о дедлайнах через очередь сообщений |
| 📊 | Метрики, трейсинг и логирование из коробки |
 
---
 
## Скриншоты
 
<div align="center">
| Авторизация | Главная | Список задач |
|:---:|:---:|:---:|
| _скриншот_ | _скриншот_ | _скриншот_ |
 
| Детали задачи | Офлайн-режим | Конфликт синхронизации |
|:---:|:---:|:---:|
| _скриншот_ | _скриншот_ | _скриншот_ |
 
</div>
---
 
## Стек технологий
 
<table>
<tr>
<td valign="top" width="50%">
**Backend**
- NestJS 10 + TypeScript
- PostgreSQL 16 + Prisma ORM
- Redis — OTP, кэш, rate limiting
- RabbitMQ — очереди уведомлений
- Prometheus + OpenTelemetry + Grafana
</td>
<td valign="top" width="50%">
**Frontend (Mobile)**
- Flutter 3.x
- BLoC — управление состоянием
- Retrofit + Dio — сетевой слой
- Drift (SQLite) — локальное хранилище
- GetIt — Dependency Injection
- Clean Architecture
</td>
</tr>
</table>
---
 
## Архитектура
 
```
┌─────────────┐       REST API        ┌──────────────┐
│   Flutter   │ ◄──────────────────►  │    NestJS    │
│  + Drift    │      JWT auth         │              │
│  (offline)  │                       │              │
└─────────────┘                       └──────┬───────┘
                                              │
                          ┌───────────────────┼───────────────────┐
                          ▼                   ▼                   ▼
                    ┌───────────┐      ┌───────────┐      ┌───────────┐
                    │ PostgreSQL│      │   Redis   │      │ RabbitMQ  │
                    │  (Prisma) │      │  OTP/кэш  │      │ очереди   │
                    └───────────┘      └───────────┘      └───────────┘
```
 
Подробное техническое задание — в [`/docs/TZ.md`](docs/TZ.md).
 
---
 
## Быстрый старт
 
### Backend
 
```bash
cd backend
cp .env.example .env
docker compose up -d        # PostgreSQL, Redis, RabbitMQ
npx prisma migrate dev
npm install
npm run start:dev
```
 
API будет доступен на `http://localhost:3000`, документация Swagger — на `/api/docs`.
 
### Mobile
 
```bash
cd mobile
flutter pub get
flutter pub run build_runner build --delete-conflicting-outputs
flutter run
```
 
---
 
## Структура репозитория
 
```
taskflow/
├── backend/          # NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── projects/
│   │   ├── sync/
│   │   └── observability/
│   └── prisma/
├── mobile/            # Flutter приложение
│   └── lib/
│       ├── core/
│       └── features/
└── docs/              # ТЗ, диаграммы, API-спека
```
 
---
 
## Roadmap
 
- [x] Авторизация по OTP
- [x] CRUD задач и проектов
- [x] Offline-first синхронизация
- [ ] Push-уведомления
- [ ] Совместные проекты (sharing)
- [ ] Виджет на главный экран
---
 
<div align="center">
Учебный проект, разработан в процессе изучения fullstack-разработки
 
</div>

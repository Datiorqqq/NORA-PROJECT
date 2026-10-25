# Правила командної роботи над NORA PROJECT

Цей документ описує єдиний стандарт роботи з кодом і гілками для всіх 5 учасників команди.

## 1. Структура папок репозиторію

- `backend/` — серверна частина на Node.js + Express, інтеграція з AI API та Firebase Admin SDK (Студенти 1–3).
- `frontend/` — клієнтський застосунок на React + TypeScript + Tailwind CSS (Студент 4 та Студент 5).
- `docs/` — документація API, база знань університету та матеріали Usability-тестування (Вся команда / Студент 5).

## 2. Робота з гілками (Branching)

Ніколи не пуште зміни напряму в гілку `main`. Для кожної задачі з канбан-дошки створюйте окрему гілку:

- `feat/feature-name` — нова функціональність (наприклад, `feat/auth-middleware`, `feat/chat-history-ui`)
- `fix/bug-name` — виправлення помилки (наприклад, `fix/cors-headers`)
- `docs/doc-name` — оновлення документації чи бази знань

## 3. Формат комітів (Conventional Commits)

Пишіть короткі й зрозумілі повідомлення комітів:

- `feat: add POST /api/chat endpoint`
- `fix: handle empty message error in chat form`
- `docs: add university dormitory FAQ`

## 4. Безпека секретів та ключів

- Перед кожним комітом перевіряйте `git status`, щоб у репозиторій не потрапили файли `.env`, `node_modules/` або JSON-ключі Firebase.
- Використовуйте `.env.example` як зразок для локального файлу `.env`.

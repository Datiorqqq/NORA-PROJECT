# Nora — student AI assistant (PoC)

Nora PoC scope: **PWA + Moodle + AI**. This repository uses **React Router v8 Framework Mode + Vite + TypeScript** as a single full-stack Node.js application. There is no separate Express API or Firebase service.

## Current state — Issue #2 (foundation)

The server-rendered app has a public `/` route backed by a server loader and a `/health` resource route and a protected server action:

- `GET /health` → `200 {"service":"nora","status":"ok"}`.
- `POST /api/session-check` → `401` without a signed student session; `503` when the session secret is unconfigured. Real sign-in is **not** implemented until issue #7.
- The server-only `app/.server/` directory is reserved for secrets and future Moodle/Gemini integration.

No Moodle, Gemini or service worker is connected in this first issue. Their tasks are tracked separately.

## Run

Requires **Node.js 22.22+**.

```bash
npm install
npm run dev
npm run test
npm run typecheck
npm run build
npm start
```

The production server uses `@react-router/serve` on the `PORT` assigned by Railway. Set `SESSION_SECRET` (at least 32 characters) in your environment to exercise authenticated actions. Do not commit it. `MOODLE_BASE_URL` and `GEMINI_API_KEY` are placeholders for future integration tasks. `.env.example` documents these variables; the deployment supplies them as environment variables.

> `GET /health` is intentionally public. The `POST /api/session-check` endpoint does not provide a login flow and cannot be treated as a verified Moodle identity.

## Project structure

- `app/` — React Router routes, server-rendered UI and server-only modules.
- `tests/` — focused server environment contract tests.
- `Figma/` — existing UI/UX design reference.
- `docs/` — team documentation.
- `backend/` and `frontend/` — historical planning notes for the abandoned split-service architecture; **not** runnable applications.

## Development workflow (для студентів)

Повні правила: [CONTRIBUTING.md](CONTRIBUTING.md).

1. Створіть окрему гілку від актуального `main` для кожної задачі (`feat/<issue>-name` або `fix/<issue>-name`).
2. Зробіть зміни та додайте unit-тести нової функціональності (для виправлення дефекту — regression test).
3. Перед push локально виконайте:

   ```bash
   npm install
   npm run lint
   npm run format:check
   npm run typecheck
   npm test
   npm run build
   ```

4. Запуште **лише свою гілку** та відкрийте **один Pull Request на одну задачу** з цільовою гілкою `main`. Прямий push у `main` заборонений правилами команди.
5. GitHub Actions автоматично запускає [PR quality gates](.github/workflows/quality.yml) для кожного PR у `main`: ESLint, Prettier, TypeScript typecheck, unit-тести та production build. Результати видно у вкладці **Checks** PR. Якщо будь-яка перевірка падає, виправте причину у своїй гілці та повторіть перевірку.
6. Після PASS усіх перевірок, code review та виконання acceptance criteria (для UI — browser E2E зі скриншотами) використовуйте лише **Squash and merge**. Звичайний merge і rebase merge не використовуються.

**Важливо:** CI уже налаштований, але примусове блокування merge при невдалих перевірках вимагає GitHub Ruleset / branch protection для `main` з обов'язковим status check `verify`. Доки це не налаштовано адміністратором, правила merge є командною політикою, а не технічним обмеженням GitHub.

## Team

| Role | Member | Responsibility |
| --- | --- | --- |
| Student 1 | Маруся | Server architecture and API integration |
| Student 2 | Катя | AI and business logic |
| Student 3 | Діана | Frontend architecture and routing |
| Student 4 | Андріана | UI and data integration |
| Student 5 | Вадим | UI/UX design, Figma and usability |

One task → one branch → one PR. Do not merge without the documented acceptance checks and browser E2E.

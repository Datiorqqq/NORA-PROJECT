# Nora — AI-помічник студента

**Nora** — навчальний Proof of Concept (PoC) вебзастосунку для студентів. Мета — допомагати працювати зі **своїми** курсами, завданнями та дедлайнами з Moodle і ставити запитання AI з урахуванням особистого навчального контексту. Запланований формат — встановлювана PWA (Progressive Web App), яка працює на комп'ютері й телефоні.

> **Статус:** проєкт у розробці. Поточний код — базовий застосунок, **не** завершений Moodle/AI-помічник. Увійти у Moodle з наявної сторінки можна лише на офіційному зовнішньому сайті; це **не** створює сесію Nora.

## Швидка навігація

- [Поточний стан і план](#поточний-стан-і-план)
- [Технології та архітектура](#технології-та-архітектура)
- [Швидкий старт](#швидкий-старт)
- [Структура репозиторію](#структура-репозиторію)
- [Правила розробки](#правила-розробки)
- [Тести та GitHub Actions](#тести-та-github-actions)
- [Перша задача студента](#перша-задача-студента)
- [Команда та матеріали](#команда-та-матеріали)

## Поточний стан і план

| Можливість | Стан | Де дивитися |
| --- | --- | --- |
| Єдиний React Router застосунок із server-side rendering | Реалізований каркас | [Issue #2](https://github.com/Datiorqqq/NORA-PROJECT/issues/2) |
| Сторінка з переходом до офіційного входу Moodle | Реалізовано; лише зовнішній вхід | [`app/routes/home.tsx`](app/routes/home.tsx) |
| `GET /health` і захищена перевірка сесії `POST /api/session-check` | Реалізовані базові маршрути; Nora ще не авторизує студента | [`app/routes.ts`](app/routes.ts) |
| Персональний Moodle SSO та сесія Nora | Заплановано; потребує узгодженого способу доступу | [#6](https://github.com/Datiorqqq/NORA-PROJECT/issues/6), [#7](https://github.com/Datiorqqq/NORA-PROJECT/issues/7) |
| Власні курси, завдання та дедлайни з Moodle (read-only) | Заплановано | [#8](https://github.com/Datiorqqq/NORA-PROJECT/issues/8), [#11](https://github.com/Datiorqqq/NORA-PROJECT/issues/11) |
| Dashboard, Courses, Deadlines, AI Chat | Заплановано | [#3](https://github.com/Datiorqqq/NORA-PROJECT/issues/3), [#5](https://github.com/Datiorqqq/NORA-PROJECT/issues/5) |
| Встановлювана PWA, адаптивність та реальний E2E | Заплановано | [#12](https://github.com/Datiorqqq/NORA-PROJECT/issues/12), [#4](https://github.com/Datiorqqq/NORA-PROJECT/issues/4) |

**Обмеження PoC:** один застосунок, персональні дані лише з власної Moodle-сесії, доступ до Moodle — лише на читання.

## Технології та архітектура

- **React 19 + React Router v8 (Framework Mode)** — маршрути, інтерфейс, серверні `loader/action`, SSR.
- **Vite + TypeScript** — інструменти розробки та типізація.
- **Node.js 22.22+** — серверний runtime; `@react-router/serve` для запуску production build.
- **ESLint + Prettier** — правила коду та форматування.
- **Node test runner + Vitest** — unit-тести.

Архітектурний принцип: **один репозиторій → один React Router застосунок → один серверний build/deploy**. Браузер працює з маршрутами Nora; майбутні запити до Moodle та Gemini виконуватимуться **на сервері** через `loader/action` і модулі `app/.server/`, а не напряму з браузера. Наразі Moodle API й Gemini ще не підключені.

## Швидкий старт

**Потрібно:** Git, Node.js **22.22 або новіший**, npm.

1. Клонуйте репозиторій та встановіть залежності:

   ```bash
   git clone https://github.com/Datiorqqq/NORA-PROJECT.git
   cd NORA-PROJECT
   npm install
   ```

2. Запустіть dev-сервер:

   ```bash
   npm run dev
   ```

   Відкрийте URL, який покаже термінал. На головній сторінці є кнопка переходу до офіційного Moodle ЛНУ. Кнопка відкриває Moodle **поза Nora** — локальна авторизація Nora ще не реалізована.

3. Перевірте базовий endpoint `GET /health` за адресою `<URL dev-сервера>/health`. Очікувана відповідь:

   ```json
   { "service": "nora", "status": "ok" }
   ```

4. Запустіть локальні перевірки з розділу [Тести та GitHub Actions](#тести-та-github-actions).

### Змінні середовища

Шаблон: [`.env.example`](.env.example). Не комітьте заповнений `.env` або справжні секрети.

| Змінна | Призначення |
| --- | --- |
| `SESSION_SECRET` | Секрет підпису сесії Nora, **не менше 32 символів**. Потрібен для перевірки сесій. |
| `MOODLE_BASE_URL` | Адреса Moodle для майбутнього server-side connector. |
| `GEMINI_API_KEY` | Ключ майбутньої серверної AI-інтеграції. |

Для відкриття головної сторінки та `/health` ключі Moodle/Gemini не потрібні. Без `SESSION_SECRET` запит `POST /api/session-check` повертає **503**; із коректним секретом, але без валідної сесії — **401**. Це очікувана поведінка, а не готовий login flow.

У deployment секрети задаються як змінні середовища на сервері (Railway). Ніколи не використовуйте префікс `VITE_` для секретів і не додавайте їх у клієнтський код.

### Інші команди

| Команда | Призначення |
| --- | --- |
| `npm run dev` | Локальна розробка |
| `npm run typecheck` | Генерація типів маршрутів і перевірка TypeScript |
| `npm run lint` | ESLint |
| `npm run lint:fix` | Автоматичне виправлення доступних ESLint-помилок |
| `npm run format:check` | Перевірка форматування Prettier без змін |
| `npm run format` | Форматування коду Prettier |
| `npm test` | Unit-тести (Node test runner + Vitest) |
| `npm run build` | Production build |
| `npm start` | Запуск зібраного production застосунку (після `npm run build`) |

## Структура репозиторію

| Шлях | За що відповідає |
| --- | --- |
| [`app/routes.ts`](app/routes.ts) | Реєстр маршрутів Nora |
| [`app/routes/`](app/routes/) | UI, route loaders/actions, стилі |
| [`app/.server/`](app/.server/) | Серверні сесії, змінні середовища; майбутні інтеграції |
| [`app/root.tsx`](app/root.tsx) | Кореневий layout і error boundary |
| [`tests/`](tests/) | Unit-тести |
| [`Figma/`](Figma/) | Посилання на UI/UX-макет |
| [`docs/`](docs/) | Додаткові матеріали проєкту |
| [`.github/workflows/quality.yml`](.github/workflows/quality.yml) | CI-перевірки для PR до `main` |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Детальні правила командної роботи |

**Увага:** `backend/` і `frontend/` у `main` — залишки старої структури документації. Їхні README з Express/Firebase та окремим frontend **не відповідають поточній архітектурі**. Нові компоненти розміщуйте в `app/`, не відновлюйте два незалежні застосунки.

## Правила розробки

Ці правила **обов'язкові для кожного студента**. Деталі — у [CONTRIBUTING.md](CONTRIBUTING.md).

1. **Один task → одна branch → один Pull Request.** Не змішуємо різні задачі в одному PR. Вказуємо пов'язаний GitHub Issue.
2. **Не пушимо напряму в `main`.** Працюємо тільки у власній гілці від актуального `main` (наприклад, `feat/42-moodle-courses`, `fix/43-login-error`).
3. **Усі PR мерджимо тільки через `Squash and merge`.** Звичайний merge commit та rebase merge не використовуємо.
4. **До кожного push локально перевіряємо ESLint і Prettier.** Також запускаємо typecheck, unit-тести та build. Не пушимо код із відомими помилками.
5. **На всю нову функціональність додаємо unit-тести.** Потрібні позитивні й негативні сценарії та edge cases; на кожний bug fix — regression test.
6. **Перед merge потрібні review, успішні CI та виконані acceptance criteria.** Для UI-змін потрібна браузерна E2E-перевірка desktop, mobile portrait і mobile landscape зі скриншотами.

### Покроково: від задачі до PR

```bash
git switch main
git pull --ff-only origin main
git switch -c feat/42-short-description

# Внесіть зміни та додайте unit-тести.
npm run lint
npm run format:check
npm run typecheck
npm test
npm run build

git add .
git commit -m "feat: implement issue 42"
git push -u origin feat/42-short-description
```

Далі створіть PR до `main` у GitHub: опишіть **що змінили, чому, як тестували**, прикріпіть Issue та скриншоти (для UI). Дочекайтеся перевірок і рев'ю. **Не мерджіть власноруч до виконання умов.** Після дозволу на merge — лише **Squash and merge**.

## Тести та GitHub Actions

Для кожного PR з цільовою гілкою `main` запускається [`PR quality gates`](.github/workflows/quality.yml) — job **`verify`**:

| Перевірка | Команда |
| --- | --- |
| Встановлення залежностей | `npm install` |
| ESLint | `npm run lint` |
| Prettier | `npm run format:check` |
| TypeScript | `npm run typecheck` |
| Unit-тести | `npm test` |
| Production build | `npm run build` |

Результат дивіться у вкладках **Checks** PR та [Actions](https://github.com/Datiorqqq/NORA-PROJECT/actions). Якщо перевірка впала, відкрийте лог, виправте причину в цій же гілці й повторіть push. **Не видаляйте тести та не послаблюйте assertions, щоб отримати зелений CI.**

**CI PASS сам по собі не означає, що UI перевірений у браузері.** Реальний браузерний E2E та скриншоти для UI є окремим критерієм.

**Обмеження GitHub:** `main` наразі не захищена правилами. Workflow виконує перевірки, але для *автоматичної заборони merge* адміністратор повинен налаштувати Ruleset / Branch protection, вимагати PR і обов'язковий status check **`verify`**, а також дозволити тільки squash merge. Поки ці налаштування не ввімкнено, правила залишаються обов'язковою командною процедурою, але GitHub технічно не блокує їх обхід.

## Перша задача студента

1. Прочитайте цей README та [CONTRIBUTING.md](CONTRIBUTING.md).
2. Запустіть застосунок і перевірте `/`, `/health`, `npm test`.
3. Подивіться [Figma-макет](https://www.figma.com/make/ze8eCZzQdRYmApetTibYkG/University-Platform-UI-Flow?t=vrHQJ2FVVr1RwrBX-1) і [список задач](https://github.com/Datiorqqq/NORA-PROJECT/issues).
4. Візьміть погоджену задачу, створіть окрему гілку і реалізуйте тільки її scope.
5. Додайте тести, пройдіть локальні перевірки, відкрийте PR і дочекайтеся review.

Якщо завдання стосується Moodle API/SSO, **спочатку** звірте обмеження доступу в [#6](https://github.com/Datiorqqq/NORA-PROJECT/issues/6) та [#7](https://github.com/Datiorqqq/NORA-PROJECT/issues/7). Не використовуйте спільний привілейований токен або чужий обліковий запис для персональних студентських даних.

## Команда та матеріали

| Учасник | Зона відповідальності |
| --- | --- |
| Маруся | Серверна архітектура та API-інтеграція |
| Катя | AI та бізнес-логіка |
| Діана | Frontend-архітектура та маршрути |
| Андріана | UI та інтеграція даних |
| Вадим | UI/UX, Figma та usability |

Розподіл описує напрями роботи **в межах одного React Router застосунку**, а не окремі frontend/backend-сервіси.

- [GitHub Issues](https://github.com/Datiorqqq/NORA-PROJECT/issues) — задачі та acceptance criteria.
- [Pull Requests](https://github.com/Datiorqqq/NORA-PROJECT/pulls) — зміни та code review.
- [Figma](Figma/README.md) — дизайн-посилання й вихідні матеріали.
- [CONTRIBUTING.md](CONTRIBUTING.md) — правила команди.
- [GitHub Actions](https://github.com/Datiorqqq/NORA-PROJECT/actions) — результати CI.

**Definition of Done:** реалізовано узгоджений scope → додані тести → локальні перевірки PASS → CI PASS → review → відповідні E2E/acceptance criteria PASS → лише після цього squash merge.

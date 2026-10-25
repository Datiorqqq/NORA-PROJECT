# 🚀 NORA-PROJECT

Командний університетський проєкт. Репозиторій містить вихідний код серверної та клієнтської частин, UI/UX дизайн-систему та технічну документацію.

---

## 👥 Команда та розподіл ролей

| Роль | Учасник | Зона відповідальності |
| :--- | :--- | :--- |
| **Студент 1** | `Маруся` | Backend Architecture / Database / Core API |
| **Студент 2** | `Катя` | Backend Business Logic / AI & ML Integration |
| **Студент 3** | `Діана` | Frontend Architecture / Routing / State Management |
| **Студент 4** | `Андріана` | Frontend UI Implementation / API Integration |
| **Студент 5** | `Вадим` | **UI/UX Design:** User Flow, Wireframes, Figma, Design System, Responsive & Accessibility, Edge States (Loading, Error, Empty) |

---

## 📂 Структура проєкту (Project Structure)

Репозиторій організований за принципом розділення відповідальності між частинами системи:

```text
NORA-PROJECT/
├── backend/                # Серверна частина (API, бізнес-логіка, робота з БД)
│   ├── app/                # Основний код застосунку (роути, моделі, контролери)
│   ├── tests/              # Юніт- та інтеграційні тести бекенду
│   └── requirements.txt    # Залежності Python
│
├── frontend/               # Клієнтська частина (веб-інтерфейс)
│   ├── public/             # Статичні файли (фавіконки, шрифти, базові зображення)
│   ├── src/                # Вихідний код фронтенду
│   │   ├── assets/         # Графіка, іконки та стилі з Figma
│   │   ├── components/     # Перевикористовувані UI-компоненти (кнопки, картки, поля, sidebar, navbar)
│   │   ├── pages/          # Готові сторінки застосунку
│   │   └── services/       # Логіка запитів до API бекенду
│   └── package.json        # Залежності Node.js
│
├── ml/                     # ШІ-модулі, промпти, скрипти обробки даних
│
├── design/                 # Матеріали UI/UX (Студент 5)
│   ├── wireframes/         # Експортовані схеми екранів та User Flow
│   ├── assets/             # Підготовлені SVG-іконки, логотипи та ілюстрації для розробників
│   └── README.md           # Посилання на Figma, опис Design System, кольорів та шрифтів
│
├── docs/                   # Технічна документація проєкту
│   ├── architecture.md     # Загальна схема архітектури та бази даних
│   └── api-spec.md         # Опис ендпоінтів (Swagger/OpenAPI специфікації)
│
├── .gitignore              # Файли та папки, які Git ігнорує (venv, node_modules, .env)
├── CONTRIBUTING.md         # Правила роботи з гілками (Git Flow) та оформлення Pull Requests
└── README.md               # Головний опис проєкту, інструкція з запуску та навігація
```

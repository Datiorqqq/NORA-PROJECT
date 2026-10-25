# NORA Backend (Node.js + Express + Firebase + AI)

Директорія серверної частини проєкту (зона відповідальності **Студентів 1–3**).

## Рекомендована структура

- `src/config/` — підключення Firebase Admin SDK та змінних `.env`
- `src/routes/` — маршрути REST API (`/api/chat`, `/api/auth`, `/api/profile`)
- `src/controllers/` — обробка запитів і відповідей
- `src/services/` — логіка взаємодії з AI SDK та Firestore
- `src/middleware/` — перевірка Firebase ID Token та валідація даних
- `src/app.js` — точка входу Express

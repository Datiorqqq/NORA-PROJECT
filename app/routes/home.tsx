import type { Route } from "./+types/home";
import "./moodle-login.css";

const MOODLE_LOGIN_URL = "https://e-learning.lnu.edu.ua/login/index.php";

export function meta() {
  return [{ title: "Вхід у Moodle — Nora" }];
}

export function loader() {
  return { service: "Nora", status: "foundation" };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="moodle-login-page">
      <section className="moodle-login-panel" aria-labelledby="moodle-login-title">
        <p className="moodle-login-brand">{loaderData.service}</p>
        <h1 id="moodle-login-title">Перевірка входу в Moodle</h1>
        <p className="moodle-login-description">
          Університет використовує корпоративний вхід через Microsoft 365.
          Авторизуйтеся на офіційному сайті Moodle ЛНУ.
        </p>

        <form
          action={MOODLE_LOGIN_URL}
          method="get"
          target="_blank"
          rel="noopener noreferrer"
          className="moodle-login-form"
        >
          <button type="submit" className="moodle-login-submit">
            Відкрити вхід через Office 365
          </button>
        </form>

        <p className="moodle-login-instructions">
          На сторінці Moodle виберіть <strong>OpenID Connect</strong>, увійдіть
          з обліковим записом університету та переконайтеся, що відкрилася
          ваша сторінка Moodle.
        </p>
        <p className="moodle-login-disclaimer" role="note">
          Перевіряється лише вхід безпосередньо в Moodle. Сесію Nora цей крок
          ще не створює: інтеграція з Moodle SSO потребує окремого погодженого
          способу авторизації для застосунку.
        </p>
      </section>
    </main>
  );
}

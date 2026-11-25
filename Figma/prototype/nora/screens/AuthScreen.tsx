import { useState, type FormEvent } from "react";
import {
  tr,
  specialtyOptions,
  defaultAcademicProfile,
  type AuthMode,
  type Language,
  type AcademicProfile,
} from "../shared/model";
import { Icon, NoraLogo, Button } from "../shared/ui";

export function AuthScreen({
  darkMode,
  setDarkMode,
  language,
  setLanguage,
  academicProfile,
  setAcademicProfile,
  onComplete,
}: {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  academicProfile: AcademicProfile;
  setAcademicProfile: (profile: AcademicProfile) => void;
  onComplete: () => void;
}) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "loading" | "success">("idle");

  const changeMode = (nextMode: AuthMode) => {
    if (connectionStatus !== "idle") return;
    setMode(nextMode);
    setError("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (!email.toLowerCase().endsWith("@lnu.edu.ua")) {
      setError(
        tr(
          language,
          "Use your LNU email address ending in @lnu.edu.ua.",
          "Використайте адресу ЛНУ, що закінчується на @lnu.edu.ua.",
        ),
      );
      return;
    }
    if (password.length < 6) {
      setError(
        tr(
          language,
          "Password must contain at least 6 characters.",
          "Пароль має містити щонайменше 6 символів.",
        ),
      );
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError(tr(language, "Passwords do not match.", "Паролі не збігаються."));
      return;
    }

    setError("");
    onComplete();
  };

  const connectWithMoodle = () => {
    if (connectionStatus !== "idle") return;

    setConnectionStatus("loading");
    window.setTimeout(() => {
      setConnectionStatus("success");
      window.setTimeout(onComplete, 650);
    }, 1400);
  };

  return (
    <main className="auth-page">
      <div className="auth-lava" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <NoraLogo />
          <div>
            <div className="auth-brand-name">NORA</div>
            <div className="auth-brand-tag">
              {tr(language, "AI campus companion", "AI-помічник студента")}
            </div>
          </div>
        </div>
        <div className="auth-hero-copy">
          <div className="auth-hero-title">
            {tr(language, "Make room", "Більше часу")}
            <br />
            {tr(language, "for learning.", "на навчання.")}
          </div>
          <p>
            {tr(
              language,
              "See what’s next, keep track of assignments, and get help when you’re stuck.",
              "Подивися, що сьогодні за планом, тримай завдання під рукою й звертайся по допомогу, коли застрягнеш.",
            )}
          </p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-toolbar">
          <Button
            variant="ghost"
            className="language-toggle"
            ariaLabel={tr(language, "Switch language", "Змінити мову")}
            onClick={() => setLanguage(language === "en" ? "uk" : "en")}
          >
            <span className={language === "en" ? "active" : ""}>EN</span>
            <span className={language === "uk" ? "active" : ""}>UA</span>
          </Button>
          <Button
            variant="icon"
            ariaLabel={
              darkMode
                ? tr(language, "Switch to light mode", "Увімкнути світлу тему")
                : tr(language, "Switch to dark mode", "Увімкнути темну тему")
            }
            ariaPressed={darkMode}
            className="auth-theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            <Icon name="moon" size={18} />
          </Button>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-mobile-brand">
            <NoraLogo />
            <span>NORA</span>
          </div>
          <span className="auth-form-eyebrow">
            {mode === "login"
              ? tr(language, "GOOD TO SEE YOU", "РАДІ БАЧИТИ")
              : tr(language, "JOIN NORA", "ПРИЄДНУЙСЯ ДО NORA")}
          </span>
          <div className="auth-form-title">
            {mode === "login"
              ? tr(language, "Sign in to your account", "Увійдіть у свій акаунт")
              : tr(language, "Create your student account", "Створіть студентський акаунт")}
          </div>
          <p className="auth-form-subtitle">
            {mode === "login"
              ? tr(
                  language,
                  "Use your university email or continue with Moodle.",
                  "Використайте університетську пошту або продовжте через Moodle.",
                )
              : tr(
                  language,
                  "Set up your account to access your personalized campus workspace.",
                  "Налаштуйте акаунт для доступу до персонального простору ЛНУ.",
                )}
          </p>

          <div
            className="auth-tabs"
            role="tablist"
            aria-label={tr(language, "Authentication mode", "Режим авторизації")}
          >
            <Button
              variant="ghost"
              className={mode === "login" ? "active" : ""}
              ariaPressed={mode === "login"}
              onClick={() => changeMode("login")}
            >
              {tr(language, "Sign in", "Вхід")}
            </Button>
            <Button
              variant="ghost"
              className={mode === "register" ? "active" : ""}
              ariaPressed={mode === "register"}
              onClick={() => changeMode("register")}
            >
              {tr(language, "Register", "Реєстрація")}
            </Button>
          </div>

          <form className="auth-form" onSubmit={submit}>
            {mode === "register" && (
              <div className="auth-registration-fields">
                <label className="auth-field">
                  <span>{tr(language, "Full name", "ПІБ")}</span>
                  <div>
                    <Icon name="user" size={17} />
                    <input name="name" required autoComplete="name" placeholder="Alexandra Kim" />
                  </div>
                </label>
                <div className="academic-flow-label">
                  {tr(language, "Academic profile", "Навчальний профіль")}
                </div>
                <label className="auth-field">
                  <span>{tr(language, "1. Faculty", "1. Факультет")}</span>
                  <div>
                    <Icon name="building" size={17} />
                    <select
                      value={academicProfile.faculty}
                      onChange={(event) =>
                        setAcademicProfile({ ...academicProfile, faculty: event.target.value })
                      }
                    >
                      <option>{defaultAcademicProfile.faculty}</option>
                    </select>
                  </div>
                </label>
                <div className="auth-field-row">
                  <label className="auth-field">
                    <span>{tr(language, "2. Specialty", "2. Спеціальність")}</span>
                    <div>
                      <Icon name="book" size={17} />
                      <select
                        value={academicProfile.specialty}
                        onChange={(event) =>
                          setAcademicProfile({ ...academicProfile, specialty: event.target.value })
                        }
                      >
                        {specialtyOptions.map((specialty) => (
                          <option key={specialty}>{specialty}</option>
                        ))}
                      </select>
                    </div>
                  </label>
                  <label className="auth-field">
                    <span>{tr(language, "3. Study year", "3. Курс")}</span>
                    <div>
                      <Icon name="calendar" size={17} />
                      <select
                        value={academicProfile.year}
                        onChange={(event) =>
                          setAcademicProfile({ ...academicProfile, year: event.target.value })
                        }
                      >
                        {["1", "2", "3", "4", "5", "6"].map((year) => (
                          <option key={year} value={year}>
                            Year {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </label>
                </div>
                <label className="auth-field">
                  <span>{tr(language, "4. Group", "4. Група")}</span>
                  <div>
                    <Icon name="user" size={17} />
                    <input
                      value={academicProfile.group}
                      onChange={(event) =>
                        setAcademicProfile({ ...academicProfile, group: event.target.value })
                      }
                      required
                      placeholder="PMA-22"
                    />
                  </div>
                </label>
              </div>
            )}
            <label className="auth-field">
              <span>{tr(language, "University email", "Університетська пошта")}</span>
              <div>
                <Icon name="mail" size={17} />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@lnu.edu.ua"
                />
              </div>
            </label>
            <label className="auth-field">
              <span>{tr(language, "Password", "Пароль")}</span>
              <div>
                <Icon name="check" size={17} />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={tr(language, "At least 6 characters", "Щонайменше 6 символів")}
                />
              </div>
            </label>
            {mode === "register" && (
              <label className="auth-field">
                <span>{tr(language, "Confirm password", "Підтвердження пароля")}</span>
                <div>
                  <Icon name="check" size={17} />
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder={tr(language, "Repeat your password", "Повторіть пароль")}
                  />
                </div>
              </label>
            )}
            <div className="auth-form-meta">
              <label className="auth-remember">
                <input type="checkbox" defaultChecked />
                <span>
                  {mode === "login"
                    ? tr(language, "Keep me signed in", "Залишатися в системі")
                    : tr(
                        language,
                        "I agree to the terms and privacy policy",
                        "Я погоджуюся з умовами та політикою конфіденційності",
                      )}
                </span>
              </label>
              {mode === "login" && (
                <Button variant="ghost" className="auth-text-button">
                  {tr(language, "Forgot password?", "Забули пароль?")}
                </Button>
              )}
            </div>
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            <Button type="submit" variant="primary" className="auth-submit">
              {mode === "login"
                ? tr(language, "Sign in to NORA", "Увійти в NORA")
                : tr(language, "Create account", "Створити акаунт")}{" "}
              <Icon name="arrow" size={17} />
            </Button>
          </form>

          {mode === "login" && (
            <div className="moodle-login-option">
              <div className="auth-divider">
                <span>{tr(language, "or", "або")}</span>
              </div>
              <Button
                variant="secondary"
                className="moodle-option-button"
                onClick={connectWithMoodle}
                disabled={connectionStatus !== "idle"}
              >
                <span className="moodle-option-icon">
                  <Icon name="cap" size={19} />
                </span>
                <span className="moodle-option-copy">
                  <strong>
                    {connectionStatus === "idle" &&
                      tr(language, "Continue with Moodle", "Продовжити через Moodle")}
                    {connectionStatus === "loading" &&
                      tr(language, "Checking Moodle account…", "Перевіряємо акаунт Moodle…")}
                    {connectionStatus === "success" &&
                      tr(language, "Moodle connected", "Moodle підключено")}
                  </strong>
                  <small>
                    {tr(language, "University single sign-on", "Єдиний університетський вхід")}
                  </small>
                </span>
                <span
                  className={`moodle-connection-indicator ${connectionStatus}`}
                  role="status"
                  aria-live="polite"
                  aria-label={
                    connectionStatus === "loading"
                      ? tr(language, "Connecting", "Підключення")
                      : connectionStatus === "success"
                        ? tr(language, "Connection successful", "Підключення успішне")
                        : tr(language, "Ready to connect", "Готово до підключення")
                  }
                >
                  {connectionStatus === "success" && <Icon name="check" size={17} />}
                </span>
              </Button>
              <p className="auth-placeholder-note">
                {tr(
                  language,
                  "Demo mode: Moodle authorization will be connected later.",
                  "Демо-режим: авторизацію Moodle буде підключено пізніше.",
                )}
              </p>
            </div>
          )}

          <div className="auth-switch-copy">
            {mode === "login"
              ? tr(language, "New to NORA?", "Вперше в NORA?")
              : tr(language, "Already have an account?", "Вже маєте акаунт?")}
            <Button
              variant="ghost"
              className="auth-text-button"
              onClick={() => changeMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login"
                ? tr(language, "Create an account", "Створити акаунт")
                : tr(language, "Sign in instead", "Увійти")}
            </Button>
          </div>
          <div className="auth-support">
            {tr(
              language,
              "Need help? Contact the university IT service desk.",
              "Потрібна допомога? Зверніться до ІТ-служби університету.",
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

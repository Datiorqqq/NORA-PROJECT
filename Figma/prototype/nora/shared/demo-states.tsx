import { tr, type Language } from "./model";
import { Icon, Button } from "./ui";

export function DemoNotice({ language }: { language: Language }) {
  return (
    <div className="demo-notice">
      <Icon name="calendar" size={14} />
      {tr(
        language,
        "Demo data · March 12, 2025 · Moodle is not connected",
        "Демонстраційні дані · 12 березня 2025 · Moodle ще не підключено",
      )}
    </div>
  );
}
export function StatusPanel({
  kind,
  language,
  onRetry,
}: {
  kind:
    | "loading"
    | "empty-courses"
    | "empty-deadlines"
    | "moodle-error"
    | "expired"
    | "ai-error"
    | "no-results";
  language: Language;
  onRetry: () => void;
}) {
  const copy = {
    loading: [
      "Loading your study information",
      "Завантажуємо навчальні дані",
      "Please wait a moment.",
      "Це займе кілька секунд.",
      "",
      "",
    ],
    "empty-courses": [
      "No courses yet",
      "Курсів поки немає",
      "No courses were returned. Check your enrolment in Moodle and refresh the list.",
      "Курсів не знайдено. Перевір зарахування в Moodle та онови список.",
      "Refresh courses",
      "Оновити курси",
    ],
    "empty-deadlines": [
      "No upcoming deadlines",
      "Найближчих дедлайнів немає",
      "Your data loaded successfully. No upcoming submissions were found.",
      "Дані завантажено. Найближчих термінів здачі не знайдено.",
      "Refresh deadlines",
      "Оновити дедлайни",
    ],
    "moodle-error": [
      "Moodle is temporarily unavailable",
      "Moodle тимчасово недоступний",
      "Courses and deadlines could not be refreshed. Try again later; this does not mean there are no assignments.",
      "Не вдалося оновити курси й дедлайни. Спробуй пізніше: це не означає, що завдань немає.",
      "Try again",
      "Спробувати знову",
    ],
    expired: [
      "Your session has ended",
      "Сесію завершено",
      "Sign in again to access your personal courses. Your password will not be requested in chat.",
      "Увійди знову, щоб переглянути власні курси. Вводити пароль у чат не потрібно.",
      "Sign in again",
      "Увійти знову",
    ],
    "ai-error": [
      "NORA could not respond",
      "NORA не змогла відповісти",
      "Your question is kept here. Retry when the service is available. Check deadlines in Moodle.",
      "Твоє запитання збережено в цій розмові. Спробуй ще раз. Дедлайни перевіряй у Moodle.",
      "Retry response",
      "Повторити запит",
    ],
    "no-results": [
      "No courses match your search",
      "За запитом курсів не знайдено",
      "Try another course name or clear the search.",
      "Спробуй іншу назву або очисть пошук.",
      "Clear search",
      "Очистити пошук",
    ],
  }[kind];
  const error = kind.endsWith("error") || kind === "expired";
  return (
    <section className={`state-panel ${error ? "state-error" : ""}`} aria-busy={kind === "loading"}>
      <div className={`state-symbol ${kind === "loading" ? "state-loading" : ""}`}>
        <Icon name={error ? "bell" : kind === "loading" ? "clock" : "book"} size={26} />
      </div>
      <div role={error ? "alert" : "status"} aria-live={error ? "assertive" : "polite"}>
        <h2>{tr(language, copy[0], copy[1])}</h2>
        <p>{tr(language, copy[2], copy[3])}</p>
      </div>
      {kind !== "loading" && (
        <Button variant="secondary" onClick={onRetry}>
          {tr(language, copy[4], copy[5])}
        </Button>
      )}
    </section>
  );
}

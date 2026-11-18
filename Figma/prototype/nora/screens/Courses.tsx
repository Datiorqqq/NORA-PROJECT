import { useState } from "react";
import { tr, type Language } from "../shared/model";
import { Icon, Button, Card } from "../shared/ui";
import {
  demoCourses,
  courseTasks,
  dueLabel,
  type PreviewState,
  type DemoCourse,
} from "../data/courses";

import { DemoNotice, StatusPanel } from "../shared/demo-states";

export function Courses({
  language,
  previewState,
  onRetry,
  openNora,
  selectedCourseId,
  setSelectedCourseId,
}: {
  language: Language;
  previewState: PreviewState;
  onRetry: () => void;
  openNora: (prompt?: string, courseId?: string) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const selected = demoCourses.find((course) => course.id === selectedCourseId);
  const visible = demoCourses.filter((course) =>
    `${course.en} ${course.uk}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const askAboutTask = (course: DemoCourse, task: ReturnType<typeof courseTasks>[number]) => {
    const name = language === "uk" ? course.uk : course.en;
    const taskName = language === "uk" ? task.uk : task.en;
    openNora(
      tr(
        language,
        `Help me plan the assignment “${taskName}” for ${name}. ${dueLabel(task.day, language)}. Use the course context and do not invent a missing deadline.`,
        `Допоможи спланувати виконання завдання «${taskName}» з дисципліни «${name}». ${dueLabel(task.day, language)}. Врахуй контекст курсу та не вигадуй відсутній дедлайн.`,
      ),
      course.id,
    );
  };
  return (
    <main className="page courses-page">
      <DemoNotice language={language} />
      <div className="courses-heading">
        <div>
          <h1>
            {selected
              ? language === "uk"
                ? selected.uk
                : selected.en
              : tr(language, "My courses", "Мої курси")}
          </h1>
          <p>
            {selected
              ? language === "uk"
                ? selected.teacherUk
                : selected.teacher
              : tr(
                  language,
                  "Your courses, assignments and study materials in one place.",
                  "Твої дисципліни, завдання й навчальні матеріали в одному місці.",
                )}
          </p>
        </div>
        {selected && (
          <Button variant="secondary" onClick={() => setSelectedCourseId(null)}>
            {tr(language, "Back to courses", "До списку курсів")}
          </Button>
        )}
      </div>
      {previewState === "loading" ? (
        <StatusPanel kind="loading" language={language} onRetry={onRetry} />
      ) : previewState === "moodle-error" ? (
        <StatusPanel kind="moodle-error" language={language} onRetry={onRetry} />
      ) : previewState === "empty" ? (
        <StatusPanel kind="empty-courses" language={language} onRetry={onRetry} />
      ) : selected ? (
        <>
          <Card className="course-context-hero">
            <span className={`course-symbol ${selected.color}`}>
              <Icon name="book" size={26} />
            </span>
            <div>
              <strong>{tr(language, "Work with this course", "Працюй із цим курсом")}</strong>
              <p>
                {tr(
                  language,
                  "Ask NORA using this course and its assignments as context.",
                  "Передай NORA контекст дисципліни та її завдань.",
                )}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() =>
                openNora(
                  tr(
                    language,
                    `Help me plan my work for ${selected.en}. Use only known course information.`,
                    `Допоможи спланувати навчання з дисципліни «${selected.uk}». Використовуй лише відомі дані курсу.`,
                  ),
                  selected.id,
                )
              }
            >
              <Icon name="sparkles" size={17} />
              {tr(language, "Ask about this course", "Запитати про курс")}
            </Button>
          </Card>
          <section className="course-tasks">
            <h2>{tr(language, "Assignments & deadlines", "Завдання й дедлайни")}</h2>
            {courseTasks(selected).map((task) => (
              <Card
                className={`course-task ${task.completed ? "task-completed" : ""}`}
                key={task.id}
              >
                <span className="course-task-icon">
                  <Icon name={task.completed ? "check" : "file"} size={20} />
                </span>
                <div className="course-task-copy">
                  <h3>{language === "uk" ? task.uk : task.en}</h3>
                  <p>{dueLabel(task.day, language)}</p>
                  <span className={`task-status ${task.day === null ? "unknown" : ""}`}>
                    {task.completed
                      ? tr(language, "Submitted", "Здано")
                      : task.day === null
                        ? tr(language, "Check with your teacher", "Уточни у викладача")
                        : tr(language, "To do", "До виконання")}
                  </span>
                </div>
                {!task.completed && (
                  <Button variant="secondary" onClick={() => askAboutTask(selected, task)}>
                    <Icon name="sparkles" size={16} />
                    {tr(language, "Ask NORA", "Запитати NORA")}
                  </Button>
                )}
              </Card>
            ))}
          </section>
          <Card className="course-materials">
            <h2>{tr(language, "Course materials", "Матеріали курсу")}</h2>
            <p>
              {tr(
                language,
                "Real Moodle files will appear after the connector is implemented. This prototype uses demonstration data.",
                "Справжні файли Moodle з’являться після реалізації інтеграції. У цьому прототипі використано демонстраційні дані.",
              )}
            </p>
          </Card>
        </>
      ) : (
        <>
          <label className="course-search">
            <Icon name="search" size={19} />
            <input
              aria-label={tr(language, "Search my courses", "Пошук моїх курсів")}
              placeholder={tr(language, "Search courses…", "Знайти курс…")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <p className="course-count" aria-live="polite">
            {tr(language, `${visible.length} courses`, `Курсів: ${visible.length}`)}
          </p>
          {visible.length ? (
            <div className="course-grid">
              {visible.map((course) => {
                const tasks = courseTasks(course).filter((task) => !task.completed);
                const next = tasks.find((task) => task.day !== null);
                return (
                  <Card className="course-card" key={course.id}>
                    <span className={`course-symbol ${course.color}`}>
                      <Icon name="book" size={23} />
                    </span>
                    <h2>{language === "uk" ? course.uk : course.en}</h2>
                    <p>{language === "uk" ? course.teacherUk : course.teacher}</p>
                    <div className="course-card-meta">
                      <span>
                        {tr(
                          language,
                          `${tasks.length} open assignments`,
                          `До виконання: ${tasks.length}`,
                        )}
                      </span>
                      <strong>
                        {next
                          ? dueLabel(next.day, language)
                          : tr(language, "No upcoming deadlines", "Найближчих дедлайнів немає")}
                      </strong>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedCourseId(course.id)}
                      ariaLabel={tr(
                        language,
                        `Open course ${course.en}`,
                        `Відкрити курс ${course.uk}`,
                      )}
                    >
                      {tr(language, "Open course", "Відкрити курс")}
                      <Icon name="arrow" size={16} />
                    </Button>
                  </Card>
                );
              })}
            </div>
          ) : (
            <StatusPanel kind="no-results" language={language} onRetry={() => setQuery("")} />
          )}
        </>
      )}
    </main>
  );
}

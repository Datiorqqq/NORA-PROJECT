import { tr, type Language } from "../shared/model";
import { calendarEvents } from "./schedule";

export type PreviewState = "ready" | "loading" | "empty" | "moodle-error" | "expired" | "ai-error";
export type DemoCourse = {
  id: string;
  en: string;
  uk: string;
  teacher: string;
  teacherUk: string;
  color: string;
};
export const demoCourses: DemoCourse[] = [
  {
    id: "statistics",
    en: "Applied Statistics",
    uk: "Прикладна статистика",
    teacher: "Prof. Petro Senio",
    teacherUk: "проф. Петро Сеньо",
    color: "blue",
  },
  {
    id: "machine-learning",
    en: "Machine Learning",
    uk: "Машинне навчання",
    teacher: "Assoc. Prof. Olha Kunanets",
    teacherUk: "доц. Ольга Кунанець",
    color: "violet",
  },
  {
    id: "databases",
    en: "Database Systems",
    uk: "Бази даних",
    teacher: "FPMI department",
    teacherUk: "Кафедра ФПМІ",
    color: "green",
  },
  {
    id: "research",
    en: "Research Methods",
    uk: "Методи досліджень",
    teacher: "Assoc. Prof. Andrii Oliinyk",
    teacherUk: "доц. Андрій Олійник",
    color: "amber",
  },
];
export function courseTasks(course: DemoCourse) {
  const tasks = calendarEvents
    .filter((event) => event.course.startsWith(course.en))
    .map((event) => ({
      id: `${course.id}-${event.day}`,
      en: event.title,
      uk: event.titleUk,
      day: event.day as number | null,
      completed: event.status === "completed",
    }));
  if (course.id === "research")
    tasks.push({
      id: "research-topic",
      en: "Confirm the project topic",
      uk: "Погодити тему проєкту",
      day: null,
      completed: false,
    });
  return tasks;
}
export function dueLabel(day: number | null, language: Language) {
  return day === null
    ? tr(language, "Due date not provided", "Дедлайн не вказано")
    : tr(language, `March ${day}, 2025`, `${day} березня 2025`);
}

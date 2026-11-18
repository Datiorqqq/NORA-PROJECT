import type { IconName } from "../shared/ui";

export const classes = [
  {
    time: "08:30",
    end: "09:50",
    title: "Applied Statistics",
    titleUk: "Прикладна статистика",
    room: "Aud. 265",
    roomUk: "ауд. 265",
    type: "Lecture",
    typeUk: "Лекція",
    teacher: "Prof. Petro Senio",
    teacherUk: "проф. Петро Сеньо",
    color: "blue",
    mode: "offline",
  },
  {
    time: "10:10",
    end: "11:30",
    title: "Machine Learning",
    titleUk: "Машинне навчання",
    room: "Aud. 365",
    roomUk: "ауд. 365",
    type: "Practical",
    typeUk: "Практична",
    teacher: "Assoc. Prof. Olha Kunanets",
    teacherUk: "доц. Ольга Кунанець",
    color: "violet",
    mode: "offline",
  },
  {
    time: "11:50",
    end: "13:10",
    title: "Research Methods",
    titleUk: "Методи досліджень",
    room: "Aud. 272/3",
    roomUk: "ауд. 272/3",
    type: "Seminar",
    typeUk: "Семінар",
    teacher: "Assoc. Prof. Andrii Oliinyk",
    teacherUk: "доц. Андрій Олійник",
    color: "green",
    mode: "offline",
  },
];

export const learningResources = [
  {
    title: "Algorithms and Data Structures",
    category: "Syllabi",
    meta: "Syllabus · FPMI · PDF",
    tone: "blue",
    icon: "file" as IconName,
  },
  {
    title: "Numerical Methods",
    category: "Textbooks",
    meta: "Textbook · Prof. M. Zarichnyi",
    tone: "amber",
    icon: "book" as IconName,
  },
  {
    title: "Object-Oriented Programming",
    category: "Methodical guides",
    meta: "Lab guide · FPMI Department",
    tone: "violet",
    icon: "file" as IconName,
  },
  {
    title: "Probability Theory",
    category: "Syllabi",
    meta: "Syllabus · Applied Mathematics",
    tone: "green",
    icon: "book" as IconName,
  },
  {
    title: "Database Systems",
    category: "Methodical guides",
    meta: "Methodical recommendations · PDF",
    tone: "blue",
    icon: "file" as IconName,
  },
  {
    title: "Discrete Mathematics",
    category: "Textbooks",
    meta: "Textbook · A. Oliinyk",
    tone: "amber",
    icon: "book" as IconName,
  },
];

type CalendarEvent = {
  day: number;
  title: string;
  titleUk: string;
  course: string;
  courseUk: string;
  status: "upcoming" | "completed";
  tone: "coral" | "amber" | "violet" | "green";
};

export type CalendarView = "day" | "week" | "twoWeeks" | "month";

type ScheduleEntry = {
  time: string;
  end: string;
  title: string;
  titleUk: string;
  room: string;
  roomUk: string;
  type: string;
  typeUk: string;
  tone: "blue" | "violet" | "green" | "amber";
};

const schedulePatterns: ScheduleEntry[][] = [
  [
    {
      time: "08:30",
      end: "09:50",
      title: "Numerical Methods",
      titleUk: "Чисельні методи",
      room: "Aud. 265",
      roomUk: "ауд. 265",
      type: "Lecture",
      typeUk: "Лекція",
      tone: "blue",
    },
    {
      time: "10:10",
      end: "11:30",
      title: "Database Systems",
      titleUk: "Бази даних",
      room: "Aud. 365",
      roomUk: "ауд. 365",
      type: "Lab",
      typeUk: "Лабораторна",
      tone: "violet",
    },
  ],
  [
    {
      time: "10:10",
      end: "11:30",
      title: "Probability Theory",
      titleUk: "Теорія ймовірностей",
      room: "Aud. 271",
      roomUk: "ауд. 271",
      type: "Practical",
      typeUk: "Практична",
      tone: "amber",
    },
    {
      time: "11:50",
      end: "13:10",
      title: "Machine Learning",
      titleUk: "Машинне навчання",
      room: "Aud. 365",
      roomUk: "ауд. 365",
      type: "Lecture",
      typeUk: "Лекція",
      tone: "violet",
    },
  ],
  [
    {
      time: "08:30",
      end: "09:50",
      title: "Applied Statistics",
      titleUk: "Прикладна статистика",
      room: "Aud. 265",
      roomUk: "ауд. 265",
      type: "Lecture",
      typeUk: "Лекція",
      tone: "blue",
    },
    {
      time: "10:10",
      end: "11:30",
      title: "Machine Learning",
      titleUk: "Машинне навчання",
      room: "Aud. 365",
      roomUk: "ауд. 365",
      type: "Practical",
      typeUk: "Практична",
      tone: "violet",
    },
    {
      time: "11:50",
      end: "13:10",
      title: "Research Methods",
      titleUk: "Методи досліджень",
      room: "Aud. 272/3",
      roomUk: "ауд. 272/3",
      type: "Seminar",
      typeUk: "Семінар",
      tone: "green",
    },
  ],
  [
    {
      time: "08:30",
      end: "09:50",
      title: "Object-Oriented Programming",
      titleUk: "Об’єктно-орієнтоване програмування",
      room: "Lab 118",
      roomUk: "лаб. 118",
      type: "Lab",
      typeUk: "Лабораторна",
      tone: "green",
    },
    {
      time: "11:50",
      end: "13:10",
      title: "Discrete Mathematics",
      titleUk: "Дискретна математика",
      room: "Aud. 439",
      roomUk: "ауд. 439",
      type: "Lecture",
      typeUk: "Лекція",
      tone: "amber",
    },
  ],
  [
    {
      time: "10:10",
      end: "11:30",
      title: "Research Methods",
      titleUk: "Методи досліджень",
      room: "Aud. 272/3",
      roomUk: "ауд. 272/3",
      type: "Seminar",
      typeUk: "Семінар",
      tone: "green",
    },
    {
      time: "11:50",
      end: "13:10",
      title: "Applied Statistics",
      titleUk: "Прикладна статистика",
      room: "Aud. 265",
      roomUk: "ауд. 265",
      type: "Practical",
      typeUk: "Практична",
      tone: "blue",
    },
  ],
  [],
  [],
];

export const scheduleDays = Array.from({ length: 14 }, (_, index) => {
  const weekdayIndex = index % 7;
  return {
    date: 10 + index,
    weekday: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
      weekdayIndex
    ],
    weekdayUk: ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця", "Субота", "Неділя"][
      weekdayIndex
    ],
    short: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][weekdayIndex],
    shortUk: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"][weekdayIndex],
    entries: schedulePatterns[weekdayIndex],
  };
});

export const calendarEvents: CalendarEvent[] = [
  {
    day: 5,
    title: "Lab 2 · Regression models",
    titleUk: "Лабораторна №2 · Регресійні моделі",
    course: "Applied Statistics",
    courseUk: "Прикладна статистика",
    status: "completed",
    tone: "green",
  },
  {
    day: 8,
    title: "SQL practice set",
    titleUk: "Практикум із SQL",
    course: "Database Systems",
    courseUk: "Бази даних",
    status: "completed",
    tone: "green",
  },
  {
    day: 14,
    title: "Lab 4 · Neural networks",
    titleUk: "Лабораторна №4 · Нейронні мережі",
    course: "Machine Learning · Lab",
    courseUk: "Машинне навчання · Лабораторна",
    status: "upcoming",
    tone: "coral",
  },
  {
    day: 16,
    title: "Module 1 · Probability",
    titleUk: "Модуль №1 · Теорія ймовірностей",
    course: "Applied Statistics · Module",
    courseUk: "Прикладна статистика · Модуль",
    status: "upcoming",
    tone: "amber",
  },
  {
    day: 18,
    title: "Lab 3 · SQL queries",
    titleUk: "Лабораторна №3 · SQL-запити",
    course: "Database Systems · Lab",
    courseUk: "Бази даних · Лабораторна",
    status: "upcoming",
    tone: "violet",
  },
  {
    day: 21,
    title: "Coursework outline",
    titleUk: "План курсової роботи",
    course: "Research Methods · Assignment",
    courseUk: "Методи досліджень · Завдання",
    status: "upcoming",
    tone: "violet",
  },
  {
    day: 24,
    title: "Data visualization report",
    titleUk: "Звіт із візуалізації даних",
    course: "Applied Statistics · Project",
    courseUk: "Прикладна статистика · Проєкт",
    status: "upcoming",
    tone: "amber",
  },
];

export const calendarDays = [
  { day: 24, outside: true },
  { day: 25, outside: true },
  { day: 26, outside: true },
  { day: 27, outside: true },
  { day: 28, outside: true },
  ...Array.from({ length: 31 }, (_, index) => ({ day: index + 1, outside: false })),
  { day: 1, outside: true },
  { day: 2, outside: true },
  { day: 3, outside: true },
  { day: 4, outside: true },
  { day: 5, outside: true },
  { day: 6, outside: true },
];

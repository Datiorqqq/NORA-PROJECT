import { useEffect, useState } from "react";
import { tr, type Language } from "../shared/model";
import { Icon, Button, Card, SectionTitle, type IconName } from "../shared/ui";
import {
  classes,
  learningResources,
  scheduleDays,
  calendarEvents,
  calendarDays,
  type CalendarView,
} from "../data/schedule";
import type { PreviewState } from "../data/courses";
import { DemoNotice, StatusPanel } from "../shared/demo-states";

export function Dashboard({
  openNora,
  language,
  previewState,
  onRetry,
  openCourses,
}: {
  openNora: (prompt?: string) => void;
  language: Language;
  previewState: PreviewState;
  onRetry: () => void;
  openCourses: () => void;
}) {
  const [quickQuestion, setQuickQuestion] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [resourceQuery, setResourceQuery] = useState("");
  const [resourceCategory, setResourceCategory] = useState("All");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<
    (typeof learningResources)[number] | null
  >(null);
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState(14);
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const weekdays =
    language === "uk"
      ? ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const selectedEvents = calendarEvents.filter((event) => event.day === selectedDay);
  const upcomingEvents = calendarEvents.filter((event) => event.status === "upcoming");
  const completedEvents = calendarEvents.filter((event) => event.status === "completed");
  const visibleScheduleDays =
    calendarView === "day"
      ? [scheduleDays.find((day) => day.date === selectedDay) ?? scheduleDays[2]]
      : calendarView === "week"
        ? scheduleDays.slice(0, 7)
        : scheduleDays;
  const openSchedule = (view: CalendarView = "month") => {
    setCalendarView(view);
    setCalendarOpen(true);
  };
  const openLibrary = (resource: (typeof learningResources)[number] | null = null) => {
    setSelectedResource(resource);
    setLibraryOpen(true);
  };
  const toggleSavedResource = (title: string) => {
    setSavedResources((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
  };
  const downloadResource = (resource: (typeof learningResources)[number]) => {
    const content = `${resource.title}\n${resource.meta}\n\n${tr(
      language,
      "This demo library entry is ready for connection to the university repository.",
      "Цей демонстраційний запис бібліотеки готовий до підключення до репозитарію університету.",
    )}`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${resource.title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const visibleResources = learningResources.filter((resource) => {
    const matchesCategory = resourceCategory === "All" || resource.category === resourceCategory;
    const matchesQuery = `${resource.title} ${resource.meta}`
      .toLowerCase()
      .includes(resourceQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  useEffect(() => {
    if (!calendarOpen && !libraryOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = document.querySelector<HTMLElement>(".calendar-modal, .library-modal");
    const focusable = () =>
      Array.from(
        modal?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href], select, [tabindex="0"]',
        ) ?? [],
      ).filter((element) => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      const first = items[0],
        last = items[items.length - 1];
      if (!first) return;
      if (
        event.shiftKey &&
        (document.activeElement === first || !modal?.contains(document.activeElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        (document.activeElement === last || !modal?.contains(document.activeElement))
      ) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", trapFocus);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCalendarOpen(false);
        setLibraryOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", trapFocus);
      window.removeEventListener("keydown", closeOnEscape);
      opener?.focus();
    };
  }, [calendarOpen, libraryOpen]);

  if (previewState === "loading" || previewState === "moodle-error" || previewState === "empty") {
    return (
      <main className="page dashboard-page">
        <DemoNotice language={language} />
        <h1>{tr(language, "Student dashboard", "Кабінет студента")}</h1>
        {previewState === "empty" ? (
          <div className="state-grid">
            <StatusPanel kind="empty-courses" language={language} onRetry={onRetry} />
            <StatusPanel kind="empty-deadlines" language={language} onRetry={onRetry} />
          </div>
        ) : (
          <StatusPanel kind={previewState} language={language} onRetry={onRetry} />
        )}
      </main>
    );
  }
  return (
    <main className="page dashboard-page">
      <DemoNotice language={language} />
      <div className="dashboard-course-link">
        <Button variant="secondary" onClick={openCourses}>
          <Icon name="book" size={18} />
          {tr(language, "My courses & assignments", "Мої курси та завдання")}
          <Icon name="arrow" size={16} />
        </Button>
      </div>
      <div className="welcome-block">
        <div className="welcome-row">
          <div>
            <div className="title-xl">
              {tr(language, "Good morning, Alexandra", "Доброго ранку, Олександро")}
            </div>
            <div className="subtitle">
              {tr(
                language,
                "Here’s what’s happening with your studies today.",
                "Ось що заплановано у твоєму навчанні сьогодні.",
              )}
            </div>
          </div>
          <div className="welcome-meta">
            <div className="rating-badge">
              <Icon name="award" size={17} />
              <span>
                <small>
                  {tr(language, "Academic rating · Scholarship", "Академічний рейтинг · Стипендія")}
                </small>
                <strong>{tr(language, "#4 in group PMA-22", "№4 у групі PMA-22")}</strong>
              </span>
            </div>
            <div className="date-chip">
              <Icon name="calendar" size={17} />{" "}
              {tr(language, "Wednesday, March 12", "Середа, 12 березня")}
            </div>
          </div>
        </div>
        <div className="nora-quickbar">
          <span className="quickbar-icon">
            <Icon name="sparkles" size={18} />
          </span>
          <input
            aria-label={tr(language, "Ask NORA", "Запитати NORA")}
            value={quickQuestion}
            onChange={(event) => setQuickQuestion(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && openNora(quickQuestion)}
            placeholder={tr(
              language,
              "Ask NORA about your courses, deadlines, or university services...",
              "Запитай NORA про курси, дедлайни або сервіси університету...",
            )}
          />
          <Button
            variant="icon"
            className="quickbar-send"
            ariaLabel={tr(language, "Open NORA assistant", "Відкрити асистента NORA")}
            onClick={() => openNora(quickQuestion)}
          >
            <Icon name="arrow" size={17} />
          </Button>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card className="schedule-card">
          <SectionTitle
            action={
              <div className="section-actions">
                <span className="week-badge">
                  {tr(language, "Numerator week", "Тиждень чисельника")}
                </span>
                <span className="session-chip">
                  <Icon name="calendar" size={13} />
                  {tr(
                    language,
                    "Winter session: Dec 26 – Jan 10",
                    "Зимова сесія: 26 грудня – 10 січня",
                  )}
                </span>
                <Button
                  variant="ghost"
                  className="text-action"
                  onClick={() => openSchedule("week")}
                >
                  {tr(language, "Full timetable", "Повний розклад")} <Icon name="arrow" size={16} />
                </Button>
              </div>
            }
          >
            {tr(language, "Today’s schedule", "Розклад на сьогодні")}
          </SectionTitle>
          <div className="class-list">
            {classes.map((item, index) => (
              <div className="class-row" key={item.time}>
                <div className="class-time">
                  <strong>{item.time}</strong>
                  <span>{item.end}</span>
                </div>
                <div className={`class-bar ${item.color}`} />
                <div className="class-main">
                  <div className="class-kicker">
                    {tr(language, "Class", "Пара")} {index + 1}
                  </div>
                  <div className="class-title">{language === "uk" ? item.titleUk : item.title}</div>
                  <div className="class-detail">
                    <span className={`class-mode ${item.mode}`}>
                      <i /> {tr(language, "On campus", "Очно")}
                    </span>
                    <span>•</span>
                    {language === "uk" ? item.roomUk : item.room}
                    <span>•</span>
                    {language === "uk" ? item.typeUk : item.type}
                    <span>•</span>
                    <span className="class-teacher">
                      {language === "uk" ? item.teacherUk : item.teacher}
                    </span>
                  </div>
                </div>
                <div className="class-actions">
                  {item.mode === "online" && (
                    <Button
                      variant="ghost"
                      className="meet-action"
                      ariaLabel={`Join ${item.title} in Google Meet`}
                      onClick={() =>
                        window.open("https://meet.google.com", "_blank", "noopener,noreferrer")
                      }
                    >
                      <Icon name="video" size={15} /> Join Meet
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="ask-class-action"
                    onClick={() =>
                      openNora(
                        tr(
                          language,
                          `Help me prepare for my ${item.title} ${item.type.toLowerCase()}.`,
                          `Допоможи підготуватися до заняття з дисципліни «${item.titleUk}».`,
                        ),
                      )
                    }
                  >
                    <Icon name="sparkles" size={15} /> {tr(language, "Ask NORA", "Запитати NORA")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="deadlines-card calendar-preview-card">
          <SectionTitle
            action={
              <Button
                variant="ghost"
                className={`reminder-toggle ${remindersEnabled ? "active" : ""}`}
                ariaPressed={remindersEnabled}
                onClick={() => setRemindersEnabled(!remindersEnabled)}
              >
                <span className="toggle-track">
                  <i />
                </span>
                {tr(language, "Reminders", "Нагадування")}
              </Button>
            }
          >
            <span className="title-icon coral">
              <Icon name="calendar" size={18} />
            </span>{" "}
            {tr(language, "Deadlines calendar", "Календар дедлайнів")}
          </SectionTitle>
          <button
            type="button"
            className="mini-calendar-open"
            onClick={() => openSchedule("month")}
            aria-label={tr(language, "Open full deadlines calendar", "Відкрити повний календар")}
          >
            <span className="mini-calendar-header">
              <span>
                <strong>{tr(language, "March 2025", "Березень 2025")}</strong>
                <small>
                  {tr(language, "5 upcoming · 2 completed", "5 майбутніх · 2 завершені")}
                </small>
              </span>
              <span className="mini-calendar-link">
                {tr(language, "Open calendar", "Відкрити")} <Icon name="arrow" size={14} />
              </span>
            </span>
            <span className="mini-calendar-grid" aria-hidden="true">
              {weekdays.map((day) => (
                <span className="mini-weekday" key={day}>
                  {day}
                </span>
              ))}
              {calendarDays.map((date, index) => {
                const events = date.outside
                  ? []
                  : calendarEvents.filter((event) => event.day === date.day);
                return (
                  <span
                    className={`mini-calendar-day ${date.outside ? "outside" : ""} ${
                      date.day === 12 && !date.outside ? "today" : ""
                    }`}
                    key={`${date.day}-${index}`}
                  >
                    {date.day}
                    {events.length > 0 && (
                      <i
                        className={
                          events.some((event) => event.status === "upcoming") ? "due" : "done"
                        }
                      />
                    )}
                  </span>
                );
              })}
            </span>
          </button>
          <div className="calendar-next-deadline">
            <span className="deadline-date">
              <strong>14</strong>
              <small>{tr(language, "MAR", "БЕР")}</small>
            </span>
            <span className="deadline-copy">
              <strong>
                {tr(language, "Lab 4 · Neural networks", "Лабораторна №4 · Нейронні мережі")}
              </strong>
              <small>
                {tr(language, "Next deadline · in 2 days", "Найближчий дедлайн · за 2 дні")}
              </small>
            </span>
            <span className="deadline-pill urgent">{tr(language, "Urgent", "Терміново")}</span>
          </div>
          <div className={`reminder-status ${remindersEnabled ? "active" : ""}`}>
            <Icon name={remindersEnabled ? "bell" : "close"} size={14} />
            {remindersEnabled
              ? tr(
                  language,
                  "Notifications are enabled for upcoming deadlines",
                  "Сповіщення про найближчі дедлайни ввімкнено",
                )
              : tr(
                  language,
                  "Deadline notifications are paused",
                  "Сповіщення про дедлайни призупинено",
                )}
          </div>
        </Card>

        <Card className="resources-card">
          <SectionTitle
            action={
              <Button variant="ghost" className="text-action" onClick={() => openLibrary()}>
                {tr(language, "Open FPMI library", "Відкрити бібліотеку ФПМІ")}{" "}
                <Icon name="arrow" size={16} />
              </Button>
            }
          >
            {tr(
              language,
              "Syllabi, textbooks & methodical guides",
              "Силабуси, підручники та методички",
            )}
          </SectionTitle>
          <div className="resource-tools">
            <label className="resource-search">
              <Icon name="search" size={16} />
              <input
                value={resourceQuery}
                onChange={(event) => setResourceQuery(event.target.value)}
                placeholder={tr(
                  language,
                  "Search by discipline, title, or author...",
                  "Пошук за дисципліною, назвою або автором...",
                )}
              />
            </label>
            <div
              className="resource-filters"
              aria-label={tr(language, "Resource categories", "Категорії матеріалів")}
            >
              {["All", "Syllabi", "Textbooks", "Methodical guides"].map((category) => (
                <Button
                  variant="ghost"
                  className={resourceCategory === category ? "active" : ""}
                  ariaPressed={resourceCategory === category}
                  key={category}
                  onClick={() => setResourceCategory(category)}
                >
                  {category === "All"
                    ? tr(language, "All", "Усі")
                    : category === "Syllabi"
                      ? tr(language, "Syllabi", "Силабуси")
                      : category === "Textbooks"
                        ? tr(language, "Textbooks", "Підручники")
                        : tr(language, "Methodical guides", "Методички")}
                </Button>
              ))}
            </div>
          </div>
          <div className="resource-grid">
            {visibleResources.map((resource) => (
              <div className="resource-tile" key={`${resource.category}-${resource.title}`}>
                <div className={`resource-cover ${resource.tone}-cover`}>
                  <Icon name={resource.icon} size={22} />
                </div>
                <div>
                  <strong>{resource.title}</strong>
                  <span>{resource.meta}</span>
                </div>
                <Button
                  variant="icon"
                  ariaLabel={`${tr(language, "Open", "Відкрити")} ${resource.title}`}
                  onClick={() => openLibrary(resource)}
                >
                  <Icon name="chevron" size={17} />
                </Button>
              </div>
            ))}
            {visibleResources.length === 0 && (
              <div className="resource-empty">
                {tr(
                  language,
                  "No FPMI materials match this search.",
                  "Матеріалів ФПМІ за цим запитом не знайдено.",
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="requests-card">
          <SectionTitle>{tr(language, "Campus services", "Сервіси університету")}</SectionTitle>
          <div className="service-grid">
            {[
              {
                icon: "mail" as IconName,
                title: tr(language, "Dean’s Office & Departments", "Деканат і кафедри"),
                links: [
                  tr(language, "Contacts", "Контакти"),
                  tr(language, "Faculty directory", "Викладачі"),
                ],
                tone: "amber",
              },
              {
                icon: "building" as IconName,
                title: tr(language, "Housing", "Гуртожиток"),
                links: [
                  tr(language, "Dormitory payment", "Оплата"),
                  tr(language, "Room pass", "Перепустка"),
                ],
                tone: "green",
              },
              {
                icon: "award" as IconName,
                title: tr(language, "Career & Erasmus+", "Кар’єра та Erasmus+"),
                links: [
                  tr(language, "Internships", "Стажування"),
                  tr(language, "Exchange", "Обмін"),
                ],
                tone: "violet",
              },
              {
                icon: "user" as IconName,
                title: tr(language, "Student Life", "Студентське життя"),
                links: [
                  tr(language, "Events", "Події"),
                  tr(language, "Student groups", "Організації"),
                ],
                tone: "blue",
              },
            ].map((service) => (
              <Button variant="ghost" className="service-card" key={service.title}>
                <span className={`service-icon ${service.tone}`}>
                  <Icon name={service.icon} size={18} />
                </span>
                <span className="service-copy">
                  <strong>{service.title}</strong>
                  <small>{service.links.join(" · ")}</small>
                </span>
                <Icon name="chevron" size={15} />
              </Button>
            ))}
          </div>
        </Card>
      </div>
      {libraryOpen && (
        <div
          className="library-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLibraryOpen(false);
          }}
        >
          <section
            className="library-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="library-modal-title"
          >
            <header className="library-modal-header">
              <div className="library-heading-icon">
                <Icon name="library" size={22} />
              </div>
              <div>
                <span>{tr(language, "FPMI DIGITAL COLLECTION", "ЦИФРОВА КОЛЕКЦІЯ ФПМІ")}</span>
                <h2 id="library-modal-title">
                  {tr(language, "University library", "Університетська бібліотека")}
                </h2>
                <p>
                  {tr(
                    language,
                    "Find syllabi, textbooks, and guides for your courses.",
                    "Знаходь силабуси, підручники й методички до своїх курсів.",
                  )}
                </p>
              </div>
              <Button
                variant="icon"
                className="library-modal-close"
                ariaLabel={tr(language, "Close library", "Закрити бібліотеку")}
                onClick={() => setLibraryOpen(false)}
              >
                <Icon name="close" size={20} />
              </Button>
            </header>
            <div className="library-modal-tools">
              <label className="resource-search">
                <Icon name="search" size={17} />
                <input
                  autoFocus
                  value={resourceQuery}
                  onChange={(event) => setResourceQuery(event.target.value)}
                  placeholder={tr(language, "Search the library...", "Пошук у бібліотеці...")}
                />
              </label>
              <div
                className="resource-filters"
                aria-label={tr(language, "Library categories", "Категорії бібліотеки")}
              >
                {["All", "Syllabi", "Textbooks", "Methodical guides"].map((category) => (
                  <Button
                    variant="ghost"
                    className={resourceCategory === category ? "active" : ""}
                    ariaPressed={resourceCategory === category}
                    key={category}
                    onClick={() => setResourceCategory(category)}
                  >
                    {category === "All"
                      ? tr(language, "All", "Усі")
                      : category === "Syllabi"
                        ? tr(language, "Syllabi", "Силабуси")
                        : category === "Textbooks"
                          ? tr(language, "Textbooks", "Підручники")
                          : tr(language, "Methodical guides", "Методички")}
                  </Button>
                ))}
              </div>
            </div>
            <div className="library-modal-body">
              <div className="library-results">
                <div className="library-results-meta">
                  <span>
                    {tr(
                      language,
                      `${visibleResources.length} materials found`,
                      `Знайдено матеріалів: ${visibleResources.length}`,
                    )}
                  </span>
                  <span>
                    <Icon name="check" size={13} /> {savedResources.length}{" "}
                    {tr(language, "saved", "збережено")}
                  </span>
                </div>
                {visibleResources.map((resource) => {
                  const isSelected = selectedResource?.title === resource.title;
                  const isSaved = savedResources.includes(resource.title);
                  return (
                    <button
                      type="button"
                      className={`library-result ${isSelected ? "selected" : ""}`}
                      key={resource.title}
                      onClick={() => setSelectedResource(resource)}
                    >
                      <span className={`resource-cover ${resource.tone}-cover`}>
                        <Icon name={resource.icon} size={21} />
                      </span>
                      <span>
                        <strong>{resource.title}</strong>
                        <small>{resource.meta}</small>
                      </span>
                      {isSaved && (
                        <span className="library-saved-mark">
                          <Icon name="check" size={13} />
                        </span>
                      )}
                      <Icon name="chevron" size={16} />
                    </button>
                  );
                })}
                {visibleResources.length === 0 && (
                  <div className="library-empty">
                    <Icon name="search" size={24} />
                    <strong>{tr(language, "Nothing found", "Нічого не знайдено")}</strong>
                    <span>
                      {tr(
                        language,
                        "Try another title or category.",
                        "Спробуй іншу назву або категорію.",
                      )}
                    </span>
                  </div>
                )}
              </div>
              <aside className="library-preview">
                {selectedResource ? (
                  <>
                    <div className={`library-preview-cover ${selectedResource.tone}-cover`}>
                      <Icon name={selectedResource.icon} size={34} />
                    </div>
                    <span className="library-preview-category">{selectedResource.category}</span>
                    <h3>{selectedResource.title}</h3>
                    <p>{selectedResource.meta}</p>
                    <div className="library-preview-info">
                      <span>
                        <small>{tr(language, "Format", "Формат")}</small>
                        <strong>PDF</strong>
                      </span>
                      <span>
                        <small>{tr(language, "Access", "Доступ")}</small>
                        <strong>{tr(language, "For students", "Для студентів")}</strong>
                      </span>
                    </div>
                    <Button
                      className="library-download"
                      onClick={() => downloadResource(selectedResource)}
                    >
                      <Icon name="download" size={16} />
                      {tr(language, "Download material", "Завантажити матеріал")}
                    </Button>
                    <Button
                      variant="secondary"
                      className="library-save"
                      ariaPressed={savedResources.includes(selectedResource.title)}
                      onClick={() => toggleSavedResource(selectedResource.title)}
                    >
                      <Icon
                        name={savedResources.includes(selectedResource.title) ? "check" : "folder"}
                        size={16}
                      />
                      {savedResources.includes(selectedResource.title)
                        ? tr(language, "Saved to your library", "Збережено у твоїй бібліотеці")
                        : tr(language, "Save for later", "Зберегти на потім")}
                    </Button>
                  </>
                ) : (
                  <div className="library-preview-empty">
                    <Icon name="book" size={30} />
                    <strong>{tr(language, "Choose a material", "Обери матеріал")}</strong>
                    <span>
                      {tr(
                        language,
                        "Its details and actions will appear here.",
                        "Тут з’являться опис і доступні дії.",
                      )}
                    </span>
                  </div>
                )}
              </aside>
            </div>
          </section>
        </div>
      )}
      {calendarOpen && (
        <div
          className="calendar-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCalendarOpen(false);
          }}
        >
          <section
            className="calendar-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="calendar-modal-title"
          >
            <header className="calendar-modal-header">
              <div>
                <span className="calendar-modal-kicker">
                  {tr(language, "STUDY PLANNER", "НАВЧАЛЬНИЙ ПЛАНЕР")}
                </span>
                <h2 id="calendar-modal-title">
                  {tr(language, "Deadlines & history", "Дедлайни та історія")}
                </h2>
                <p>
                  {tr(
                    language,
                    "Plan submissions and review completed work in one place.",
                    "Плануй здачі та переглядай завершені роботи в одному місці.",
                  )}
                </p>
              </div>
              <Button
                variant="icon"
                className="calendar-modal-close"
                ariaLabel={tr(language, "Close calendar", "Закрити календар")}
                onClick={() => setCalendarOpen(false)}
              >
                <Icon name="close" size={20} />
              </Button>
            </header>
            <div className="calendar-modal-body">
              <div className="large-calendar">
                <div className="large-calendar-toolbar">
                  <div>
                    <strong>{tr(language, "March 2025", "Березень 2025")}</strong>
                    <span>
                      {tr(language, "Spring semester · Week 8", "Весняний семестр · 8 тиждень")}
                    </span>
                  </div>
                  <div
                    className="calendar-view-switcher"
                    role="tablist"
                    aria-label={tr(language, "Calendar view", "Вигляд календаря")}
                  >
                    {(
                      [
                        ["day", "Day", "День"],
                        ["week", "Week", "Тиждень"],
                        ["twoWeeks", "2 weeks", "2 тижні"],
                        ["month", "Month", "Місяць"],
                      ] as const
                    ).map(([view, label, labelUk]) => (
                      <button
                        type="button"
                        role="tab"
                        aria-selected={calendarView === view}
                        className={calendarView === view ? "active" : ""}
                        key={view}
                        onClick={() => setCalendarView(view)}
                      >
                        {language === "uk" ? labelUk : label}
                      </button>
                    ))}
                  </div>
                </div>
                {calendarView === "month" ? (
                  <>
                    <div className="calendar-legend month-legend">
                      <span>
                        <i className="due" />
                        {tr(language, "Deadline", "Дедлайн")}
                      </span>
                      <span>
                        <i className="done" />
                        {tr(language, "Completed", "Завершено")}
                      </span>
                    </div>
                    <div className="large-calendar-grid">
                      {weekdays.map((day) => (
                        <div className="large-weekday" key={day}>
                          {day}
                        </div>
                      ))}
                      {calendarDays.map((date, index) => {
                        const events = date.outside
                          ? []
                          : calendarEvents.filter((event) => event.day === date.day);
                        return (
                          <button
                            type="button"
                            className={`large-calendar-day ${date.outside ? "outside" : ""} ${
                              selectedDay === date.day && !date.outside ? "selected" : ""
                            } ${date.day === 12 && !date.outside ? "today" : ""}`}
                            key={`${date.day}-${index}`}
                            disabled={date.outside}
                            onClick={() => setSelectedDay(date.day)}
                            aria-label={`${date.day} ${tr(language, "March", "березня")}`}
                          >
                            <span>{date.day}</span>
                            <span className="day-event-dots">
                              {events.map((event) => (
                                <i
                                  className={event.status === "completed" ? "done" : event.tone}
                                  key={event.title}
                                />
                              ))}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="selected-day-panel">
                      <div className="selected-day-date">
                        <strong>{selectedDay}</strong>
                        <span>{tr(language, "March", "березня")}</span>
                      </div>
                      <div className="selected-day-content">
                        <small>{tr(language, "Selected day", "Обраний день")}</small>
                        {selectedEvents.length ? (
                          selectedEvents.map((event) => (
                            <div className="selected-event" key={event.title}>
                              <i className={event.status === "completed" ? "done" : event.tone} />
                              <span>
                                <strong>{language === "uk" ? event.titleUk : event.title}</strong>
                                <small>{language === "uk" ? event.courseUk : event.course}</small>
                              </span>
                            </div>
                          ))
                        ) : (
                          <strong>
                            {tr(
                              language,
                              "No deadlines found for this date.",
                              "На обрану дату дедлайнів не знайдено.",
                            )}
                          </strong>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`schedule-view schedule-view-${calendarView}`}>
                    {calendarView === "day" && (
                      <div className="schedule-day-navigation">
                        <Button
                          variant="icon"
                          className="schedule-previous"
                          ariaLabel={tr(language, "Previous day", "Попередній день")}
                          disabled={selectedDay <= 10}
                          onClick={() => setSelectedDay(Math.max(10, selectedDay - 1))}
                        >
                          <Icon name="chevron" size={17} />
                        </Button>
                        <span>
                          {tr(language, "Navigate study days", "Перемикай навчальні дні")}
                        </span>
                        <Button
                          variant="icon"
                          ariaLabel={tr(language, "Next day", "Наступний день")}
                          disabled={selectedDay >= 23}
                          onClick={() => setSelectedDay(Math.min(23, selectedDay + 1))}
                        >
                          <Icon name="chevron" size={17} />
                        </Button>
                      </div>
                    )}
                    <div className="schedule-columns">
                      {visibleScheduleDays.map((day) => (
                        <section
                          className={`schedule-day-column ${day.date === 12 ? "today" : ""}`}
                          key={day.date}
                        >
                          <button
                            type="button"
                            className="schedule-day-heading"
                            onClick={() => {
                              setSelectedDay(day.date);
                              if (calendarView !== "day") setCalendarView("day");
                            }}
                          >
                            <span>{language === "uk" ? day.shortUk : day.short}</span>
                            <strong>{day.date}</strong>
                            <small>{tr(language, "Mar", "бер")}</small>
                          </button>
                          <div className="schedule-entry-list">
                            {day.entries.length ? (
                              day.entries.map((entry) => (
                                <article
                                  className={`schedule-entry ${entry.tone}`}
                                  key={entry.time}
                                >
                                  <span className="schedule-entry-time">
                                    <strong>{entry.time}</strong>
                                    <small>{entry.end}</small>
                                  </span>
                                  <span className="schedule-entry-copy">
                                    <strong>
                                      {language === "uk" ? entry.titleUk : entry.title}
                                    </strong>
                                    <small>
                                      {language === "uk" ? entry.roomUk : entry.room} ·{" "}
                                      {language === "uk" ? entry.typeUk : entry.type}
                                    </small>
                                  </span>
                                </article>
                              ))
                            ) : (
                              <div className="schedule-day-empty">
                                {tr(language, "No classes", "Пар немає")}
                              </div>
                            )}
                          </div>
                        </section>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <aside className="calendar-agenda">
                <div className="agenda-section">
                  <div className="agenda-heading">
                    <span>
                      <Icon name="clock" size={17} />
                      {tr(language, "Upcoming", "Найближчі")}
                    </span>
                    <small>{upcomingEvents.length}</small>
                  </div>
                  <div className="agenda-list">
                    {upcomingEvents.map((event) => (
                      <button
                        type="button"
                        className="agenda-item"
                        key={event.title}
                        onClick={() => setSelectedDay(event.day)}
                      >
                        <span className={`agenda-date ${event.tone}`}>
                          <strong>{event.day}</strong>
                          <small>{tr(language, "MAR", "БЕР")}</small>
                        </span>
                        <span>
                          <strong>{language === "uk" ? event.titleUk : event.title}</strong>
                          <small>{language === "uk" ? event.courseUk : event.course}</small>
                        </span>
                        <Icon name="chevron" size={15} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="agenda-section history-section">
                  <div className="agenda-heading">
                    <span>
                      <Icon name="history" size={17} />
                      {tr(language, "Submission history", "Історія здач")}
                    </span>
                    <small>{completedEvents.length}</small>
                  </div>
                  <div className="agenda-list">
                    {completedEvents.map((event) => (
                      <button
                        type="button"
                        className="agenda-item completed"
                        key={event.title}
                        onClick={() => setSelectedDay(event.day)}
                      >
                        <span className="agenda-status-check">
                          <Icon name="check" size={14} />
                        </span>
                        <span>
                          <strong>{language === "uk" ? event.titleUk : event.title}</strong>
                          <small>
                            {tr(
                              language,
                              `Submitted Mar ${event.day}`,
                              `Здано ${event.day} березня`,
                            )}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

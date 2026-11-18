import { useEffect, useState } from "react";
import { tr, type Page, type Language } from "./model";
import { Icon, NoraLogo, Button, Card, type IconName } from "./ui";

const nav = [
  { id: "dashboard" as Page, en: "Overview", uk: "Огляд", icon: "home" as IconName },
  { id: "courses" as Page, en: "My courses", uk: "Мої курси", icon: "book" as IconName },
  { id: "assistant" as Page, en: "NORA AI", uk: "NORA AI", icon: "sparkles" as IconName },
  { id: "profile" as Page, en: "Academic hub", uk: "Профіль", icon: "user" as IconName },
];

export function Sidebar({
  page,
  setPage,
  language,
}: {
  page: Page;
  setPage: (page: Page) => void;
  language: Language;
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <NoraLogo />
        </div>
        <div>
          <div className="brand-name">NORA</div>
          <div className="brand-tag">{tr(language, "AI campus", "AI-кампус")}</div>
        </div>
      </div>
      <div className="nav-label">{tr(language, "Workspace", "Робочий простір")}</div>
      <nav
        className="nav-list"
        aria-label={tr(language, "Primary navigation", "Основна навігація")}
      >
        {nav.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => setPage(item.id)}
            ariaCurrent={page === item.id ? "page" : undefined}
            ariaLabel={language === "uk" ? item.uk : item.en}
          >
            <Icon name={item.icon} size={19} />
            <span>{language === "uk" ? item.uk : item.en}</span>
          </Button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <Card className="semester-card">
        <div className="semester-top">
          <div className="semester-icon">
            <Icon name="calendar" size={17} />
          </div>
          <span>{tr(language, "Spring semester", "Весняний семестр")}</span>
        </div>
        <div className="semester-progress">
          <span />
        </div>
        <div className="semester-meta">
          <span>{tr(language, "Week 8 of 16", "8 тиждень із 16")}</span>
          <span>50%</span>
        </div>
      </Card>
      <Button
        variant="ghost"
        className="sidebar-profile"
        ariaLabel={tr(language, "Open profile", "Відкрити профіль")}
        onClick={() => setPage("profile")}
      >
        <div className="avatar">AK</div>
        <div className="profile-copy">
          <span className="profile-name">Alexandra Kim</span>
          <span className="profile-sub">PMA-22 · {tr(language, "Year 2", "2 курс")}</span>
        </div>
        <Icon name="more" size={18} />
      </Button>
    </aside>
  );
}

export function Topbar({
  page,
  setPage,
  darkMode,
  setDarkMode,
  language,
  setLanguage,
}: {
  page: Page;
  setPage: (page: Page) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const notifications = [
    {
      id: "deadline",
      icon: "calendar" as IconName,
      title: tr(language, "Lab 4 is due in 2 days", "Лабораторна №4 — дедлайн за 2 дні"),
      detail: tr(language, "Machine Learning · March 14", "Машинне навчання · 14 березня"),
      time: tr(language, "10 min ago", "10 хв тому"),
    },
    {
      id: "grade",
      icon: "award" as IconName,
      title: tr(language, "A new grade was published", "Опубліковано нову оцінку"),
      detail: tr(language, "Applied Statistics · 94/100", "Прикладна статистика · 94/100"),
      time: tr(language, "2 h ago", "2 год тому"),
    },
    {
      id: "library",
      icon: "library" as IconName,
      title: tr(language, "New materials in the library", "Нові матеріали в бібліотеці"),
      detail: tr(language, "2 methodical guides from FPMI", "2 методички від ФПМІ"),
      time: tr(language, "Yesterday", "Учора"),
    },
  ];
  const unreadCount = notifications.filter((item) => !readNotifications.includes(item.id)).length;
  const markAsRead = (id: string) => {
    setReadNotifications((current) => (current.includes(id) ? current : [...current, id]));
  };

  useEffect(() => {
    if (!notificationsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [notificationsOpen]);

  const labels = {
    dashboard: tr(language, "Student dashboard", "Кабінет студента"),
    courses: tr(language, "My courses", "Мої курси"),
    assistant: tr(language, "NORA AI assistant", "Асистент NORA AI"),
    profile: tr(language, "Academic hub", "Навчальний профіль"),
  };
  return (
    <header className={`topbar topbar-${page}`}>
      <div>
        <div className="eyebrow">LVIV NATIONAL UNIVERSITY</div>
        <div className="topbar-title">{labels[page]}</div>
      </div>
      <div className="topbar-actions">
        <div className="search-box">
          <Icon name="search" size={18} />
          <span>{tr(language, "Search campus", "Пошук у ЛНУ")}</span>
          <kbd>⌘ K</kbd>
        </div>
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
          className={`theme-toggle ${darkMode ? "active" : ""}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <Icon name="moon" size={18} />
        </Button>
        <div className="notification-wrap">
          <Button
            variant="icon"
            ariaLabel={`${tr(language, "Notifications", "Сповіщення")}: ${unreadCount}`}
            ariaExpanded={notificationsOpen}
            className={`notification-button ${notificationsOpen ? "active" : ""}`}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Icon name="bell" size={20} />
            {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
          </Button>
          {notificationsOpen && (
            <>
              <button
                type="button"
                className="notification-dismiss"
                aria-label={tr(language, "Close notifications", "Закрити сповіщення")}
                onClick={() => setNotificationsOpen(false)}
              />
              <section
                className="notification-panel"
                aria-label={tr(language, "Recent notifications", "Останні сповіщення")}
              >
                <div className="notification-panel-header">
                  <span>
                    <strong>{tr(language, "Notifications", "Сповіщення")}</strong>
                    <small>
                      {unreadCount
                        ? tr(language, `${unreadCount} unread`, `${unreadCount} непрочитані`)
                        : tr(language, "All caught up", "Усе переглянуто")}
                    </small>
                  </span>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      className="notification-read-all"
                      onClick={() => setReadNotifications(notifications.map((item) => item.id))}
                    >
                      {tr(language, "Mark all read", "Прочитати всі")}
                    </Button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.map((item) => {
                    const isRead = readNotifications.includes(item.id);
                    return (
                      <button
                        type="button"
                        className={`notification-item ${isRead ? "read" : "unread"}`}
                        key={item.id}
                        onClick={() => {
                          markAsRead(item.id);
                          setPage(item.id === "grade" ? "profile" : "dashboard");
                          setNotificationsOpen(false);
                        }}
                      >
                        <span className="notification-item-icon">
                          <Icon name={item.icon} size={17} />
                        </span>
                        <span className="notification-item-copy">
                          <strong>{item.title}</strong>
                          <small>{item.detail}</small>
                          <time>{item.time}</time>
                        </span>
                        {!isRead && <i aria-label={tr(language, "Unread", "Непрочитане")} />}
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
        <div className="term-pill">
          <span className="status-dot" /> {tr(language, "Spring 2025", "Весна 2025")}
        </div>
      </div>
    </header>
  );
}

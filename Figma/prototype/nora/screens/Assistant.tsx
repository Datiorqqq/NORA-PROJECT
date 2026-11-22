import { useEffect, useState } from "react";
import { tr, type Language } from "../shared/model";
import { Icon, Button, Card, type IconName } from "../shared/ui";
import { classes } from "../data/schedule";
import { demoCourses, courseTasks, dueLabel, type PreviewState } from "../data/courses";
import { StatusPanel } from "../shared/demo-states";

export function Assistant({
  initialPrompt = "",
  language,
  previewState,
  onRetry,
  courseId,
}: {
  initialPrompt?: string;
  language: Language;
  previewState: PreviewState;
  onRetry: () => void;
  courseId?: string;
}) {
  const course = demoCourses.find((item) => item.id === courseId);
  const [started, setStarted] = useState(Boolean(initialPrompt) || previewState === "ai-error");
  const [prompt, setPrompt] = useState("");
  const [sentPrompt, setSentPrompt] = useState(initialPrompt);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHistoryOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const optionLabel = (option: string) => {
    const labels: Record<string, string> = {
      Normal: "Нормальний",
      "t-distribution": "t-розподіл",
      Poisson: "Пуассона",
    };
    return language === "uk" ? (labels[option] ?? option) : option;
  };
  const startChat = (value: string) => {
    setSentPrompt(value);
    setPrompt("");
    setStarted(true);
    setHistoryOpen(false);
  };
  const resetChat = () => {
    setStarted(false);
    setPrompt("");
    setSentPrompt("");
    setQuizAnswers({});
    setHistoryOpen(false);
  };
  return (
    <main className={`assistant-layout ${historyOpen ? "history-open" : ""}`}>
      <div className="mobile-chat-tools">
        <Button
          variant="ghost"
          onClick={() => setHistoryOpen(!historyOpen)}
          ariaExpanded={historyOpen}
        >
          <Icon name={historyOpen ? "close" : "history"} size={18} />
          {tr(
            language,
            historyOpen ? "Close history" : "Chat history",
            historyOpen ? "Закрити історію" : "Історія розмов",
          )}
        </Button>
        <Button variant="secondary" onClick={resetChat}>
          <Icon name="plus" size={18} /> {tr(language, "New chat", "Нова розмова")}
        </Button>
      </div>
      <aside className="chat-sidebar" aria-label={tr(language, "Chat history", "Історія розмов")}>
        <Button variant="primary" className="new-chat" onClick={resetChat}>
          <Icon name="plus" size={18} /> {tr(language, "New conversation", "Нова розмова")}
        </Button>
        <div className="chat-label">{tr(language, "Recent", "Останні")}</div>
        {[
          tr(language, "Applied Statistics class prep", "Підготовка до прикладної статистики"),
          tr(language, "Dormitory renewal steps", "Продовження проживання в гуртожитку"),
          tr(language, "ML reading list", "Матеріали з машинного навчання"),
        ].map((chat, index) => (
          <Button
            variant="ghost"
            className={`chat-history ${index === 0 && started ? "active" : ""}`}
            key={chat}
            onClick={() => startChat(chat)}
          >
            <Icon name="history" size={17} />
            <span>{chat}</span>
            <Icon name="dots" size={16} />
          </Button>
        ))}
        <div className="chat-label folder-label">{tr(language, "Topics", "Теми")}</div>
        {[
          tr(language, "Coursework", "Навчальні завдання"),
          tr(language, "Campus procedures", "Університетські процедури"),
          tr(language, "Research & writing", "Дослідження та письмові роботи"),
        ].map((folder, index) => (
          <Button variant="ghost" className="folder-row" key={folder}>
            <span className={`folder-icon folder-${index}`}>
              <Icon name="folder" size={17} />
            </span>
            <span>{folder}</span>
          </Button>
        ))}
      </aside>
      <section className="chat-main">
        <div className="chat-context">
          <span className="demo-response-label">
            {tr(
              language,
              "Demo response · Gemini is not connected",
              "Приклад відповіді · Gemini ще не підключено",
            )}
          </span>
          {course && (
            <strong>
              <Icon name="book" size={14} />
              {language === "uk" ? course.uk : course.en}
            </strong>
          )}
        </div>
        {!started ? (
          <div className="empty-chat">
            <div className="ai-orb">
              <Icon name="sparkles" size={32} />
            </div>
            <div className="title-xl">
              {tr(
                language,
                "How can I help with your studies?",
                "Чим я можу допомогти з навчанням?",
              )}
            </div>
            <div className="assistant-subtitle">
              {tr(
                language,
                "Choose a category or ask your own question about studying at LNU.",
                "Оберіть категорію або поставте власне запитання про навчання в ЛНУ.",
              )}
            </div>
            <div className="suggestion-grid">
              <Button
                variant="secondary"
                className="suggestion-card"
                onClick={() =>
                  startChat(
                    tr(
                      language,
                      "Show my schedule, upcoming exams and coursework deadlines.",
                      "Покажи мій розклад, найближчу сесію та навчальні дедлайни.",
                    ),
                  )
                }
              >
                <span className="suggestion-icon blue">
                  <Icon name="calendar" size={20} />
                </span>
                <span>
                  <strong>
                    {tr(language, "Schedule, exams & deadlines", "Розклад, сесія та дедлайни")}
                  </strong>
                  <small>
                    {tr(
                      language,
                      "Classes, rooms, exams and submission dates",
                      "Пари, аудиторії, екзамени й терміни здачі",
                    )}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </Button>
              <Button
                variant="secondary"
                className="suggestion-card"
                onClick={() =>
                  startChat(
                    tr(
                      language,
                      "Help me find information about the dean’s office, a department or a teacher.",
                      "Допоможи знайти інформацію про деканат, кафедру або викладача.",
                    ),
                  )
                }
              >
                <span className="suggestion-icon green">
                  <Icon name="building" size={20} />
                </span>
                <span>
                  <strong>
                    {tr(
                      language,
                      "Dean’s Office, departments & teachers",
                      "Деканат, кафедри та викладачі",
                    )}
                  </strong>
                  <small>
                    {tr(
                      language,
                      "Contacts, office hours and FPMI structure",
                      "Контакти, години прийому та структура ФПМІ",
                    )}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </Button>
              <Button
                variant="secondary"
                className="suggestion-card"
                onClick={() =>
                  startChat(
                    tr(
                      language,
                      "Find a course syllabus, textbook or study guide.",
                      "Знайди силабус дисципліни, підручник або методичні рекомендації.",
                    ),
                  )
                }
              >
                <span className="suggestion-icon violet">
                  <Icon name="file" size={20} />
                </span>
                <span>
                  <strong>{tr(language, "Syllabi & textbooks", "Силабуси та підручники")}</strong>
                  <small>
                    {tr(
                      language,
                      "Course materials, authors and FPMI guides",
                      "Матеріали дисциплін, автори й методички ФПМІ",
                    )}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </Button>
              <Button
                variant="secondary"
                className="suggestion-card"
                onClick={() =>
                  startChat(
                    tr(
                      language,
                      "Help me prepare for an exam or explain a difficult topic.",
                      "Допоможи підготуватися до іспиту або поясни складну тему.",
                    ),
                  )
                }
              >
                <span className="suggestion-icon amber">
                  <Icon name="award" size={20} />
                </span>
                <span>
                  <strong>
                    {tr(language, "Exam & topic preparation", "Підготовка до іспитів та тем")}
                  </strong>
                  <small>
                    {tr(
                      language,
                      "Explanations, study plans, quizzes and notes",
                      "Пояснення, плани підготовки, тести й конспекти",
                    )}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </Button>
            </div>
            <Button
              variant="ghost"
              className={`more-categories-toggle ${showMoreCategories ? "active" : ""}`}
              ariaExpanded={showMoreCategories}
              onClick={() => setShowMoreCategories(!showMoreCategories)}
            >
              <Icon name="plus" size={16} />
              {tr(language, "More topics", "Інші теми")}
              <Icon name="chevron" size={15} />
            </Button>
            {showMoreCategories && (
              <div className="additional-categories">
                {[
                  {
                    icon: "building" as IconName,
                    title: tr(language, "Housing", "Гуртожиток"),
                    prompt: tr(
                      language,
                      "Tell me about housing, accommodation and payments.",
                      "Підкажи інформацію про гуртожиток, поселення та оплату.",
                    ),
                    tone: "green",
                  },
                  {
                    icon: "file" as IconName,
                    title: tr(language, "Documents & scholarship", "Документи й стипендія"),
                    prompt: tr(
                      language,
                      "Help me with university documents or scholarships.",
                      "Допоможи з університетськими документами або стипендією.",
                    ),
                    tone: "blue",
                  },
                  {
                    icon: "award" as IconName,
                    title: tr(language, "Internships & Erasmus+", "Стажування та Erasmus+"),
                    prompt: tr(
                      language,
                      "Find internships or Erasmus+ programs.",
                      "Знайди можливості стажування або програми Erasmus+.",
                    ),
                    tone: "violet",
                  },
                  {
                    icon: "user" as IconName,
                    title: tr(language, "Student life", "Студентське життя"),
                    prompt: tr(
                      language,
                      "Tell me about student events and organizations.",
                      "Розкажи про студентські події, організації та можливості.",
                    ),
                    tone: "amber",
                  },
                ].map((category) => (
                  <Button
                    variant="secondary"
                    className="additional-category-card"
                    key={category.title}
                    onClick={() => startChat(category.prompt)}
                  >
                    <span className={`suggestion-icon ${category.tone}`}>
                      <Icon name={category.icon} size={17} />
                    </span>
                    <strong>{category.title}</strong>
                    <Icon name="arrow" size={15} />
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : previewState === "ai-error" || previewState === "loading" ? (
          <div className="conversation">
            <div className="retained-question">
              <strong>{tr(language, "Your question", "Твоє запитання")}</strong>
              <p>
                {sentPrompt ||
                  tr(
                    language,
                    "Help me plan my coursework.",
                    "Допоможи спланувати навчальні завдання.",
                  )}
              </p>
            </div>
            <StatusPanel kind={previewState} language={language} onRetry={onRetry} />
          </div>
        ) : (
          <div className="conversation">
            <div className="conversation-meta">
              <span>
                {course
                  ? language === "uk"
                    ? course.uk
                    : course.en
                  : tr(
                      language,
                      "Applied Statistics class prep",
                      "Підготовка до прикладної статистики",
                    )}
              </span>
              <span className="saved-state">
                <Icon name="check" size={14} /> {tr(language, "Saved", "Збережено")}
              </span>
            </div>
            <div className="message user-message">
              <div className="message-avatar">AK</div>
              <div className="message-body">
                <span>{tr(language, "You", "Ти")}</span>
                <p>
                  {sentPrompt ||
                    tr(
                      language,
                      "Help me prepare for my Applied Statistics lecture.",
                      "Допоможи підготуватися до лекції з прикладної статистики.",
                    )}
                </p>
              </div>
            </div>
            <div className="message ai-message">
              <div className="message-avatar ai">
                <Icon name="sparkles" size={18} />
              </div>
              <div className="ai-response">
                <span>NORA AI</span>
                <p>
                  {course && course.id !== "statistics"
                    ? tr(
                        language,
                        "Here is a sample study plan based on the known assignments for this course.",
                        "Ось приклад плану роботи на основі відомих завдань цього курсу.",
                      )
                    : tr(
                        language,
                        "I reviewed today’s lecture plan. Here’s a focused primer to help you arrive prepared.",
                        "Ось короткий огляд тем сьогоднішньої лекції, який допоможе підготуватися до заняття.",
                      )}
                </p>
                {course && course.id !== "statistics" ? (
                  <Card className="study-panel contextual-answer">
                    <h2>{language === "uk" ? course.uk : course.en}</h2>
                    <p>
                      {tr(
                        language,
                        "Start with the known assignments below. Break each task into preparation, practice and review. This is a demonstration, not a live AI response.",
                        "Почни з відомих завдань нижче. Розділи роботу на підготовку, виконання та перевірку. Це приклад, а не відповідь підключеного AI.",
                      )}
                    </p>
                    <ul>
                      {courseTasks(course)
                        .filter((task) => !task.completed)
                        .map((task) => (
                          <li key={task.id}>
                            <strong>{language === "uk" ? task.uk : task.en}</strong>
                            <span>{dueLabel(task.day, language)}</span>
                            {task.day === null && (
                              <small>
                                {tr(
                                  language,
                                  "Confirm the date with your teacher; NORA cannot infer it.",
                                  "Уточни дату у викладача: NORA не може визначити її самостійно.",
                                )}
                              </small>
                            )}
                          </li>
                        ))}
                    </ul>
                  </Card>
                ) : (
                  <Card className="study-panel">
                    <div className="study-panel-header">
                      <div>
                        <span className="mini-label">
                          {tr(language, "CLASS PREP", "ПІДГОТОВКА ДО ЗАНЯТТЯ")}
                        </span>
                        <strong>
                          {language === "uk" ? classes[0].titleUk : classes[0].title} ·{" "}
                          {tr(language, "Today at", "Сьогодні о")} {classes[0].time}
                        </strong>
                      </div>
                      <span className="source-chip">
                        <Icon name="book" size={14} /> {tr(language, "Lecture 8", "Лекція 8")}
                      </span>
                    </div>
                    <div className="study-grid">
                      <section className="study-section topics-section">
                        <div className="study-section-title">
                          <span className="study-icon blue">
                            <Icon name="book" size={17} />
                          </span>
                          <div>
                            <strong>
                              {tr(language, "Key Topics Today", "Основні теми заняття")}
                            </strong>
                            <small>
                              {tr(
                                language,
                                "What to review before class",
                                "Що повторити перед заняттям",
                              )}
                            </small>
                          </div>
                        </div>
                        <ul>
                          <li>
                            <span />
                            {tr(language, "Hypothesis Testing", "Перевірка гіпотез")}
                          </li>
                          <li>
                            <span />
                            {tr(language, "p-values", "p-значення")}
                          </li>
                          <li>
                            <span />
                            {tr(language, "t-distribution", "t-розподіл")}
                          </li>
                        </ul>
                      </section>
                      <section className="study-section formula-section">
                        <div className="study-section-title">
                          <span className="study-icon violet">
                            <Icon name="file" size={17} />
                          </span>
                          <div>
                            <strong>
                              {tr(language, "Quick Reference Formula", "Формула для довідки")}
                            </strong>
                            <small>
                              {tr(language, "One-sample t statistic", "Одновибіркова t-статистика")}
                            </small>
                          </div>
                        </div>
                        <div className="formula-box">
                          <span>t =</span>
                          <span className="fraction">
                            <span>x̄ − μ₀</span>
                            <span>s / √n</span>
                          </span>
                        </div>
                        <small className="formula-note">
                          {tr(
                            language,
                            "Compare the calculated t-value with the critical value for n − 1 degrees of freedom.",
                            "Порівняй обчислене t-значення з критичним значенням для n − 1 ступенів свободи.",
                          )}
                        </small>
                      </section>
                    </div>
                    <section className="reading-section">
                      <div className="study-section-title">
                        <span className="study-icon amber">
                          <Icon name="book" size={17} />
                        </span>
                        <div>
                          <strong>
                            {tr(language, "Recommended Reading", "Рекомендовані матеріали")}
                          </strong>
                          <small>
                            {tr(
                              language,
                              "Selected from your course resources",
                              "Із матеріалів твого курсу",
                            )}
                          </small>
                        </div>
                      </div>
                      <Button variant="secondary" className="reading-card">
                        <span className="pdf-mark">
                          <Icon name="file" size={18} />
                        </span>
                        <span>
                          <strong>
                            {tr(
                              language,
                              "Applied Statistics — Chapter 4.pdf",
                              "Прикладна статистика — Розділ 4.pdf",
                            )}
                          </strong>
                          <small>
                            {tr(
                              language,
                              "Hypothesis tests and statistical significance · 18 pages",
                              "Перевірка гіпотез і статистична значущість · 18 сторінок",
                            )}
                          </small>
                        </span>
                        <Icon name="arrow" size={17} />
                      </Button>
                    </section>
                    <section className="quiz-section">
                      <div className="study-section-title">
                        <span className="study-icon green">
                          <Icon name="check" size={17} />
                        </span>
                        <div>
                          <strong>{tr(language, "Self-Test Quiz", "Самоперевірка")}</strong>
                          <small>
                            {tr(
                              language,
                              "Two quick checks before class",
                              "Два короткі запитання перед заняттям",
                            )}
                          </small>
                        </div>
                      </div>
                      <div className="quiz-grid">
                        {[
                          {
                            question: tr(
                              language,
                              "Which result supports rejecting H₀ at α = 0.05?",
                              "Який результат дає підставу відхилити H₀ за α = 0,05?",
                            ),
                            options: ["p = 0.12", "p = 0.03", "p = 0.08"],
                            correct: "p = 0.03",
                          },
                          {
                            question: tr(
                              language,
                              "Which distribution is used for a small sample with unknown variance?",
                              "Який розподіл використовують для малої вибірки з невідомою дисперсією?",
                            ),
                            options: ["Normal", "t-distribution", "Poisson"],
                            correct: "t-distribution",
                          },
                        ].map((quiz, quizIndex) => (
                          <div className="quiz-card" key={quiz.question}>
                            <span className="quiz-number">0{quizIndex + 1}</span>
                            <strong>{quiz.question}</strong>
                            <div className="quiz-options">
                              {quiz.options.map((option) => {
                                const selected = quizAnswers[quizIndex] === option;
                                const state = selected
                                  ? option === quiz.correct
                                    ? "correct"
                                    : "incorrect"
                                  : "";
                                return (
                                  <Button
                                    variant="ghost"
                                    className={`quiz-option ${state}`}
                                    key={option}
                                    ariaPressed={selected}
                                    onClick={() =>
                                      setQuizAnswers((answers) => ({
                                        ...answers,
                                        [quizIndex]: option,
                                      }))
                                    }
                                  >
                                    <i /> {optionLabel(option)}
                                  </Button>
                                );
                              })}
                            </div>
                            {quizAnswers[quizIndex] && (
                              <small
                                className={`quiz-feedback ${quizAnswers[quizIndex] === quiz.correct ? "correct" : "incorrect"}`}
                              >
                                {quizAnswers[quizIndex] === quiz.correct
                                  ? tr(
                                      language,
                                      "Correct — you’re ready for this concept.",
                                      "Правильно — цю тему засвоєно.",
                                    )
                                  : tr(
                                      language,
                                      `Not quite. Review why ${quiz.correct} is the best answer.`,
                                      `Не зовсім. Поміркуй, чому «${optionLabel(quiz.correct)}» — правильна відповідь.`,
                                    )}
                              </small>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  </Card>
                )}
                <div className="follow-up-block">
                  <span>{tr(language, "Continue with NORA", "Продовжити з NORA")}</span>
                  <div className="follow-up-pills">
                    {(course && course.id !== "statistics"
                      ? [
                          tr(language, "Create a work plan", "Склади план роботи"),
                          tr(
                            language,
                            "What should I clarify with my teacher?",
                            "Що уточнити у викладача?",
                          ),
                          tr(language, "Help me review my work", "Допоможи перевірити результат"),
                        ]
                      : [
                          tr(
                            language,
                            "Explain p-value simply",
                            "Поясни p-значення простими словами",
                          ),
                          tr(language, "Generate cheat sheet", "Створи стислий конспект"),
                          tr(
                            language,
                            "Find past exam questions",
                            "Знайди питання минулих іспитів",
                          ),
                        ]
                    ).map((suggestion) => (
                      <Button
                        variant="secondary"
                        className="follow-up-pill"
                        key={suggestion}
                        onClick={() => startChat(suggestion)}
                      >
                        <Icon name="sparkles" size={14} /> {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="composer-wrap">
          <div className="composer">
            <Button variant="icon" ariaLabel={tr(language, "Attach a file", "Прикріпити файл")}>
              <Icon name="plus" size={20} />
            </Button>
            <input
              aria-label={tr(language, "Message NORA", "Повідомлення для NORA")}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && prompt && startChat(prompt)}
              placeholder={tr(
                language,
                "Ask NORA anything about university...",
                "Запитай NORA про навчання та університет…",
              )}
            />
            <span className="composer-hint">⌘ ↵</span>
            <Button
              variant="primary"
              className="send-button"
              ariaLabel={tr(language, "Send message", "Надіслати повідомлення")}
              onClick={() => prompt && startChat(prompt)}
            >
              <Icon name="send" size={18} />
            </Button>
          </div>
          <div className="composer-note">
            {tr(
              language,
              "NORA uses campus data to personalize answers. Verify important academic information.",
              "NORA використовує університетські дані для персоналізації відповідей. Перевіряй важливу навчальну інформацію.",
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

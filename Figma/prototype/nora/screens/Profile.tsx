import { useState } from "react";
import {
  tr,
  specialtyOptions,
  defaultAcademicProfile,
  type Language,
  type ColorTheme,
  type AcademicProfile,
} from "../shared/model";
import { Icon, Button, Card, SectionTitle } from "../shared/ui";

const colorThemes: {
  id: ColorTheme;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  colors: [string, string, string];
}[] = [
  {
    id: "slate",
    name: "Neutral",
    nameUk: "Нейтральна",
    description: "Soft gray and graphite",
    descriptionUk: "Світло-сірий і графіт",
    colors: ["#303034", "#e7e7eb", "#fafafa"],
  },
  {
    id: "ocean",
    name: "Lagoon",
    nameUk: "Лагуна",
    description: "Clear and energetic",
    descriptionUk: "Чиста й енергійна",
    colors: ["#086d77", "#d6f3ef", "#f1faf8"],
  },
  {
    id: "lavender",
    name: "Iris",
    nameUk: "Ірис",
    description: "Creative and soft",
    descriptionUk: "Творча й м’яка",
    colors: ["#784487", "#f4dff3", "#fcf5fc"],
  },
  {
    id: "forest",
    name: "Sage",
    nameUk: "Шавлія",
    description: "Balanced and natural",
    descriptionUk: "Збалансована й природна",
    colors: ["#436840", "#e5eed8", "#f6f8ef"],
  },
  {
    id: "sunset",
    name: "Terracotta",
    nameUk: "Теракота",
    description: "Warm and optimistic",
    descriptionUk: "Тепла й оптимістична",
    colors: ["#a6462e", "#fce3d2", "#fff7f0"],
  },
];
const grades = [
  {
    course: "Probability Theory & Mathematical Statistics",
    courseUk: "Теорія ймовірностей та мат. статистика",
    teacher: "Prof. Petro Senio",
    teacherUk: "проф. Сеньо П. С.",
    control: "Exam",
    controlUk: "Іспит",
    grade: "A",
    score: 91,
    color: "blue",
    tier: "high",
  },
  {
    course: "Machine Learning",
    courseUk: "Машинне навчання",
    teacher: "Assoc. Prof. Olha Kunanets",
    teacherUk: "доц. Кунанець О. В.",
    control: "Exam",
    controlUk: "Іспит",
    grade: "B",
    score: 87,
    color: "violet",
    tier: "standard",
  },
  {
    course: "Differential Equations",
    courseUk: "Диференціальні рівняння",
    teacher: "Assoc. Prof. Andrii Oliinyk",
    teacherUk: "доц. Олійник А. О.",
    control: "Credit",
    controlUk: "Залік",
    grade: "A",
    score: 95,
    color: "green",
    tier: "high",
  },
  {
    course: "Programming in .NET and Python",
    courseUk: "Програмування на .NET і Python",
    teacher: "Lecturer Iryna Vovk",
    teacherUk: "асист. Вовк І. М.",
    control: "Coursework",
    controlUk: "Курсова робота",
    grade: "A",
    score: 92,
    color: "amber",
    tier: "high",
  },
];

export function Profile({
  academicProfile,
  setAcademicProfile,
  language,
  openNora,
  colorTheme,
  setColorTheme,
  darkMode,
  setDarkMode,
}: {
  academicProfile: AcademicProfile;
  setAcademicProfile: (profile: AcademicProfile) => void;
  language: Language;
  openNora: (prompt?: string) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftProfile, setDraftProfile] = useState(academicProfile);
  const [resourceTab, setResourceTab] = useState<"materials" | "applications">("materials");
  const specialtyLabel =
    academicProfile.specialty === "113 Applied Mathematics"
      ? tr(language, "113 Applied Mathematics", "113 Прикладна математика")
      : academicProfile.specialty;
  const startEditing = () => {
    setDraftProfile(academicProfile);
    setIsEditing(true);
  };
  const saveProfile = () => {
    setAcademicProfile(draftProfile);
    setIsEditing(false);
  };

  return (
    <main className="page profile-page">
      <Card className="profile-hero">
        <div className="large-avatar">AK</div>
        <div className="identity">
          <div className="title-xl">Alexandra Kim</div>
          <div className="identity-tags">
            <span>
              <Icon name="cap" size={16} /> {tr(language, "Group", "Група")} {academicProfile.group}
            </span>
            <span>
              <Icon name="mail" size={16} /> alexandra.kim@lnu.edu.ua
            </span>
          </div>
        </div>
        <Button variant="secondary" onClick={isEditing ? saveProfile : startEditing}>
          {isEditing
            ? tr(language, "Save profile", "Зберегти профіль")
            : tr(language, "Edit profile", "Редагувати профіль")}
        </Button>
        <div className="profile-divider" />
        {isEditing && (
          <div className="academic-profile-form">
            <div className="academic-profile-heading">
              <div>
                <strong>{tr(language, "Academic profile", "Навчальний профіль")}</strong>
                <span>
                  {tr(
                    language,
                    "Faculty → Specialty → Study year → Group",
                    "Факультет → Спеціальність → Курс → Група",
                  )}
                </span>
              </div>
              <Button
                variant="ghost"
                className="auth-text-button"
                onClick={() => setIsEditing(false)}
              >
                {tr(language, "Cancel", "Скасувати")}
              </Button>
            </div>
            <div className="academic-profile-grid">
              <label className="profile-field">
                <span>{tr(language, "Faculty", "Факультет")}</span>
                <select
                  value={draftProfile.faculty}
                  onChange={(event) =>
                    setDraftProfile({ ...draftProfile, faculty: event.target.value })
                  }
                >
                  <option>{defaultAcademicProfile.faculty}</option>
                </select>
              </label>
              <label className="profile-field">
                <span>{tr(language, "Specialty", "Спеціальність")}</span>
                <select
                  value={draftProfile.specialty}
                  onChange={(event) =>
                    setDraftProfile({ ...draftProfile, specialty: event.target.value })
                  }
                >
                  {specialtyOptions.map((specialty) => (
                    <option key={specialty}>{specialty}</option>
                  ))}
                </select>
              </label>
              <label className="profile-field">
                <span>{tr(language, "Study year", "Курс")}</span>
                <select
                  value={draftProfile.year}
                  onChange={(event) =>
                    setDraftProfile({ ...draftProfile, year: event.target.value })
                  }
                >
                  {["1", "2", "3", "4", "5", "6"].map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </label>
              <label className="profile-field">
                <span>{tr(language, "Group", "Група")}</span>
                <input
                  value={draftProfile.group}
                  onChange={(event) =>
                    setDraftProfile({ ...draftProfile, group: event.target.value })
                  }
                  placeholder="PMA-22"
                />
              </label>
            </div>
          </div>
        )}
        <div className="profile-facts">
          <div>
            <span>{tr(language, "Faculty", "Факультет")}</span>
            <strong>{tr(language, "FPMI", "ФПМІ")}</strong>
          </div>
          <div>
            <span>{tr(language, "Specialty", "Спеціальність")}</span>
            <strong>{specialtyLabel}</strong>
          </div>
          <div>
            <span>{tr(language, "Study year", "Курс")}</span>
            <strong>
              {tr(language, `Year ${academicProfile.year}`, `${academicProfile.year} курс`)}
            </strong>
          </div>
          <div>
            <span>{tr(language, "Academic group", "Академічна група")}</span>
            <strong>{academicProfile.group}</strong>
          </div>
        </div>
      </Card>

      <div className="profile-grid">
        <Card className="personalization-card">
          <SectionTitle
            action={
              <div
                className="appearance-mode-switch"
                role="group"
                aria-label={tr(language, "Appearance mode", "Режим відображення")}
              >
                <Button
                  variant="ghost"
                  className={!darkMode ? "active" : ""}
                  ariaPressed={!darkMode}
                  onClick={() => setDarkMode(false)}
                >
                  <Icon name="check" size={14} />
                  {tr(language, "Light", "Світла")}
                </Button>
                <Button
                  variant="ghost"
                  className={darkMode ? "active" : ""}
                  ariaPressed={darkMode}
                  onClick={() => setDarkMode(true)}
                >
                  <Icon name="moon" size={14} />
                  {tr(language, "Dark", "Темна")}
                </Button>
              </div>
            }
          >
            <span className="title-icon violet">
              <Icon name="sparkles" size={18} />
            </span>
            <span>
              {tr(language, "Personalization", "Персоналізація")}
              <small className="personalization-subtitle">
                {tr(
                  language,
                  "Choose a color theme for your workspace",
                  "Обери кольорову тему свого простору",
                )}
              </small>
            </span>
          </SectionTitle>
          <div
            className="theme-choice-grid"
            role="radiogroup"
            aria-label={tr(language, "Color theme", "Кольорова тема")}
          >
            {colorThemes.map((theme) => (
              <button
                type="button"
                role="radio"
                aria-checked={colorTheme === theme.id}
                className={`theme-choice ${colorTheme === theme.id ? "active" : ""}`}
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
              >
                <span className="theme-preview" aria-hidden="true">
                  <i style={{ background: theme.colors[0] }} />
                  <i style={{ background: theme.colors[1] }} />
                  <i style={{ background: theme.colors[2] }} />
                </span>
                <span className="theme-choice-copy">
                  <strong>{language === "uk" ? theme.nameUk : theme.name}</strong>
                  <small>{language === "uk" ? theme.descriptionUk : theme.description}</small>
                </span>
                <span className="theme-selected-check">
                  {colorTheme === theme.id && <Icon name="check" size={13} />}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="grades-card">
          <SectionTitle
            action={
              <div className="grade-summary">
                <div className="gpa-chip">
                  {tr(language, "Average score", "Середній бал")} <strong>91.2</strong> / 100
                </div>
                <div className="scholarship-chip">
                  <Icon name="award" size={14} />{" "}
                  {tr(language, "Scholarship rating", "Стипендіальний рейтинг")}:{" "}
                  <strong>82.1</strong>
                </div>
              </div>
            }
          >
            {tr(language, "Current grades", "Поточні оцінки")}
          </SectionTitle>
          <div className="grade-list">
            {grades.map((item) => (
              <div className="grade-entry" key={item.course}>
                <div className="grade-row">
                  <div className={`course-monogram ${item.color}`}>
                    {(language === "uk" ? item.courseUk : item.course)
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="grade-course">
                    <strong>{language === "uk" ? item.courseUk : item.course}</strong>
                    <span>
                      {language === "uk" ? item.teacherUk : item.teacher} ·{" "}
                      {language === "uk" ? item.controlUk : item.control}
                    </span>
                  </div>
                  <div className="grade-metrics">
                    <div className="grade-progress">
                      <span
                        className={`grade-tier-${item.tier}`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <div className="grade-score">
                      <strong className={`grade-badge grade-tier-${item.tier}`}>
                        {item.grade}
                      </strong>
                      <span>{item.score} / 100</span>
                    </div>
                  </div>
                </div>
                {item.score === 87 && (
                  <Button
                    variant="ghost"
                    className="nora-grade-action"
                    onClick={() =>
                      openNora(
                        tr(
                          language,
                          "Help me review the weakest Machine Learning topics from the syllabus.",
                          "Допоможи підтягнути найслабші теми з Машинного навчання за силабусом.",
                        ),
                      )
                    }
                  >
                    <Icon name="sparkles" size={15} />
                    <span>
                      <strong>
                        {tr(language, "Review this subject with NORA", "Підтягнути тему з NORA")}
                      </strong>
                      <small>
                        {tr(
                          language,
                          "Generate self-check questions from the syllabus",
                          "Згенерувати питання для самоперевірки за силабусом",
                        )}
                      </small>
                    </span>
                    <Icon name="arrow" size={15} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="sessions-card">
          <SectionTitle
            action={
              <Button variant="ghost" className="text-action">
                {tr(language, "Full history", "Повна історія")} <Icon name="arrow" size={16} />
              </Button>
            }
          >
            {tr(language, "Session history", "Історія сесій")}
          </SectionTitle>
          <div className="session-chart">
            {[72, 84, 94].map((height, index) => (
              <div className="chart-column" key={height}>
                <span className={index === 2 ? "current" : ""} style={{ height: `${height}%` }} />
                <small>
                  {
                    [
                      tr(language, "Semester 1", "1 сем."),
                      tr(language, "Semester 2", "2 сем."),
                      tr(language, "Semester 3 · current", "3 сем. · поточний"),
                    ][index]
                  }
                </small>
              </div>
            ))}
            <div className="chart-score">
              91.2 <span>{tr(language, "Average session score", "Середній бал за сесії")}</span>
            </div>
            <div className="scholarship-eligibility">
              <Icon name="check" size={14} />{" "}
              {tr(
                language,
                "Within scholarship eligibility range",
                "Входить у стипендіальний ліміт",
              )}
            </div>
          </div>
        </Card>

        <Card className="professors-card">
          <SectionTitle>{tr(language, "Assigned professors", "Викладачі")}</SectionTitle>
          <div className="professor-list">
            {[
              ["EM", "Dr. Elena Morris", "Academic advisor", "e.morris@lnu.edu.ua"],
              ["DH", "Prof. Daniel Hart", "Machine Learning", "d.hart@lnu.edu.ua"],
              ["SP", "Dr. Sofia Patel", "Applied Statistics", "s.patel@lnu.edu.ua"],
            ].map((prof, index) => (
              <div className="professor-row" key={prof[0]}>
                <div className={`prof-avatar prof-${index}`}>{prof[0]}</div>
                <div>
                  <strong>{prof[1]}</strong>
                  <span>{prof[2]}</span>
                </div>
                <Button variant="icon" ariaLabel={`Email ${prof[1]}`}>
                  <Icon name="mail" size={18} />
                </Button>
                <div className="email-tooltip">{prof[3]}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="documents-card">
          <SectionTitle>{tr(language, "Student resources", "Матеріали студента")}</SectionTitle>
          <div
            className="profile-resource-tabs"
            role="tablist"
            aria-label={tr(
              language,
              "Student resource categories",
              "Категорії матеріалів студента",
            )}
          >
            <Button
              variant="ghost"
              className={resourceTab === "materials" ? "active" : ""}
              ariaPressed={resourceTab === "materials"}
              onClick={() => setResourceTab("materials")}
            >
              <Icon name="book" size={15} />{" "}
              {tr(language, "Syllabi & methodical guides", "Силабуси та методички")}
            </Button>
            <Button
              variant="ghost"
              className={resourceTab === "applications" ? "active" : ""}
              ariaPressed={resourceTab === "applications"}
              onClick={() => setResourceTab("applications")}
            >
              <Icon name="file" size={15} />{" "}
              {tr(language, "Applications & templates", "Заяви й шаблони")}
            </Button>
          </div>
          <div className="document-list">
            {(resourceTab === "materials"
              ? [
                  [
                    tr(language, "Probability Theory syllabus", "Силабус з теорії ймовірностей"),
                    tr(language, "Syllabus · Semester 3", "Силабус · 3 семестр"),
                    "blue",
                  ],
                  [
                    tr(language, "Machine Learning lab guide", "Методичка з машинного навчання"),
                    tr(
                      language,
                      "Methodical guide · 8 labs",
                      "Методичні рекомендації · 8 лабораторних",
                    ),
                    "green",
                  ],
                  [
                    tr(language, ".NET & Python programming", "Програмування .NET і Python"),
                    tr(language, "Textbook · Saved by group", "Підручник · Збережено групою"),
                    "violet",
                  ],
                ]
              : [
                  [
                    tr(
                      language,
                      "Additional scholarship points",
                      "Заява на додаткові бали до стипендії",
                    ),
                    tr(language, "Application template · DOCX", "Шаблон заяви · DOCX"),
                    "blue",
                  ],
                  [
                    tr(
                      language,
                      "Contract & dormitory payment details",
                      "Реквізити оплати контракту / гуртожитку",
                    ),
                    tr(language, "Payment details · PDF", "Платіжні реквізити · PDF"),
                    "green",
                  ],
                  [
                    tr(language, "Library card request", "Заява на читацький квиток"),
                    tr(language, "Application template · PDF", "Шаблон заяви · PDF"),
                    "violet",
                  ],
                ]
            ).map((doc) => (
              <div className="document-row" key={doc[0]}>
                <span className={`doc-icon ${doc[2]}`}>
                  <Icon name="file" size={19} />
                </span>
                <span>
                  <strong>{doc[0]}</strong>
                  <small>{doc[1]}</small>
                </span>
                <Button variant="icon" ariaLabel={`Download ${doc[0]}`}>
                  <Icon name="download" size={17} />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

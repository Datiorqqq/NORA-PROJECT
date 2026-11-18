export type Page = "dashboard" | "courses" | "assistant" | "profile";
export type AuthMode = "login" | "register";
export type Language = "en" | "uk";
export type ColorTheme = "slate" | "ocean" | "lavender" | "forest" | "sunset";
export const tr = (language: Language, english: string, ukrainian: string) =>
  language === "uk" ? ukrainian : english;
export type AcademicProfile = {
  faculty: string;
  specialty: string;
  year: string;
  group: string;
};

export const specialtyOptions = [
  "113 Applied Mathematics",
  "121 Software Engineering",
  "122 Computer Science",
  "124 Systems Analysis",
];

export const defaultAcademicProfile: AcademicProfile = {
  faculty: "Faculty of Applied Mathematics and Informatics",
  specialty: "113 Applied Mathematics",
  year: "2",
  group: "PMA-22",
};

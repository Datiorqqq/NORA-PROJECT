"use client";

import { useEffect, useState } from "react";
import {
  defaultAcademicProfile,
  type Page,
  type Language,
  type ColorTheme,
} from "./nora/shared/model";
import { Sidebar, Topbar } from "./nora/shared/navigation";
import { demoCourses, type PreviewState } from "./nora/data/courses";
import { AuthScreen } from "./nora/screens/AuthScreen";
import { Courses } from "./nora/screens/Courses";
import { StatusPanel } from "./nora/shared/demo-states";
import { Dashboard } from "./nora/screens/Dashboard";
import { Assistant } from "./nora/screens/Assistant";
import { Profile } from "./nora/screens/Profile";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [colorTheme, setColorTheme] = useState<ColorTheme>("slate");
  const [language, setLanguage] = useState<Language>("en");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [academicProfile, setAcademicProfile] = useState(defaultAcademicProfile);
  const [assistantSeed, setAssistantSeed] = useState("");
  const [assistantCourseId, setAssistantCourseId] = useState<string | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [previewState, setPreviewState] = useState<PreviewState>("ready");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const state = params.get("demo");
    const screen = params.get("screen");
    if (["ready", "loading", "empty", "moodle-error", "expired", "ai-error"].includes(state ?? ""))
      setPreviewState(state as PreviewState);
    if (["dashboard", "courses", "assistant", "profile"].includes(screen ?? ""))
      setPage(screen as Page);
    if (state || screen) setIsAuthenticated(true);
    if (params.get("lang") === "uk") setLanguage("uk");
    const courseId = params.get("course");
    if (demoCourses.some((course) => course.id === courseId)) {
      setSelectedCourseId(courseId);
      setAssistantCourseId(courseId ?? undefined);
    }
  }, []);
  useEffect(() => {
    if (previewState !== "loading") return;
    const timer = window.setTimeout(() => setPreviewState("ready"), 1300);
    return () => window.clearTimeout(timer);
  }, [previewState]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page, selectedCourseId]);
  const retry = () => setPreviewState("loading");
  const openNora = (prompt = "", courseId?: string) => {
    setAssistantSeed(prompt);
    setAssistantCourseId(
      courseId ??
        demoCourses.find((course) => prompt.includes(course.en) || prompt.includes(course.uk))?.id,
    );
    setPage("assistant");
  };
  return (
    <div className={`app-shell theme-${colorTheme} ${darkMode ? "dark" : ""}`}>
      {previewState === "expired" ? (
        <main className="session-state-page">
          <StatusPanel
            kind="expired"
            language={language}
            onRetry={() => {
              setPreviewState("ready");
              setIsAuthenticated(false);
            }}
          />
        </main>
      ) : !isAuthenticated ? (
        <AuthScreen
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
          academicProfile={academicProfile}
          setAcademicProfile={setAcademicProfile}
          onComplete={() => setIsAuthenticated(true)}
        />
      ) : (
        <>
          <Sidebar page={page} setPage={setPage} language={language} />
          <div className="app-content">
            <Topbar
              page={page}
              setPage={setPage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              language={language}
              setLanguage={setLanguage}
            />
            {page === "dashboard" && (
              <Dashboard
                openNora={openNora}
                language={language}
                previewState={previewState}
                onRetry={retry}
                openCourses={() => {
                  setSelectedCourseId(null);
                  setPage("courses");
                }}
              />
            )}
            {page === "courses" && (
              <Courses
                language={language}
                previewState={previewState}
                onRetry={retry}
                openNora={openNora}
                selectedCourseId={selectedCourseId}
                setSelectedCourseId={setSelectedCourseId}
              />
            )}
            {page === "assistant" && (
              <Assistant
                key={`${assistantSeed}-${assistantCourseId ?? "general"}`}
                initialPrompt={assistantSeed}
                language={language}
                courseId={assistantCourseId}
                previewState={previewState}
                onRetry={retry}
              />
            )}
            {page === "profile" && (
              <Profile
                academicProfile={academicProfile}
                setAcademicProfile={setAcademicProfile}
                language={language}
                openNora={openNora}
                colorTheme={colorTheme}
                setColorTheme={setColorTheme}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

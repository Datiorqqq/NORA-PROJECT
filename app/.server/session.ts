import { createCookieSessionStorage } from "react-router";
import { getRequiredServerEnv } from "./env";

type SessionData = { studentId: string };

// Keep only a non-secret user identifier in the signed cookie.
// Moodle/AI tokens must never be stored in cookie-backed sessions.
export async function getStudentId(request: Request): Promise<string | null> {
  const { getSession } = createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__nora_session",
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      secrets: [getRequiredServerEnv("SESSION_SECRET")],
    },
  });

  const session = await getSession(request.headers.get("Cookie"));
  const studentId = session.get("studentId");
  return typeof studentId === "string" && studentId.length > 0 ? studentId : null;
}

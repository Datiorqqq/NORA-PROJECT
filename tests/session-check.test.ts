import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createCookieSessionStorage } from "react-router";
import { action } from "../app/routes/session-check";

const originalSecret = process.env.SESSION_SECRET;
const secret = "s".repeat(32);

async function checkSession(cookie?: string) {
  return action({
    request: new Request("http://localhost/api/session-check", {
      method: "POST",
      headers: cookie ? { Cookie: cookie } : {},
    }),
  } as Parameters<typeof action>[0]);
}

describe("POST /api/session-check", () => {
  beforeEach(() => {
    process.env.SESSION_SECRET = secret;
  });

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalSecret;
  });

  it("rejects requests without a signed student session", async () => {
    const response = await checkSession();
    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("rejects invalid session cookies", async () => {
    const response = await checkSession("__nora_session=invalid");
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns 503 when the session secret is missing", async () => {
    delete process.env.SESSION_SECRET;
    const response = await checkSession();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ error: "Session configuration unavailable" });
  });

  it("recognizes a valid signed student ID without exposing it", async () => {
    const storage = createCookieSessionStorage<{ studentId: string }>({
      cookie: {
        name: "__nora_session",
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        secrets: [secret],
      },
    });
    const session = await storage.getSession();
    session.set("studentId", "student-1");
    const cookie = await storage.commitSession(session);

    const response = await checkSession(cookie);
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ authenticated: true });
  });
});

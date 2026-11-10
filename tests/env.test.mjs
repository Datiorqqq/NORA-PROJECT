import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { getRequiredServerEnv, MissingServerConfigurationError } from "../app/.server/env.ts";

const savedValues = {
  SESSION_SECRET: process.env.SESSION_SECRET,
  MOODLE_BASE_URL: process.env.MOODLE_BASE_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

afterEach(() => {
  for (const [name, value] of Object.entries(savedValues)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

test("missing server configuration is rejected", () => {
  delete process.env.MOODLE_BASE_URL;
  assert.throws(
    () => getRequiredServerEnv("MOODLE_BASE_URL"),
    MissingServerConfigurationError,
  );
});

test("blank server configuration is rejected", () => {
  process.env.GEMINI_API_KEY = "  ";
  assert.throws(
    () => getRequiredServerEnv("GEMINI_API_KEY"),
    MissingServerConfigurationError,
  );
});

test("short session secrets are rejected", () => {
  process.env.SESSION_SECRET = "too-short";
  assert.throws(
    () => getRequiredServerEnv("SESSION_SECRET"),
    MissingServerConfigurationError,
  );
});

test("non-empty credentials remain server-only values", () => {
  process.env.SESSION_SECRET = "a".repeat(32);
  assert.equal(getRequiredServerEnv("SESSION_SECRET"), "a".repeat(32));
});

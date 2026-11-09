type ServerEnvName = "SESSION_SECRET" | "MOODLE_BASE_URL" | "GEMINI_API_KEY";

export class MissingServerConfigurationError extends Error {
  constructor(name: ServerEnvName) {
    super(`Missing or invalid server configuration: ${name}`);
    this.name = "MissingServerConfigurationError";
  }
}

export function getRequiredServerEnv(name: ServerEnvName): string {
  const value = process.env[name]?.trim();
  if (!value || (name === "SESSION_SECRET" && value.length < 32)) {
    throw new MissingServerConfigurationError(name);
  }
  return value;
}

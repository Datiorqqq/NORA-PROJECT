import { describe, expect, it } from "vitest";
import { InvalidMessageError, validateMessage } from "../app/.server/chat/validate";

describe("validateMessage", () => {
  it("returns normal text unchanged", () => {
    expect(validateMessage("привіт")).toBe("привіт");
  });
  it("trims spaces around the message", () => {
    expect(validateMessage("  привіт  ")).toBe("привіт");
  });
  it("rejects an empty message", () => {
    expect(() => validateMessage("")).toThrow(InvalidMessageError);
  });
  it("rejects a whitespace-only message", () => {
    expect(() => validateMessage("   ")).toThrow(InvalidMessageError);
  });
  it("rejects a number", () => {
    expect(() => validateMessage(123)).toThrow(InvalidMessageError);
  });
  it("rejects a null", () => {
    expect(() => validateMessage(null)).toThrow(InvalidMessageError);
  });
  it("rejects a message over 1000 characters", () => {
    expect(() => validateMessage("a".repeat(1001))).toThrow(InvalidMessageError);
  });
  it("accepts a message of exactly 1000 characters", () => {
    const text = "a".repeat(1000);
    expect(validateMessage(text)).toBe(text);
  });
});

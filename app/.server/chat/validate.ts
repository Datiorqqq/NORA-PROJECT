export class InvalidMessageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidMessageError";
  }
}

export function validateMessage(input: unknown): string {
  if (typeof input !== "string") {
    throw new InvalidMessageError("Message must be a string");
  }
  const text = input.trim();
  if (text.length === 0) {
    throw new InvalidMessageError("Message must not be empty");
  }
  if (text.length > 1000) {
    throw new InvalidMessageError("Message is too long");
  }
  return text;
}

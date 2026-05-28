export type ValidationResult = {
  ok: boolean;
  errors: Record<string, string>;
};

const usernamePattern = /^[a-z0-9_]{3,24}$/;

function clean(value: string) {
  return value.trim();
}

export function validateUsername(username: string) {
  const value = clean(username).toLowerCase();

  if (!usernamePattern.test(value)) {
    return "Use 3-24 lowercase letters, numbers, or underscores.";
  }

  return "";
}

export function validateDisplayName(displayName: string) {
  const value = clean(displayName);

  if (value.length < 2 || value.length > 36) {
    return "Display name must be 2-36 characters.";
  }

  return "";
}

export function validatePostInput(input: { title: string; body: string; hasAttachment?: boolean }) {
  const errors: Record<string, string> = {};
  const title = clean(input.title);
  const body = clean(input.body);

  if (title.length > 0 && title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (title.length > 100) {
    errors.title = "Title must be 3-100 characters.";
  }

  if (body.length > 2000) {
    errors.body = "Posts can be up to 2000 characters.";
  }

  if (!title && !body && !input.hasAttachment) {
    errors.title = "Add a title, body, image, GIF, or poll before posting.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
  } satisfies ValidationResult;
}

export function validateGameScore(score: number) {
  if (!Number.isInteger(score) || score < 0 || score > 250000) {
    return "Score must be a valid run score.";
  }

  return "";
}

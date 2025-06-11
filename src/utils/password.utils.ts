export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be at most 128 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least 1 uppercase letter (A-Z)");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least 1 lowercase letter (a-z)");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least 1 digit (0-9)");
  }

  if (!/[\s\p{P}\p{S}]/u.test(password)) {
    errors.push(
      "Password must contain at least 1 special character (punctuation or space)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export interface UsernameValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateUsername(username: string): UsernameValidationResult {
  const errors: string[] = [];

  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  if (username.length > 50) {
    errors.push("Username must be at most 50 characters long");
  }

  // Only allow alphanumeric characters, dots, and underscores
  if (!/^[a-zA-Z0-9._]+$/.test(username)) {
    errors.push(
      "Username can only contain letters, numbers, dots, and underscores"
    );
  }

  // Must start with alphanumeric character
  if (!/^[a-zA-Z0-9]/.test(username)) {
    errors.push("Username must start with a letter or number");
  }

  // Must end with alphanumeric character
  if (!/[a-zA-Z0-9]$/.test(username)) {
    errors.push("Username must end with a letter or number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function UsernameValidationResult(isValid, errors) {
  return { isValid, errors };
}

// Username validation rules - centralized for consistency
export const usernameRules = [
  {
    text: "At least 3 characters",
    test: (username) => username.length >= 3,
  },
  {
    text: "At most 50 characters",
    test: (username) => username.length <= 50,
  },
  {
    text: "Only letters, numbers, dots, and underscores",
    test: (username) => /^[a-zA-Z0-9._]*$/.test(username),
  },
  {
    text: "Must start with a letter or number",
    test: (username) => /^[a-zA-Z0-9]/.test(username),
  },
  {
    text: "Must end with a letter or number",
    test: (username) => /[a-zA-Z0-9]$/.test(username),
  },
];

export function validateUsername(username) {
  const errors = [];

  // Use the centralized rules
  usernameRules.forEach((rule) => {
    if (!rule.test(username)) {
      errors.push(rule.text);
    }
  });

  return new UsernameValidationResult(errors.length === 0, errors);
}

export function PasswordValidationResult(isValid, errors) {
  return { isValid, errors };
}

export const passwordRules = [
  {
    text: "At least 10 characters",
    test: (password) => password.length >= 10,
  },
  {
    text: "At most 128 characters",
    test: (password) => password.length <= 128,
  },
  {
    text: "At least 1 uppercase letter (A-Z)",
    test: (password) => /[A-Z]/.test(password),
  },
  {
    text: "At least 1 lowercase letter (a-z)",
    test: (password) => /[a-z]/.test(password),
  },
  {
    text: "At least 1 digit (0-9)",
    test: (password) => /\d/.test(password),
  },
  {
    text: "At least 1 special character (punctuation or space)",
    test: (password) =>
      /[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password),
  },
];

export function validatePassword(password) {
  const errors = [];

  passwordRules.forEach((rule) => {
    if (!rule.test(password)) {
      errors.push(rule.text);
    }
  });

  return new PasswordValidationResult(errors.length === 0, errors);
}

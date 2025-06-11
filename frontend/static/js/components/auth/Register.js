import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import { validatePassword, passwordRules } from "../../utils/password.js";
import { validateUsername, usernameRules } from "../../utils/username.js";
import { navigator } from "../../index.js";

class RegisterForm extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    successMessage: { type: String },
    passwordMismatch: { type: Boolean },
    passwordValidationErrors: { type: Array },
    showPasswordRequirements: { type: Boolean },
    usernameValidationErrors: { type: Array },
    showUsernameRequirements: { type: Boolean },
  };
  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.passwordMismatch = false;
    this.passwordValidationErrors = [];
    this.showPasswordRequirements = false;
    this.usernameValidationErrors = [];
    this.showUsernameRequirements = false;
  }
  static styles = css`
    :host {
      display: block;
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 25rem;
      margin: auto;
      margin-top: 5rem;
      font-family: sans-serif;
    }

    h2 {
      margin-top: 0;
      text-align: center;
      font-size: 24pt;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input {
      padding: 0.75rem;
      font-size: 12pt;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
    input.password-mismatch {
      border-color: #d32f2f;
      background-color: #ffebee;
    }

    input.password-invalid {
      border-color: #d32f2f;
      background-color: #ffebee;
    }
    input.password-valid {
      border-color: #2e7d32;
      background-color: #e8f5e8;
    }

    input.username-invalid {
      border-color: #d32f2f;
      background-color: #ffebee;
    }

    input.username-valid {
      border-color: #2e7d32;
      background-color: #e8f5e8;
    }

    .password-error {
      color: #d32f2f;
      font-size: 10pt;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
    }

    .username-error {
      color: #d32f2f;
      font-size: 10pt;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
    }

    .password-requirements {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      font-size: 10pt;
    }

    .password-requirements h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 11pt;
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 1rem;
      list-style: none;
    }

    .password-requirements li {
      margin: 0.25rem 0;
      display: flex;
      align-items: center;
    }

    .password-requirements .check {
      color: #2e7d32;
      margin-right: 0.5rem;
      font-weight: bold;
    }
    .password-requirements .cross {
      color: #d32f2f;
      margin-right: 0.5rem;
      font-weight: bold;
    }

    .username-requirements {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.75rem;
      margin-top: 0.5rem;
      font-size: 10pt;
    }

    .username-requirements h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
      font-size: 11pt;
    }

    .username-requirements ul {
      margin: 0;
      padding-left: 1rem;
      list-style: none;
    }

    .username-requirements li {
      margin: 0.25rem 0;
      display: flex;
      align-items: center;
    }

    .username-requirements .check {
      color: #2e7d32;
      margin-right: 0.5rem;
      font-weight: bold;
    }

    .username-requirements .cross {
      color: #d32f2f;
      margin-right: 0.5rem;
      font-weight: bold;
    }

    button {
      padding: 0.75rem;
      background-color: #2e2e2e;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: #444;
    }

    .helper {
      text-align: center;
      margin-top: 1rem;
      font-size: 11pt;
    }

    .helper a {
      color: #2e2e2e;
      font-weight: bold;
      text-decoration: none;
    }
    .helper a:hover {
      text-decoration: underline;
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 11pt;
    }

    .success {
      color: #2e7d32;
      background-color: #e8f5e8;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 11pt;
    }

    .loading {
      opacity: 0.6;
      cursor: not-allowed;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;
  render() {
    return html`
      <h2>Register</h2>
      ${this.errorMessage
        ? html`<aside class="error" role="alert">${this.errorMessage}</aside>`
        : ""}
      ${this.successMessage
        ? html`<aside class="success" role="status">
            ${this.successMessage}
          </aside>`
        : ""}
      <form
        @submit=${this.handleRegister}
        class=${this.loading ? "loading" : ""}
      >
        <input
          type="text"
          name="username"
          placeholder="User Name"
          required
          ?disabled=${this.loading}
          class=${this.getUsernameInputClass()}
          @input=${this.validateInputs}
          @focus=${() => (this.showUsernameRequirements = true)}
          @blur=${() => (this.showUsernameRequirements = false)}
        />
        ${this.showUsernameRequirements ||        this.usernameValidationErrors.length > 0
          ? this.renderUsernameRequirements()
          : ""}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          ?disabled=${this.loading}
          class=${this.getPasswordInputClass()}
          @input=${this.validateInputs}
          @focus=${() => (this.showPasswordRequirements = true)}
          @blur=${() => (this.showPasswordRequirements = false)}
        />
        ${this.showPasswordRequirements ||
        this.passwordValidationErrors.length > 0
          ? this.renderPasswordRequirements()
          : ""}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          ?disabled=${this.loading}
          class=${this.passwordMismatch ? "password-mismatch" : ""}
          @input=${this.validateInputs}
        />
        ${this.passwordMismatch
          ? html`<output class="password-error" role="alert"
              >Passwords do not match</output
            >`
          : ""}
        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? "Creating account..." : "Register"}
        </button>
      </form>
      <article class="helper">
        Already have an account? <a href="/">Login</a>
      </article>
    `;
  }

  validateInputs() {
    this.validateUsername();
    this.validatePasswords();
  }

  validateUsername() {
    const username = this.shadowRoot.querySelector(
      'input[name="username"]'
    ).value;

    // Validate username format
    const usernameValidation = validateUsername(username);
    this.usernameValidationErrors = usernameValidation.errors;
  }

  validatePasswords() {
    const password = this.shadowRoot.querySelector(
      'input[name="password"]'
    ).value;
    const confirmPassword = this.shadowRoot.querySelector(
      'input[name="confirmPassword"]'
    ).value;

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    this.passwordValidationErrors = passwordValidation.errors;

    // Check if passwords match
    if (confirmPassword && password !== confirmPassword) {
      this.passwordMismatch = true;
    } else {
      this.passwordMismatch = false;
    }
  }
  getPasswordInputClass() {
    const password =
      this.shadowRoot?.querySelector('input[name="password"]')?.value || "";
    if (!password) return "";

    const validation = validatePassword(password);
    return validation.isValid ? "password-valid" : "password-invalid";
  }

  getUsernameInputClass() {
    const username =
      this.shadowRoot?.querySelector('input[name="username"]')?.value || "";
    if (!username) return "";

    const validation = validateUsername(username);
    return validation.isValid ? "username-valid" : "username-invalid";
  }

  renderPasswordRequirements() {
    const password =
      this.shadowRoot?.querySelector('input[name="password"]')?.value || "";
    return html`
      <aside class="password-requirements">
        <h4>Password Requirements:</h4>
        <ul>
          ${passwordRules.map(
            (rule) => html`
              <li>
                <output class=${rule.test(password) ? "check" : "cross"}>
                  ${rule.test(password) ? "✓" : "✗"}
                </output>
                ${rule.text}
              </li>
            `
          )}
        </ul>
      </aside>
    `;
  }

  renderUsernameRequirements() {
    const username =
      this.shadowRoot?.querySelector('input[name="username"]')?.value || "";
    return html`
      <aside class="username-requirements">
        <h4>Username Requirements:</h4>
        <ul>
          ${usernameRules.map(
            (rule) => html`
              <li>
                <output class=${rule.test(username) ? "check" : "cross"}>
                  ${rule.test(username) ? "✓" : "✗"}
                </output>
                ${rule.text}
              </li>
            `
          )}
        </ul>
      </aside>
    `;
  }

  async handleRegister(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";
    this.successMessage = "";    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");// Validate passwords match
    if (password !== confirmPassword) {
      this.errorMessage = "Passwords do not match";
      this.passwordMismatch = true;
      this.loading = false;
      return;
    } // Validate username format
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      this.errorMessage =
        "Username does not meet requirements:\n" +
        usernameValidation.errors.join("\n");
      this.loading = false;
      return;
    }

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      this.errorMessage =
        "Password does not meet complexity requirements:\n" +
        passwordValidation.errors.join("\n");
      this.loading = false;
      return;
    }
    try {
      const response = await fetch(getApiUrl("auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigator("/setup-2fa");
      } else if (response.status === 429) {
        this.errorMessage =
          data.error ||
          "Too many registration attempts. Please try again later.";
        if (data.retryAfter) {
          this.errorMessage += ` You can try again in ${data.retryAfter}.`;
        }
      } else {
        this.errorMessage = data.error || "Registration failed";
      }
    } catch (error) {
      console.error("Registration error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }
}

customElements.define("register-form", RegisterForm);

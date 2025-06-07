import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import "./TwoFactorSetup.js";

class RegisterForm extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    successMessage: { type: String },
    showTwoFactorSetup: { type: Boolean },
    twoFactorData: { type: Object },
    passwordMismatch: { type: Boolean },
  };
  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.showTwoFactorSetup = false;
    this.twoFactorData = null;
    this.passwordMismatch = false;
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

    .password-error {
      color: #d32f2f;
      font-size: 10pt;
      margin-top: -0.5rem;
      margin-bottom: 0.5rem;
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
    if (this.showTwoFactorSetup) {
      return html`
        <h2>Complete Your Registration</h2>
        ${this.successMessage
          ? html`<div class="success">${this.successMessage}</div>`
          : ""}
        <two-factor-setup
          .qrCodeDataURL=${this.twoFactorData?.qrCodeDataURL}
          .secret=${this.twoFactorData?.secret}
          .isRegistrationFlow=${true}
        >
        </two-factor-setup>
      `;
    }

    return html`
      <h2>Register</h2>
      ${this.errorMessage
        ? html`<div class="error">${this.errorMessage}</div>`
        : ""}
      ${this.successMessage
        ? html`<div class="success">${this.successMessage}</div>`
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
        />
        <input
          type="email"
          name="emailAddress"
          placeholder="Email"
          required
          ?disabled=${this.loading}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          ?disabled=${this.loading}
          @input=${this.validatePasswords}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          ?disabled=${this.loading}
          class=${this.passwordMismatch ? "password-mismatch" : ""}
          @input=${this.validatePasswords}
        />
        ${this.passwordMismatch
          ? html`<div class="password-error">Passwords do not match</div>`
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

  validatePasswords() {
    const password = this.shadowRoot.querySelector(
      'input[name="password"]'
    ).value;
    const confirmPassword = this.shadowRoot.querySelector(
      'input[name="confirmPassword"]'
    ).value;

    if (confirmPassword && password !== confirmPassword) {
      this.passwordMismatch = true;
    } else {
      this.passwordMismatch = false;
    }
  }
  async handleRegister(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";
    this.successMessage = "";

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const emailAddress = formData.get("emailAddress");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validate passwords match
    if (password !== confirmPassword) {
      this.errorMessage = "Passwords do not match";
      this.passwordMismatch = true;
      this.loading = false;
      return;
    }
    try {
      const response = await fetch(getApiUrl("api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          emailAddress,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data temporarily and show 2FA setup
        this.twoFactorData = data.twoFactor;

        // Store the user data and password temporarily (for 2FA completion)
        localStorage.setItem("tempUser", JSON.stringify(data.user));
        localStorage.setItem("tempPassword", password);

        this.showTwoFactorSetup = true;
        this.successMessage =
          "Registration successful! Now set up Two-Factor Authentication.";
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

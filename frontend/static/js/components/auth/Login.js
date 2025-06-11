import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import "./TwoFactorSetup.js";
import { navigator } from "../../index.js";

class LoginForm extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    requiresTwoFactor: { type: Boolean },
  };
  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.requiresTwoFactor = false;
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

    .loading {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .icon {
      text-align: center;
      font-size: 48px;
      margin-bottom: 1rem;
    }

    .two-factor-section {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    .two-factor-label {
      color: #666;
      font-size: 12pt;
      margin-bottom: 2rem;
      text-align: center;
    }

    .two-factor-input {
      text-align: center;
      font-family: monospace;
      letter-spacing: 0.3em;
      font-size: 14pt;
    }
    .credentials-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border: none;
      padding: 0;
      margin: 0;
    }
    .hidden {
      display: none;
    }
  `;
  render() {
    return html`
      ${this.requiresTwoFactor ? html`<header class="icon">🔐</header>` : ""}
      <h2>${this.requiresTwoFactor ? "Two-Factor Authentication" : "Login"}</h2>
      ${this.requiresTwoFactor
        ? html`<p class="two-factor-label">
            Enter the 6-digit code from your authenticator app
          </p>`
        : ""}
      ${this.errorMessage
        ? html`<aside class="error" role="alert">${this.errorMessage}</aside>`
        : ""}
      <form @submit=${this.handleLogin} class=${this.loading ? "loading" : ""}>
        <fieldset
          class="credentials-section ${this.requiresTwoFactor ? "hidden" : ""}"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            ?disabled=${this.loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            ?disabled=${this.loading}
          />
        </fieldset>
        ${this.requiresTwoFactor
          ? html`<input
              type="text"
              name="token"
              placeholder="000000"
              maxlength="6"
              pattern="[0-9]{6}"
              required
              class="two-factor-input"
              ?disabled=${this.loading}
              autocomplete="one-time-code"
            />`
          : ""}
        <button type="submit" ?disabled=${this.loading}>
          ${this.getSubmitButtonText()}
        </button>
      </form>
      ${this.requiresTwoFactor
        ? html`<footer class="helper">
            <a href="#" @click=${this.resetForm}>← Back to Login</a>
          </footer>`
        : html`<article class="helper">
            Don't have an account? <a href="/register">Register</a>
          </article>`}
    `;
  }
  getSubmitButtonText() {
    if (this.loading) {
      return this.requiresTwoFactor ? "Verifying..." : "Signing in...";
    }
    if (this.requiresTwoFactor) return "Verify & Sign In";
    return "Login";
  }
  async handleLogin(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";

    const formData = new FormData(e.target);

    const credentials = {
      username: formData.get("username"),
      password: formData.get("password"),
      token: formData.get("token"),
    };

    try {
      const response = await this.submitLogin(credentials);
      const data = await response.json();

      if (response.ok) {
        this.handleSuccessfulLogin(data);
      } else {
        this.handleLoginError(response, data, credentials);
      }
    } catch (error) {
      console.error("Login error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  async submitLogin(credentials) {
    const body = {
      username: credentials.username,
      password: credentials.password,
    };

    if (credentials.token) {
      body.token = credentials.token;
    }

    return fetch(getApiUrl("auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  handleSuccessfulLogin(data) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.requiresTwoFactorSetup) {
      const twoFactorSetup = document.createElement("two-factor-setup");
      const app = document.querySelector("#app");
      app.replaceChildren(twoFactorSetup);
    } else {
      navigator("/home");
    }
  }
  handleLoginError(response, data, credentials) {
    if (response.status === 429) {
      this.handleRateLimitError(data);
    } else if (data.requiresTotpToken && !this.requiresTwoFactor) {
      this.showTwoFactorInput(credentials);
    } else {
      this.errorMessage = data.error || "Login failed";
      this.handleTwoFactorError();
    }
  }

  handleRateLimitError(data) {
    this.errorMessage =
      data.error || "Too many login attempts. Please try again later.";
    if (data.retryAfter) {
      this.errorMessage += ` You can try again in ${data.retryAfter}.`;
    }
  }
  showTwoFactorInput(credentials) {
    this.requiresTwoFactor = true;
    this.errorMessage = "";
    setTimeout(() => {
      const tokenInput = this.shadowRoot.querySelector('input[name="token"]');
      if (tokenInput) {
        tokenInput.focus();
      }
    }, 100);
  }

  handleTwoFactorError() {
    if (this.requiresTwoFactor) {
      const tokenInput = this.shadowRoot.querySelector('input[name="token"]');
      if (tokenInput) {
        tokenInput.value = "";
        tokenInput.focus();
      }
    }
  }
  resetForm() {
    this.requiresTwoFactor = false;
    this.errorMessage = "";
    const form = this.shadowRoot.querySelector("form");
    if (form) {
      form.reset();
    }
  }
}

customElements.define("login-form", LoginForm);

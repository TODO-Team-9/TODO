import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";

class TwoFactorVerification extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    username: { type: String },
    password: { type: String },
  };

  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.username = "";
    this.password = "";
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
      color: #2e2e2e;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
      font-size: 12pt;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    input {
      padding: 0.75rem;
      font-size: 14pt;
      border-radius: 4px;
      border: 1px solid #ccc;
      text-align: center;
      font-family: monospace;
      letter-spacing: 0.3em;
    }

    button {
      padding: 0.75rem;
      background-color: #2e2e2e;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12pt;
    }

    button:hover {
      background-color: #444;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
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

    .helper {
      text-align: center;
      margin-top: 1rem;
      font-size: 11pt;
      color: #666;
    }

    .helper a {
      color: #2e2e2e;
      font-weight: bold;
      text-decoration: none;
    }

    .helper a:hover {
      text-decoration: underline;
    }

    .icon {
      text-align: center;
      font-size: 48px;
      margin-bottom: 1rem;
    }
  `;

  async handleVerifyToken(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";

    const formData = new FormData(e.target);
    const token = formData.get("token");

    try {
      const response = await fetch(getApiUrl("api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          token: token,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        window.location.href = "/home";
      } else {
        this.errorMessage = data.error || "Invalid verification code";
        const form = this.shadowRoot.querySelector("form");
        if (form) {
          form.reset();
        }
      }
    } catch (error) {
      console.error("2FA verification error:", error);
      this.errorMessage = "Network error. Please try again.";
      const form = this.shadowRoot.querySelector("form");
      if (form) {
        form.reset();
      }
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    window.location.href = "/";
  }

  render() {
    return html`
      <div class="icon">🔐</div>
      <h2>Two-Factor Authentication</h2>
      <div class="subtitle">
        Enter the 6-digit code from your authenticator app
      </div>

      ${this.errorMessage
        ? html`<div class="error">${this.errorMessage}</div>`
        : ""}

      <form
        @submit=${this.handleVerifyToken}
        class=${this.loading ? "loading" : ""}
      >
        <input
          type="text"
          name="token"
          placeholder="000000"
          maxlength="6"
          pattern="[0-9]{6}"
          required
          ?disabled=${this.loading}
          autocomplete="one-time-code"
        />
        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? "Verifying..." : "Verify & Sign In"}
        </button>
      </form>

      <div class="helper">
        <a href="#" @click=${this.goBack}>← Back to Login</a>
      </div>
    `;
  }
}

customElements.define("two-factor-verification", TwoFactorVerification);

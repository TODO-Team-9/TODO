import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import "./TwoFactorVerification.js";
import "./TwoFactorSetup.js";

class LoginForm extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
  };

  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
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

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  `;
  render() {
    return html`
      <h2>Login</h2>
      ${this.errorMessage
        ? html`<div class="error">${this.errorMessage}</div>`
        : ""}
      <form @submit=${this.handleLogin} class=${this.loading ? "loading" : ""}>
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
        <button type="submit" ?disabled=${this.loading}>
          ${this.loading ? "Signing in..." : "Login"}
        </button>
      </form>
      <article class="helper">
        Don't have an account? <a href="/register">Register</a>
      </article>
    `;
  }
  async handleLogin(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";

    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      const response = await fetch(getApiUrl("auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Store the token (could be provisional or full JWT)
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.requiresTwoFactorSetup) {
          const twoFactorSetup = document.createElement("two-factor-setup");

          const app = document.querySelector("#app");
          app.replaceChildren(twoFactorSetup);
        } else {
          window.location.href = "/home";
        }
      } else if (data.requiresTotpToken) {
        const twoFactorVerification = document.createElement(
          "two-factor-verification"
        );
        twoFactorVerification.username = username;
        twoFactorVerification.password = password;

        const app = document.querySelector("#app");
        app.replaceChildren(twoFactorVerification);
      } else {
        this.errorMessage = data.error || "Login failed";
      }
    } catch (error) {
      console.error("Login error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }
}

customElements.define("login-form", LoginForm);

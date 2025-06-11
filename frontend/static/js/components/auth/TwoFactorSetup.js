import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import { AuthManager } from "../../utils/auth.js";
import { navigator } from "../../index.js";

class TwoFactorSetup extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    successMessage: { type: String },
    qrCodeDataURL: { type: String },
    secret: { type: String },
    setupComplete: { type: Boolean },
  };
  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.qrCodeDataURL = "";
    this.secret = "";
    this.setupComplete = false;
  }

  static styles = css`
    :host {
      display: block;
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      max-width: 80rem;
      margin: auto;
      margin-top: 2rem;
      font-family: sans-serif;
    }

    h2 {
      margin-top: 0;
      text-align: center;
      font-size: 20pt;
      color: #2e2e2e;
    }

    h3 {
      color: #2e2e2e;
      font-size: 14pt;
      margin-bottom: 0.5rem;
    }

    .setup-steps {
      display: flex;
      flex-direction: row;
      gap: 1.5rem;
    }

    .step {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 0.5rem;
      background: #f9f9f9;
    }

    .step-number {
      background: #2e2e2e;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 0.5rem;
    }

    .qr-code {
      text-align: center;
      margin: 1rem 0;
    }

    .qr-code img {
      max-width: 200px;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
    }
    .secret-display {
      display: block;
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 0.25rem;
      border: 1px solid #ddd;
      font-family: monospace;
      word-break: break-all;
      overflow-wrap: anywhere;
      margin: 0.5rem 0;
    }

    .verification-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    input {
      padding: 0.75rem;
      font-size: 12pt;
      border-radius: 4px;
      border: 1px solid #ccc;
      text-align: center;
      font-family: monospace;
      letter-spacing: 0.2em;
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

    .completed {
      text-align: center;
      padding: 2rem;
    }

    .completed .checkmark {
      font-size: 48px;
      color: #4caf50;
      margin-bottom: 1rem;
    }

    .app-list {
      margin: 0.5rem 0;
      padding-left: 1rem;
    }

    .app-list li {
      margin: 0.25rem 0;
    }

    .copy-button {
      background: #007bff;
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      cursor: pointer;
      font-size: 10pt;
      margin-left: 0.5rem;
    }
    .copy-button:hover {
      background: #0056b3;
    }

    @media (max-width: 700px) {
      .setup-steps {
        flex-direction: column;
      }
    }
  `;
  async connectedCallback() {
    super.connectedCallback();
    await this.generateQRCode();
  }

  async generateQRCode() {
    this.loading = true;
    this.errorMessage = "";

    try {
      const user = AuthManager.getUser();
      if (!user) {
        this.errorMessage = "User not authenticated";
        return;
      }

      const response = await AuthManager.makeAuthenticatedRequest(
        getApiUrl("auth/generate-2fa"),
        {
          method: "POST",
        }
      );

      if (!response) {
        this.errorMessage = "Authentication failed";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        this.qrCodeDataURL = data.twoFactor.qrCodeDataURL;
        this.secret = data.twoFactor.secret;
      } else {
        this.errorMessage = data.error || "Failed to generate 2FA setup";
      }
    } catch (error) {
      console.error("2FA setup error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }
  async handleVerifyToken(e) {
    e.preventDefault();
    this.loading = true;
    this.errorMessage = "";

    const formData = new FormData(e.target);
    const token = formData.get("token");

    try {
      const response = await AuthManager.makeAuthenticatedRequest(
        getApiUrl("auth/enable-2fa"),
        {
          method: "POST",
          body: JSON.stringify({
            secret: this.secret,
            token: token,
          }),
        }
      );

      if (!response) {
        this.errorMessage = "Authentication failed";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);

        this.setupComplete = true;
        this.successMessage =
          "Two-Factor Authentication has been successfully enabled!";
      } else {
        this.errorMessage = data.error || "Invalid verification code";
      }
    } catch (error) {
      console.error("2FA enable error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }
  copySecret() {
    navigator.clipboard.writeText(this.secret).then(() => {
      this.successMessage = "Secret copied to clipboard!";
      setTimeout(() => {
        this.successMessage = "";
      }, 3000);
    });
  }

  renderQRCodeSection() {
    if (this.qrCodeDataURL) {
      return html`
        <figure class="qr-code">
          <img src="${this.qrCodeDataURL}" alt="2FA QR Code" />
        </figure>
        <p><strong>Can't scan?</strong> Enter this code manually:</p>
        <code class="secret-display">
          ${this.secret}
          <button class="copy-button" @click=${this.copySecret}>Copy</button>
        </code>
      `;
    }
    return html`<p>Loading QR code...</p>`;
  }

  renderVerificationForm() {
    return html`
      <form
        @submit=${this.handleVerifyToken}
        class="verification-form ${this.loading ? "loading" : ""}"
      >
        <input
          type="text"
          name="token"
          placeholder="000000"
          maxlength="6"
          pattern="[0-9]{6}"
          required
          ?disabled=${this.loading}
        />
        <button type="submit" ?disabled=${this.loading || !this.qrCodeDataURL}>
          ${this.loading ? "Verifying..." : "Enable 2FA"}
        </button>
      </form>
    `;
  }

  render() {
    if (this.setupComplete) {
      return html`
        <main class="completed">
          <mark class="checkmark">✓</mark>
          <h2>2FA Setup Complete!</h2>
          <p>
            Two-Factor Authentication has been successfully enabled for your
            account.
          </p>
          <p>
            You will now need to provide a code from your authenticator app each
            time you log in.
          </p>
          <button @click=${() => (navigator('/home'))}>
            Continue to Dashboard
          </button>
        </main>
      `;
    }

    return html`
      <h2>Set Up Two-Factor Authentication</h2>
      ${this.errorMessage
        ? html`<aside class="error" role="alert">${this.errorMessage}</aside>`
        : ""}
      ${this.successMessage
        ? html`<aside class="success" role="status">
            ${this.successMessage}
          </aside>`
        : ""}
      ${this.loading && !this.qrCodeDataURL
        ? html`<p>Generating setup code...</p>`
        : html`
            <main class="setup-steps">
              <section class="step">
                <h3>
                  <data class="step-number" value="1">1</data>Install an
                  Authenticator App
                </h3>
                <p>
                  Download and install one of these authenticator apps on your
                  mobile device:
                </p>
                <ul class="app-list">
                  <li>Google Authenticator</li>
                  <li>Microsoft Authenticator</li>
                  <li>Authy</li>
                  <li>1Password</li>
                </ul>
              </section>
              <section class="step">
                <h3>
                  <data class="step-number" value="2">2</data>Scan QR Code
                </h3>
                <p>Open your authenticator app and scan this QR code:</p>
                ${this.renderQRCodeSection()}
              </section>
              <section class="step">
                <h3>
                  <data class="step-number" value="3">3</data>Verify Setup
                </h3>
                <p>
                  Enter the 6-digit code from your authenticator app to complete
                  setup:
                </p>
                ${this.renderVerificationForm()}
              </section>
            </main>
          `}
    `;
  }
}

customElements.define("two-factor-setup", TwoFactorSetup);

import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import { AuthManager } from "../../utils/auth.js";

class UserSettings extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    successMessage: { type: String },
    user: { type: Object },
    showDisable2FA: { type: Boolean },
  };

  constructor() {
    super();
    this.loading = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.user = null;
    this.showDisable2FA = false;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      font-family: sans-serif;
    }

    .settings-section {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .section-header {
      background: #f5f5f5;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .section-header h3 {
      margin: 0;
      color: #2e2e2e;
      font-size: 18px;
    }

    .section-content {
      padding: 1.5rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info h4 {
      margin: 0 0 0.5rem 0;
      color: #2e2e2e;
      font-size: 16px;
    }

    .setting-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .setting-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 12px;
      font-weight: bold;
    }

    .status-enabled {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .status-disabled {
      background: #ffebee;
      color: #d32f2f;
    }

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }

    .btn-primary {
      background: #2e2e2e;
      color: white;
    }

    .btn-primary:hover {
      background: #444;
    }

    .btn-danger {
      background: #d32f2f;
      color: white;
    }

    .btn-danger:hover {
      background: #b71c1c;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #2e2e2e;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 14px;
    }

    .success {
      color: #2e7d32;
      background-color: #e8f5e8;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 14px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 0.5rem;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .modal h3 {
      margin-top: 0;
      color: #2e2e2e;
    }

    .modal-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.user = AuthManager.getUser();
  }

  async setup2FA() {
    window.location.href = "/setup-2fa";
  }

  confirmDisable2FA() {
    this.showDisable2FA = true;
  }

  cancelDisable2FA() {
    this.showDisable2FA = false;
  }

  async disable2FA() {
    this.loading = true;
    this.errorMessage = "";

    try {
      const response = await AuthManager.makeAuthenticatedRequest(
        getApiUrl("api/auth/disable-2fa"),
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
        this.successMessage = "Two-Factor Authentication has been disabled.";
        this.showDisable2FA = false;
        // Update user data to reflect 2FA is now disabled
        const updatedUser = { ...this.user, twoFactorEnabled: false };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        this.user = updatedUser;
      } else {
        this.errorMessage = data.error || "Failed to disable 2FA";
      }
    } catch (error) {
      console.error("Disable 2FA error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (!this.user) {
      return html`<p>Loading...</p>`;
    }

    return html`
      <h2>Account Settings</h2>

      ${this.errorMessage
        ? html`<div class="error">${this.errorMessage}</div>`
        : ""}
      ${this.successMessage
        ? html`<div class="success">${this.successMessage}</div>`
        : ""}

      <div class="settings-section">
        <div class="section-header">
          <h3>Security</h3>
        </div>
        <div class="section-content">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Two-Factor Authentication</h4>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div class="setting-status">
              ${this.user.twoFactorEnabled
                ? html`
                    <span class="status-badge status-enabled">Enabled</span>
                    <button
                      class="btn-danger"
                      @click=${this.confirmDisable2FA}
                      ?disabled=${this.loading}
                    >
                      Disable
                    </button>
                  `
                : html`
                    <span class="status-badge status-disabled">Disabled</span>
                    <button
                      class="btn-primary"
                      @click=${this.setup2FA}
                      ?disabled=${this.loading}
                    >
                      Enable
                    </button>
                  `}
            </div>
          </div>
        </div>
      </div>

      ${this.showDisable2FA
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <h3>Disable Two-Factor Authentication</h3>
                <p>
                  Are you sure you want to disable two-factor authentication?
                  This will make your account less secure.
                </p>
                <div class="modal-actions">
                  <button class="btn-secondary" @click=${this.cancelDisable2FA}>
                    Cancel
                  </button>
                  <button
                    class="btn-danger"
                    @click=${this.disable2FA}
                    ?disabled=${this.loading}
                  >
                    ${this.loading ? "Disabling..." : "Disable 2FA"}
                  </button>
                </div>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

customElements.define("user-settings", UserSettings);

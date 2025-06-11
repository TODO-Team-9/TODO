import { LitElement, html, css } from "lit";
import { getApiUrl } from "../../utils/config.js";
import { AuthManager } from "../../utils/auth.js";

class UserProfile extends LitElement {
  static properties = {
    loading: { type: Boolean },
    errorMessage: { type: String },
    user: { type: Object },
    userStats: { type: Object },
  };

  constructor() {
    super();
    this.loading = true;
    this.errorMessage = "";
    this.user = null;
    this.userStats = null;
  }

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: sans-serif;
    }

    .profile-header {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2e2e2e, #444);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: bold;
      margin: 0 auto 1.5rem auto;
    }

    .profile-name {
      font-size: 28px;
      font-weight: bold;
      color: #2e2e2e;
      margin-bottom: 0.5rem;
    }

    .profile-email {
      font-size: 16px;
      color: #666;
      margin-bottom: 1rem;
    }

    .profile-badges {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .badge {
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      font-size: 14px;
      font-weight: bold;
    }

    .badge-role {
      background: #e3f2fd;
      color: #1976d2;
    }

    .badge-2fa {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .badge-2fa.disabled {
      background: #ffebee;
      color: #d32f2f;
    }

    .profile-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .profile-sections {
        grid-template-columns: 1fr;
      }
    }

    .profile-section {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: bold;
      color: #555;
    }

    .info-value {
      color: #2e2e2e;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .stat-card {
      text-align: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 0.5rem;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: #2e2e2e;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
    }

    .actions {
      margin-top: 2rem;
      text-align: center;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      text-decoration: none;
      display: inline-block;
      margin: 0 0.5rem;
    }

    .btn-primary {
      background: #2e2e2e;
      color: white;
    }

    .btn-primary:hover {
      background: #444;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #2e2e2e;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadUserProfile();
  }

  async loadUserProfile() {
    this.loading = true;
    this.errorMessage = "";

    try {
      const currentUser = AuthManager.getUser();
      if (!currentUser) {
        this.errorMessage = "User not authenticated";
        return;
      }

      const response = await AuthManager.makeAuthenticatedRequest(
        getApiUrl(`api/users/${currentUser.user_id}`)
      );

      if (!response) {
        this.errorMessage = "Authentication failed";
        return;
      }

      const data = await response.json();

      if (response.ok) {
        this.user = data.user;
        this.userStats = {
          totalTasks: 0,
          completedTasks: 0,
          teamsJoined: 0,
          pendingRequests: 0,
        };
      } else {
        this.errorMessage = data.error || "Failed to load profile";
      }
    } catch (error) {
      console.error("Profile load error:", error);
      this.errorMessage = "Network error. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  getRoleDisplayName(systemRoleId) {
    switch (systemRoleId) {
      case 1:
        return "Access Administrator";
      case 2:
        return "System User";
      default:
        return "Unknown Role";
    }
  }

  getUserInitials(username) {
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  }

  render() {
    if (this.loading) {
      return html`<div class="loading">Loading profile...</div>`;
    }

    if (this.errorMessage) {
      return html`<div class="error">${this.errorMessage}</div>`;
    }

    if (!this.user) {
      return html`<div class="error">No user data available</div>`;
    }

    return html`
      <div class="profile-header">
        <div class="profile-avatar">
          ${this.getUserInitials(this.user.username)}
        </div>
        <div class="profile-name">${this.user.username}</div>
        <div class="profile-email">${this.user.emailAddress}</div>
        <div class="profile-badges">
          <span class="badge badge-role">
            ${this.getRoleDisplayName(this.user.systemRoleId)}
          </span>
          <span
            class="badge badge-2fa ${this.user.twoFactorSecret
              ? ""
              : "disabled"}"
          >
            2FA ${this.user.twoFactorSecret ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      <div class="profile-sections">
        <div class="profile-section">
          <div class="section-header">
            <h3>Account Information</h3>
          </div>
          <div class="section-content">
            <div class="info-item">
              <span class="info-label">User ID</span>
              <span class="info-value">#${this.user.userId}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Username</span>
              <span class="info-value">${this.user.username}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">${this.user.emailAddress}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Role</span>
              <span class="info-value"
                >${this.getRoleDisplayName(this.user.systemRoleId)}</span
              >
            </div>
            <div class="info-item">
              <span class="info-label">Account Status</span>
              <span class="info-value"
                >${this.user.deactivatedAt ? "Deactivated" : "Active"}</span
              >
            </div>
          </div>
        </div>

        <div class="profile-section">
          <div class="section-header">
            <h3>Activity Stats</h3>
          </div>
          <div class="section-content">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-number">
                  ${this.userStats?.totalTasks || 0}
                </div>
                <div class="stat-label">Total Tasks</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">
                  ${this.userStats?.completedTasks || 0}
                </div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">
                  ${this.userStats?.teamsJoined || 0}
                </div>
                <div class="stat-label">Teams Joined</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">
                  ${this.userStats?.pendingRequests || 0}
                </div>
                <div class="stat-label">Pending Requests</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <a href="/settings" class="btn btn-primary">Edit Account Settings</a>
        <a href="/home" class="btn btn-secondary">Back to Home</a>
      </div>
    `;
  }
}

customElements.define("user-profile", UserProfile);

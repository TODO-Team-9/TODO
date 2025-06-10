import { LitElement, html, css } from "lit";
import { AuthManager } from "../../utils/auth.js";

class NavigationSidebar extends LitElement {
  static properties = {
    user: { type: Object },
    isNormalUser: { type: Boolean },
    isTeamLead: { type: Boolean }
  };

  constructor() {
    super();
    this.user = AuthManager.getUser();
    this.isNormalUser = true;
    this.isTeamLead = false;
  }

  static styles = css`
    :host {
      display: block;
      background-color: #2e2e2e;
      color: white;
      padding: 1rem 2rem;
      font-size: 14pt;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .links a {
      margin-right: 1.5rem;
      text-decoration: none;
      color: white;
      font-weight: bold;
    }

    .links a:hover {
      text-decoration: underline;
    }
    .links a.active {
      text-decoration: underline;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      font-size: 12pt;
      color: #ccc;
    }

    .logout-btn {
      background: none;
      border: 1px solid #ccc;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12pt;
    }

    .logout-btn:hover {
      background-color: #444;
    }
  `;

  async connectedCallback(){
    super.connectedCallback();
    this.isNormalUser = await this.isNormal();
    this.isTeamLead = await this.isLead();
  }

  async isLead(){
    const teams = await AuthManager.teamLeadTeams();
    return teams.length != 0;
  }
  
  async isNormal(){
    return await AuthManager.isNormalUser();
  }

  get currentPath() {
    return window.location.pathname.replace(/\/$/, "");
  }
  render() {
    return html`
      <nav>
        <section class="logo">TODO App</section>
        <section class="links">
          <a
            href="/home"
            class=${
            this.currentPath !== "/requests" &&
            this.currentPath !== "/settings" &&
            this.currentPath !== "/roles"
              ? "active"
              : ""}
            >Home</a
          >
          ${!this.isNormalUser || this.isTeamLead ? 
            html`<a
                href="/requests"
                class=${this.currentPath === "/requests" || this.currentPath === "/roles" ? "active" : ""}
                >Requests</a
            >` : ''
          }

          <a
            href="/settings"
            class=${this.currentPath === "/settings" ? "active" : ""}
            >Settings</a
          >
        </section>
        ${this.user
          ? html`
              <section class="user-section">
                <span class="user-info">Welcome, ${this.user.username}</span>
                <button class="logout-btn" @click=${this.handleLogout}>
                  Logout
                </button>
              </section>
            `
          : ""}
      </nav>
    `;
  }

  handleLogout() {
    AuthManager.logout();
  }
}

customElements.define("nav-bar", NavigationSidebar);

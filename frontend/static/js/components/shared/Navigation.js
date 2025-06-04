import { LitElement, html, css } from 'lit';

class NavigationSidebar extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: #2e2e2e;
      color: white;
      padding: 1rem 2rem;
      font-size: 1.2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  `;

    get currentPath() {
        return window.location.pathname.replace(/\/$/, '');
    }

  render() {
    return html`
      <nav>
        <div class="logo">TODO App</div>
        <div class="links">
            <a href="/home" class=${(this.currentPath !== '/profile' && this.currentPath !== '/requests') ? 'active' : ''}>Home</a>
            <a href="/requests" class=${this.currentPath === '/requests' ? 'active' : ''}>Requests</a>
            <a href="/profile" class=${this.currentPath === '/profile' ? 'active' : ''}>Profile</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavigationSidebar);

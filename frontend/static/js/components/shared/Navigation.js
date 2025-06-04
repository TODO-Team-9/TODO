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
  `;

  render() {
    return html`
      <nav>
        <div class="logo">TODO App</div>
        <div class="links">
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavigationSidebar);

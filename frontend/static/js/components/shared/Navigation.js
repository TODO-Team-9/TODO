import { LitElement, html, css } from 'lit';

class NavigationSidebar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 15rem;
      background-color: #e0e0e0;
      height: 100vh;
      padding: 1rem;
      box-sizing: border-box;
      font-family: sans-serif;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 2rem;
    }

    nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }

    nav a {
      background: #fff;
      padding: 0.5rem;
      border-radius: 6px;
      text-decoration: none;
      color: #333;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .teams {
      font-size: 0.9rem;
      color: #555;
    }

    .teams ul {
      list-style: none;
      padding: 0.5rem 0 0;
      margin: 0;
    }

    .teams li {
      margin-bottom: 0.3rem;
    }

    .teams input[type='radio'] {
      margin-right: 0.5rem;
    }
  `;

  render() {
    return html`
      <h1 class="logo">TodoApp</h1>
      <nav>
        <a href="/" data-link>Team Board</a>
        <a href="#" data-link>My Todos</a>
        <a href="/create/todo" data-link>Create Todo</a>
        <a href="#" data-link>Teams</a>
        <a href="#" data-link>Create Team</a>
      </nav>
    `;
  }
}

customElements.define('navigation-sidebar', NavigationSidebar);

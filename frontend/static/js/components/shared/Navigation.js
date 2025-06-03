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
      <div class="logo">TodoApp</div>
      <nav>
        <a href="#">Dashboard</a>
        <a href="#">My Tasks</a>
        <a href="#">Settings</a>
      </nav>
      <div class="teams">
        <div>Your Teams:</div>
        <ul>
          <li><label><input type="radio" name="team" value="Team 1" checked />Team 1</label></li>
          <li><label><input type="radio" name="team" value="Team 2" />Team 2</label></li>
        </ul>
      </div>
    `;
  }
}

customElements.define('navigation-sidebar', NavigationSidebar);

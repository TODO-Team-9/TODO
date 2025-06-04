import { LitElement, html, css } from 'lit';

class RegisterForm extends LitElement {
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
      font-size: 1.5rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    input {
      padding: 0.75rem;
      font-size: 1rem;
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
      font-size: 0.9rem;
    }

    .helper a {
      color: #2e2e2e;
      font-weight: bold;
      text-decoration: none;
    }

    .helper a:hover {
      text-decoration: underline;
    }
  `;

  render() {
    return html`
      <h2>Register</h2>
      <form @submit=${this.handleRegister}>
        <input type="text" placeholder="User Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
      <article class="helper">
        Already have an account? <a href="/">Login</a>
      </article>
    `;
  }

  handleRegister(e) {
    e.preventDefault();
    console.log("Register");
  }
}

customElements.define('register-form', RegisterForm);

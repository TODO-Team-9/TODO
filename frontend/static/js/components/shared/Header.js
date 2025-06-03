import { LitElement, html, css } from 'lit';

class AppHeader extends LitElement {
  static properties = {
    title: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      background-color: #a19668;
      color: black;
      padding: 1rem 2rem;
      font-family: sans-serif;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      text-align: center;
    }

    h1 {
      font-size: 1.5rem;
    }
  `;

  constructor() {
    super();
    this.title = 'Project Board';
  }

  render() {
    return html`
      <header>
        <h1>${this.title}</h1>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);

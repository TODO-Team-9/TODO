import { LitElement, html, css } from 'lit';

export class BoardHeader extends LitElement {
  static properties = {
    title: { type: String }
  }

  static styles = css`
    :host {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      max-width: 1000px;
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      font-family: sans-serif;
    }

    h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #2e2e2e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    button:hover {
      background-color: rgba(128, 123, 106, 0.85);
    }
  `;

  render() {
    return html`
      <h2>${this.title}</h2>
      <button>Create Todo</button>
    `;
  }
}

customElements.define('board-header', BoardHeader);
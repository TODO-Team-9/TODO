import { LitElement, css, html } from "lit";

export class TaskCard extends LitElement {
  static properties = {
    name: {},
  };
  static styles = css`
    :host {
      color: red;
    }
  `;

  constructor() {
    super();
    this.name = 'World';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
customElements.define('task-card', TaskCard);

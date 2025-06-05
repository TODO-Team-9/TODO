import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';

class TodoTicket extends LitElement {
  static properties = {
    title: { type: String },
    description: { type: String },
    assignedTo: { type: String },
    priority: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1rem;
      margin: 0.5rem 0;
      font-family: sans-serif;
      max-width: 300px;
      border-left: 6px solid var(--priority-color, gray);
      transition: box-shadow 0.2s ease;
    }

    :host(:hover) {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: 14pt;
      font-weight: bold;
    }

    .priority {
      font-size: 8pt;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: var(--priority-color, #ccc);
      color: white;
      text-transform: uppercase;
    }

    .description {
      margin: 0.5rem 0;
      font-size: 11pt;
      color: #333;
    }

    .footer {
      font-size: 9pt;
      color: #555;
      display: flex;
      justify-content: space-between;
    }

    .status {
      font-weight: bold;
      text-transform: uppercase;
    }

    .assigned {
      font-style: italic;
    }
  `;

  updated(changedProps) {
    if (changedProps.has('priority')) {
      const colorMap = {
        high: '#e74c3c',
        medium: '#f39c12',
        low: '#2ecc71'
      };
      const color = colorMap[this.priority?.toLowerCase()] || '#ccc';
      this.style.setProperty('--priority-color', color);
    }
  }

    _navigate(e) {
        navigator('/todo');
    }

  render() {
    return html`
    <section @click="${this._navigate}">
      <header class="header">
        <section class="title">${this.title}</section>
        <section class="priority">${this.priority}</section>
      </header>
      <p class="description">${this.description}</p>
      <footer class="footer">
        <section class="assigned">👤 ${this.assignedTo}</section>
      </footer>
    </section>
    `;
  }
}

customElements.define('todo-ticket', TodoTicket);

export default TodoTicket;
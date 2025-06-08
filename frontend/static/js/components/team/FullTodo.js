import { LitElement, html, css } from 'lit';
import './Header.js';

class FullTodo extends LitElement {
  static properties = {
    ticket: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
      width: 90%;
      margin: 0 auto;
    }

    .ticket {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      border-left: 6px solid var(--priority-color, gray);
      width: 90%;
      margin-left: auto;
      margin-right: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title {
      font-size: 20pt;
      font-weight: bold;
    }

    .priority {
      font-size: 9pt;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: var(--priority-color, #ccc);
      color: white;
      text-transform: uppercase;
    }

    .description {
      margin: 1rem 0;
      font-size: 12pt;
      color: #333;
    }

    label {
      display: block;
      margin-top: 1rem;
      font-weight: bold;
      font-size: 10pt;
    }

    select {
      padding: 0.5rem;
      font-size: 1rem;
      width: 100%;
      border-radius: 4px;
      border: 1px solid #ccc;
      margin-top: 0.25rem;
    }

    .footer {
      margin-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .assigned {
      font-style: italic;
      font-size: 10pt;
      color: #666;
    }

    button {
      padding: 0.5rem 1.25rem;
      background-color: #2e2e2e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12pt;
    }

    button:hover {
      background-color: rgba(128, 123, 106, 0.85);
    }
  `;

  constructor() {
    super();
    this.ticket = {
      title: 'Setup API',
      description: 'Add CRUD endpoints',
      assignedTo: 'Charlie',
      priority: 'Medium',
      status: 'Done'
    };
  }

  updated(changedProps) {
    if (changedProps.has('ticket')) {
      const colorMap = {
        high: '#e74c3c',
        medium: '#f39c12',
        low: '#2ecc71'
      };
      const color = colorMap[this.ticket.priority?.toLowerCase()] || '#ccc';
      this.style.setProperty('--priority-color', color);
    }
  }

  updateStatus(e) {
    const newStatus = e.target.value;
    this.dispatchEvent(new CustomEvent('status-updated', {
      detail: { ...this.ticket, status: newStatus }
    }));
  }

  render() {
    return html`
      <team-header
        .title=${'Todo Details'}
        .buttonCaption=${'Team Board'}
        .route=${'/home'}>
      </team-header>
    <section class="ticket">
        <header class="header">    
          <section class="title">${this.ticket.title}</section>
          <section class="priority">${this.ticket.priority}</section>
        </header>

        <p class="description">${this.ticket.description}</p>

        <label for="status">Status:</label>
        <select id="status" @change=${this.updateStatus}>
          <option value="Backlog" ?selected=${this.ticket.status === 'Backlog'}>Backlog</option>
          <option value="In Progress" ?selected=${this.ticket.status === 'In Progress'}>In Progress</option>
          <option value="In Review" ?selected=${this.ticket.status === 'In Review'}>In Review</option>
          <option value="Done" ?selected=${this.ticket.status === 'Done'}>Done</option>
        </select>

        <footer class="footer">
          <section class="assigned">👤 Assigned to: ${this.ticket.assignedTo}</section>
          <button>Update</button>
        </footer>
      </section>

    `;
  }
}

customElements.define('full-todo', FullTodo);
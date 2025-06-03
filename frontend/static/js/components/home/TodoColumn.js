import { LitElement, html, css } from 'lit';

class TodoColumn extends LitElement {
  static properties = {
    title: { type: String },
    tickets: { type: Array }
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      min-width: 5rem;
      max-width: 15rem;
      flex-shrink: 0;
      box-shadow: inset 0 0 0 1px #ddd;
    }

    h2 {
      font-size: 1.1rem;
      margin: 0 0 1rem;
      text-transform: uppercase;
      color: #444;
    }

    .ticket-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  `;

  constructor() {
    super();
    this.tickets = [];
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <section class="ticket-container">
        ${this.tickets.map(
          (ticket) => html`
            <todo-ticket
              .title=${ticket.title}
              .description=${ticket.description}
              .assignedTo=${ticket.assignedTo}
              .priority=${ticket.priority}>
            </todo-ticket>
          `
        )}
      </section>
    `;
  }
}

customElements.define('todo-column', TodoColumn);

export default TodoColumn;
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
      width: 14rem;
      box-shadow: inset 0 0 0 1px #ddd;
    }

    h2 {
      font-size: 14pt;
      margin: 0 0 1rem;
      text-transform: uppercase;
      color: #444;
    }

    .ticket-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex-grow: 1;
    }
  `;

  constructor() {
    super();
    this.tickets = [];
  }

  _onDragOver(e) {
    e.preventDefault(); // Allow drop
  }

  _onDrop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    this.dispatchEvent(new CustomEvent('ticket-dropped', {
      detail: {
        ticket: data,
        newStatus: this.title
      },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <h2>${this.title}</h2>
      <section
        class="ticket-container"
        @dragover=${this._onDragOver}
        @drop=${this._onDrop}
      >
        ${this.tickets.map(
          (ticket) => html`
            <todo-ticket
              .title=${ticket.title}
              .description=${ticket.description}
              .assignedTo=${ticket.assignedTo}
              .priority=${ticket.priority}
            ></todo-ticket>
          `
        )}
      </section>
    `;
  }
}

customElements.define('todo-column', TodoColumn);

export default TodoColumn;
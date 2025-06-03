import { LitElement, html, css } from 'lit';
import './TodoColumn.js';
import './TodoTicket.js';

class TodoBoard extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
    }

    .board {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
    }
  `;

  render() {
    const tasks = [
      {
        title: 'Implement login',
        description: 'Build Google OAuth2 login flow',
        assignedTo: 'Alice',
        priority: 'High',
        status: 'Backlog'
      },
      {
        title: 'Create ticket component',
        description: 'Make it look like a physical card',
        assignedTo: 'Bob',
        priority: 'Medium',
        status: 'In Progress'
      },
      {
        title: 'Create ticket component',
        description: 'Make it look like a physical card',
        assignedTo: 'Dave',
        priority: 'High',
        status: 'In Review'
      },
      {
        title: 'Setup API',
        description: 'Add CRUD endpoints',
        assignedTo: 'Charlie',
        priority: 'Medium',
        status: 'Done'
      },
      {
        title: 'Setup database schema',
        description: 'Add tables for projects and tasks',
        assignedTo: 'Charlie',
        priority: 'Low',
        status: 'Done'
      }
    ];

    const statuses = ['Backlog', 'In Progress', 'In Review', 'Done'];

    return html`
      <section class="board">
        ${statuses.map(
          (status) => html`
            <todo-column
              .title=${status}
              .tickets=${tasks.filter((t) => t.status === status)}>
            </todo-column>
          `
        )}
      </section>
    `;
  }
}

customElements.define('todo-board', TodoBoard);

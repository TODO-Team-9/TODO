import { LitElement, html, css } from 'lit';

class CreateTodo extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 40rem;
      height: 20rem;
      font-family: sans-serif;
    }

    h2 {
      margin-top: 0;
      font-size: 1.2rem;
      text-align: center
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    input, textarea, select, button {
      padding: 0.5rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    button {
      background-color: #807b6a;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color:rgba(128, 123, 106, 0.77);
    }
  `;

  static properties = {
    onCreate: { type: Function },
  };

  constructor() {
    super();
    this.onCreate = null;
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const task = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      assignedTo: form.assignedTo.value.trim(),
      priority: form.priority.value,
      status: form.status.value,
    };
    this.dispatchEvent(new CustomEvent('task-created', { detail: task }));
    form.reset();
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input name="title" placeholder="Title" required />
        <textarea name="description" placeholder="Description" rows="3" required></textarea>
        <input name="assignedTo" placeholder="Assigned To" required />
        
        <select name="priority" required>
          <option disabled selected value="">Priority</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select name="status" required>
          <option disabled selected value="">Status</option>
          <option>Backlog</option>
          <option>In Progress</option>
          <option>In Review</option>
          <option>Done</option>
        </select>

        <button type="submit">Create Todo</button>
      </form>
    `;
  }
}

customElements.define('create-todo', CreateTodo);

import { LitElement, html, css } from 'lit';

import "./Header.js";

class CreateTodo extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
      width: 90%;
    }

    h2 {
      margin-top: 0;
      font-size: 14pt;
      text-align: center
    }

    .form-container {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 90%;
      height: 25rem;
      font-family: sans-serif;
      margin-left: auto;
      margin-right: auto;
    }

    form { 
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    input, textarea, select, button {
      padding: 0.5rem;
      font-size: 12pt;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    button {
      background-color: #2e2e2e;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color:rgb(71, 71, 71);
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
    // const form = e.target;
    // const task = {
    //   title: form.title.value.trim(),
    //   description: form.description.value.trim(),
    //   assignedTo: form.assignedTo.value.trim(),
    //   priority: form.priority.value,
    //   status: form.status.value,
    // };
    // this.dispatchEvent(new CustomEvent('task-created', { detail: task }));
    // form.reset();
  }

  render() {
    return html`
      <team-header .title=${'Create Todo'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
      <section class="form-container">
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
    </section>
    `;
  }
}

customElements.define('create-todo', CreateTodo);

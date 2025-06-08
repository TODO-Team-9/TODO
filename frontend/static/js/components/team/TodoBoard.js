import { LitElement, html, css } from 'lit';
import './TodoColumn.js';
import './TodoTicket.js';
import './Header.js';

import todoService from '../../services/TodoService.js';
import teamService from '../../services/TeamService.js';

class TodoBoard extends LitElement {
  static properties = {
    statuses: { type: Array },
    teamName: { type: String },
    tasks: { type: Array }
  };

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

  constructor() {
    super();
    this.teamName = '';
    this.tasks = [];
    this.statuses = [];
  }

  connectedCallback(){
    super.connectedCallback();
    this.loadTodosAndTeam();    
    window.addEventListener('team-update', this._onTeamUpdate.bind(this));
  }

  async loadTodosAndTeam(){
    try {
        const status = await todoService.getStatuses();
        this.statuses = Array.isArray(status) ? status : [];

        const currentTeam = localStorage.getItem('currentTeam');
        const todos = await todoService.getTeamTodos(currentTeam);
        this.tasks = Array.isArray(todos) ? todos : [];

        const team = await teamService.getTeam(currentTeam);
        this.teamName = team.team_name;
    } catch (error) {
        this.tasks = [];
        this.members = [];
        this.statuses = [];
    }
  }

    async _onTicketDropped(e) {
        const { ticket, newStatus } = e.detail;
        const newStatusObj = this.statuses.find(s => s.status_id === newStatus);

        this.tasks = this.tasks.map((t) =>
            t.task_id === ticket.id
            ? { ...t, status_id: newStatus, status_name: newStatusObj.status_name }
            : t
        );

        await todoService.updateStatus(ticket.id, { statusId: newStatus });
    }

    async _onTeamUpdate(e){
        await this.loadTodosAndTeam();
    }

  render() {
    return html`
      <team-header .title=${this.teamName} .buttonCaption=${'Create Todo'} .route=${'/create/todo'}></team-header>
      <section class="board">
        ${this.statuses.map(
          (status) => html`
            <todo-column
              .title=${status.status_name}
              .id=${status.status_id}
              .tickets=${this.tasks.filter((t) => t.status_name === status.status_name)}
              @ticket-dropped=${this._onTicketDropped}>
            </todo-column>
          `
        )}
      </section>
    `;
  }
}

customElements.define('todo-board', TodoBoard);

export default TodoBoard;
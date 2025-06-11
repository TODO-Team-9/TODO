import { LitElement, html, css } from 'lit';
import { AuthManager } from '../../utils/auth';

import '../shared/Toast.js';

class TodoColumn extends LitElement {
  static properties = {
    id: { type: Number },
    title: { type: String },
    tickets: { type: Array },
    toastType: {type: String}
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
    e.preventDefault();
  }

  async canUpdate(user){
    const isAssignedUser = AuthManager.getUser().username === user;
    const selectedTeam = localStorage.getItem('selectedTeam');
    let isTeamLead = false;

    let teamLeadTeams = await AuthManager.teamLeadTeams();
    teamLeadTeams = teamLeadTeams.filter((team) => team.team_id == selectedTeam);

    if(teamLeadTeams.length == 0){
        isTeamLead = false;
    }else{
        isTeamLead = true;
    }

    return isAssignedUser || isTeamLead;
  }

    async _onDrop(e) {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        const allowed = await this.canUpdate(data.assignedTo);
        
        if(allowed){
            this.dispatchEvent(new CustomEvent('ticket-dropped', {
                detail: {
                    ticket: data,
                    newStatus: this.id
                },
                bubbles: true,
                composed: true
            }));        
        }else{
            const toast = this.renderRoot.querySelector('#toast');
            toast.show('You can only update tickets assigned to you', 'error')
        }
    }

  render() {
    return html`
      <h2>${this.title}</h2>
      <toast-message id="toast"></toast-message>
      <section
        class="ticket-container"
        @dragover=${this._onDragOver}
        @drop=${this._onDrop}
      >      
        ${this.tickets.map(
          (ticket) => html`
            <todo-ticket
                .id=${ticket.task_id}
                .title=${ticket.task_name}
                .description=${ticket.task_description}
                .assignedTo=${ticket.username}
                .priority=${ticket.priority_name}
            ></todo-ticket>
          `
        )}
      </section>
    `;
  }
}

customElements.define('todo-column', TodoColumn);

export default TodoColumn;
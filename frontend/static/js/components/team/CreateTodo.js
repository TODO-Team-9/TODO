import { LitElement, html, css } from 'lit';
import { AuthManager } from '../../utils/auth.js';

import "./Header.js";
import  todoService  from '../../services/TodoService.js';
import teamService from '../../services/TeamService.js';

class CreateTodo extends LitElement {
    static properties = {
        onCreate: { type: Function },
        priorities: { type: Array },
        teamMembers: { type: Array }
    }

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

  constructor() {
    super();
    this.onCreate = null;
    this.priorities = [];   
    this.teamMembers = [];
  }

  connectedCallback(){
    super.connectedCallback();
    this.loadPriorities();
    this.loadMembers();
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const todo = {
        taskName: form.title.value.trim(),
        taskDescription: form.description.value.trim(),
        teamId: localStorage.getItem('selectedTeam'),
        memberId: 1,
        priority: form.priority.value
    };
    
    todoService.createTodo(todo);
    alert('Todo Created');
    form.reset();
  }

  async loadPriorities(){
    try{
        const priorities = await todoService.getPriorities();
        this.priorities = Array.isArray(priorities) ? priorities : [];
    }catch (error){
        this.priorities = [];
    }
  }

    async loadMembers(){
        try{
            let teamLeadTeams = await AuthManager.teamLeadTeams();
            const selectedTeam = localStorage.getItem('selectedTeam');
            const members = await teamService.getTeamMembers(selectedTeam);

            teamLeadTeams = teamLeadTeams.filter((team) => team.team_id == selectedTeam);

            if(teamLeadTeams.length == 0){
                const member = members.find((member) => member.user_id === JSON.parse(localStorage.getItem('user')).user_id);
                this.teamMembers = [member];
            }else{
                this.teamMembers = Array.isArray(members) ? members : [];
            }
        }catch (error){
            this.teamMembers = [];
        }
    }

  render() {
    return html`
      <team-header .title=${'Create Todo'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
      <section class="form-container">
        <form @submit=${this.handleSubmit}>
            <input name="title" placeholder="Title" required />
            <textarea name="description" placeholder="Description" rows="3" required></textarea>
            <select name="assignedTo" required>
                <option disabled selected value="">Assign To</option>
                ${this.teamMembers.map(
                (member) => html`
                    <option value="${member.member_id}">
                        ${member.username}
                    </option>
                `
                )}
            </select>
            
            <select name="priority" required>
                <option disabled selected value="">Priority</option>
                ${this.priorities.map(
                (priority) => html`
                    <option value="${priority.priority_id}">
                        ${priority.priority_name}
                    </option>
                `
                )}
            </select>
            <button type="submit">Create Todo</button>
        </form>
    </section>
    `;
  }
}

customElements.define('create-todo', CreateTodo);

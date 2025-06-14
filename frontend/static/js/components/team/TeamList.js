import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import teamService from '../../services/TeamService.js';

class TeamList extends LitElement {
    static properties = {
        teams: { type: Array },
        members: { type: Array }
    }

  static styles = css`
    h3 {    
      font-size: 14pt;
    }

    button {
      display: block;
      width: 100%;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border: none;
      border-radius: 4px;
      background-color: #2e2e2e;
      color: white;
      text-align: center;
      font-weight: 500;
      cursor: pointer;
    }

    select {
        display: block;
        width: 100%;
        padding: 0.5rem;
        text-align: center;
        font-size: 12pt;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem;
      margin-bottom: 0.5rem;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      font-weight: 500;
    }

    button:hover {
      background-color: #d0d0d0;
    }

    .controls {
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }
  `;

  constructor() {
        super();
        this.teams = [];
        this.members = [];
  }

    connectedCallback(){
        super.connectedCallback();
        this.loadTeamsAndMembers();
        window.addEventListener('team-created', this._onTeamCreated.bind(this));
    }

    disconnectedCallback() {
        window.removeEventListener('team-created', this._onTeamCreated.bind(this));
        super.disconnectedCallback();
    }

    _onTeamCreated() {
        this.loadTeamsAndMembers();
    }

    async loadTeamsAndMembers() {
        try {
            const teams = await teamService.getUserTeams(JSON.parse(localStorage.getItem('user')).user_id);
            this.teams = Array.isArray(teams) ? teams : [];

            if(this.teams.length !== 0){
                localStorage.setItem('selectedTeam', this.teams[0].team_id);
                window.dispatchEvent(new CustomEvent('team-update', {
                    detail: { newTeam: this.teams[0].team_id }
                }));

                const members = await teamService.getTeamMembers(this.teams[0].team_id);
                this.members = Array.isArray(members) ? members : [];
            }else{
                const currentPath = window.location.pathname.replace(/\/$/, '');
                if(currentPath == '/home'){
                    navigator('/team/join');
                }
            }
        } catch (error) {
            console.log(error);
            this.teams = [];
            this.members = [];
        }
    }


    navigate(e) {
        const url = e.currentTarget.dataset.id;
        navigator(url);
    }

    async updateSelectedTeam(e){
        const selectedTeamName = e.target.value;
        const selectedTeam = this.teams.find(team => team.team_name === selectedTeamName);
        
        localStorage.setItem('selectedTeam', selectedTeam.team_id);
        const members = await teamService.getTeamMembers(selectedTeam.team_id);
        this.members = Array.isArray(members) ? members : [];

        window.dispatchEvent(new CustomEvent('team-update', {
            detail: { newTeam: selectedTeam.team_id }
        }));
    }


  render() {
    return html`
        <h3>Your Team</h3>
        <select name="team" @change="${this.updateSelectedTeam}">
            ${this.teams.map(
            (team) => html`
                <option>
                    ${team.team_name}
                </option>
            `
            )}
        </select>
        <section class="controls">
            <button data-id="/team/join" @click="${this.navigate}">Join Team</button>
            <button data-id="/create/team" @click="${this.navigate}">Create Team</button>
            <button data-id="/team/report" @click="${this.navigate}">Team Report</button>        
        </section>
      <h3>Team Members</h3>
      <ul>
        ${this.members.map(
          (member) => html`
            <li class="member">
                ${member.username}
            </li>
          `
        )}        
      </ul>
    `;
  }
}

customElements.define('team-list', TeamList);
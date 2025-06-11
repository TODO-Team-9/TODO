import { LitElement, html, css } from 'lit';

import "./Header.js";
import "./MemberStats.js";
import "../shared/StatCard.js";

import '../shared/Toast.js';

import teamService from '../../services/TeamService.js';

class TeamStats extends LitElement {
  static properties = {
    backlog: { type: Number },
    done: { type: Number },
    inProgress: { type: Number }
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
      width: 90%;
    }

    .stats {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
  `;

  constructor() {
    super();
    this.backlog = 0;
    this.done = 0;
    this.inProgress = 0;
  }

    firstUpdated() {
        this.getStats();    
    }

  connectedCallback(){
    super.connectedCallback();
  }

  async getStats(){
    try{        
        const selectedTeam = localStorage.getItem('selectedTeam');
        if(selectedTeam){
            const stats = await teamService.getTeamStats(selectedTeam);
            this.backlog = stats.backlog;
            this.inProgress = stats.in_progress;
            this.done = stats.completed;
        }else{
            const toast = this.renderRoot.querySelector('#toast');
            toast.show('No team selected', 'error')
        }
    }catch (error){
        this.backlog = 0;
        this.done = 0;
        this.inProgress = 0;       
    }
  }

  render() {
    return html`
        <toast-message id="toast"></toast-message>
        <team-header .title=${'Team Report'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
        <section class="stats">
            <stat-card .label="${'Backlog'}" .stat=${this.backlog}></stat-card>
            <stat-card .label="${'In Progress'}" .stat=${this.inProgress}></stat-card>
            <stat-card .label="${'Done'}" .stat=${this.done}></stat-card>
        </section>
        <member-stats></member-stats>

    `;
  }
}

customElements.define('team-stats', TeamStats);
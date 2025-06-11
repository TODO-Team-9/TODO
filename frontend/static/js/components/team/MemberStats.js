import { LitElement, html, css } from 'lit';

import teamService from '../../services/TeamService.js';

class MemberStats extends LitElement {
  static properties = {
    members: { type: Array },
    startDate: { type: String },
    endDate: { type: String }
  };

  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 1rem;
      font-family: sans-serif;
      max-width: 100%;
    }

    .header {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 12pt;
      background-color: #2e2e2e;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 8rem;
    }

    .date-group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-right: 1rem;
    }

    .date-group label {
        font-size: 10pt;
        margin-bottom: 0.25rem;
        text-align: center;
        color: #2e2e2e;
        font-weight: 500;
    }

    input[type="date"] {
        padding: 0.5rem;
        font-size: 12pt;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-family: sans-serif;
        width: 10rem;
    }

    button:hover {
      background-color: rgba(128, 123, 106, 0.85);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: #f3f3f3;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      font-size: 0.95rem;
      border-bottom: 1px solid #e0e0e0;
    }

    th {
      font-weight: bold;
    }

    tr:hover {
      background-color: #fafafa;
    }

    .done {
      color: #16a34a;
      font-weight: bold;
    }

    .in-progress {
      color: #d97706;
      font-weight: bold;
    }

    .in-review {
      color: #2563eb;
      font-weight: bold;
    }
    
    .backlog {
      color: #e74c3c;
      font-weight: bold;        
    }

    .total {
      color: #2e2e2e;
      font-weight: bolder;        
    }
  `;

  constructor() {
    super();
    this.members = [];
    this.startDate = '2025-01-01';
    this.endDate = '2025-12-31';
  }

    connectedCallback(){
        super.connectedCallback();
        this.getStats();
    }

    async getStats(){
        try{
            const selectedTeam = localStorage.getItem('selectedTeam');
            if(selectedTeam){
                const stats = await teamService.getTeamMemberStats(selectedTeam, this.startDate, this.endDate);
                this.members = Array.isArray(stats) ? stats : [];
            }
        }catch (error){
            this.members = [];
        }
    }

  render() {
    return html`
        <section class="header">
            <section class="date-group">
                <label for="start-date">Start Date</label>
                <input
                id="start-date"
                type="date"
                .value=${this.startDate}
                @change=${e => this.startDate = e.target.value}
                />
            </section>
            <section class="date-group">
                <label for="end-date">End Date</label>
                <input
                id="end-date"
                type="date"
                .value=${this.endDate}
                @change=${e => this.endDate = e.target.value}
                />
            </section>
            <button @click=${this.getStats}>Filter</button>
        </section>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Backlog</th>
                <th>In Progress</th>
                <th>Done</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            ${this.members.map(member => html`
                <tr>
                <td>${member.username}</td>
                <td class="backlog">${member.backlog}</td>
                <td class="in-progress">${member.in_progress}</td>
                <td class="done">${member.completed}</td>
                <td class="total">${member.total}</td>
                </tr>
            `)}
            </tbody>
        </table>
    `;
  }
}

customElements.define('member-stats', MemberStats);
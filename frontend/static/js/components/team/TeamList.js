import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';

class TeamList extends LitElement {
    static properties = {
        teams: { type: Array },
        members: { type: Array }
    }

  static styles = css`
    h3 {    
      font-size: 1.1rem;
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
        font-size: 1rem;
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
        this.teams = [{name: "Team A"}, {name: "Team B"}];
        this.members = [{name: "Alice"}, {name: "Bob"}, {name: "Charlie"}];
  }


    _navigate(e) {
        const url = e.currentTarget.dataset.id;
        navigator(url);
    }

  render() {
    return html`
        <h3>Your Team</h3>
        <select name="team">
            ${this.teams.map(
            (team) => html`
                <option>
                    ${team.name}
                </option>
            `
            )}
        </select>
        <section class="controls">
            <button data-id="/join" @click="${this._navigate}">Join Team</button>
            <button data-id="/create/team" @click="${this._navigate}">Create Team</button>        
        </section>
      <h3>Team Members</h3>
      <ul>
        ${this.members.map(
          (member) => html`
            <li class="member">
                ${member.name}
            </li>
          `
        )}        
      </ul>
    `;
  }
}

customElements.define('team-list', TeamList);
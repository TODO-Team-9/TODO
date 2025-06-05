import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';

import "./Header.js";
import "../shared/Table.js";

class JoinTeam extends LitElement {
    static properties = {
        onCreate: { type: Function },
        teams: { type: Array }
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

    .requests {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 90%;
      height: 15rem;
      font-family: sans-serif;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2rem;
    }

    .form-container {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 90%;
      height: 10rem;
      font-family: sans-serif;
      margin-left: auto;
      margin-right: auto;
    }

    form { 
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    input, select, textarea, button {
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
    this.teams = [{name: "Team A"}, {name: "Team B"}];
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
      <team-header .title=${'Join Team Requests'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
        <section class="requests">
            <h2>Current Requests<h2>
            <custom-table
                .columns = "${[
                    { key: 'team', header: 'Team Name' },
                    { key: 'status', header: 'Status' }
                ]}"
            
                .data = "${[
                    { team: 'Team C', status: 'Pending' },
                    { team: 'Team B', status: 'Approved' },
                    { team: 'Team A', status: 'Approved' }
                ]}"
            >
            </custom-table>
        </section>
      <section class="form-container">
        <h2>New Request<h2>
        <form @submit=${this.handleSubmit}>
            <select name="team" required>
                <option disabled selected value="">Select Team</option>
                ${this.teams.map(
                    (team) => html`
                        <option>
                            ${team.name}
                        </option>
                `
                )}
            </select>
            <button type="submit">Send Request</button>
        </form>
    </section>
    `;
  }
}

customElements.define('join-team', JoinTeam);
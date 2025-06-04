import { LitElement, html, css } from 'lit';

class TeamList extends LitElement {
    static properties = {
        teams: { type: Array }
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
        margin-top: 2.5rem;
    }
  `;

  constructor() {
    super();
    this.teams = [{name: "Team A"}, {name: "Team B"}, {name: "Team C"}];
  }


  render() {
    return html`
        <h3>Your Teams</h3>
        <ul>
            ${this.teams.map(
            (team) => html`
                <li class="team">
                    ${team.name}
                </li>
            `
            )}
        </ul>
        <section class="controls">
            <button>Join</button>
            <button>Create</button>        
        </section>

    `;
  }
}

customElements.define('team-list', TeamList);
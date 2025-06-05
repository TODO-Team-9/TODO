import { LitElement, html, css } from 'lit';

class MemberStats extends LitElement {
  static properties = {
    members: { type: Array }
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
      justify-content: flex-end;
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
    this.members = [
      { name: 'Alice', backlog: 5, done: 2, inProgress: 3, inReview: 2 },
      { name: 'Bob', backlog: 7, done: 4, inProgress: 2, inReview: 6 },
      { name: 'Charlie', backlog: 4, done: 4, inProgress: 0, inReview: 3 }
    ];
  }

  sum(member) {
    return member.backlog + member.done + member.inProgress + member.inReview;
  }

  render() {
    return html`
      <section class="header">
        <button @click=${() => console.log("filter")}>Filter</button>
      </section>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Backlog</th>
            <th>In Progress</th>
            <th>In Review</th>
            <th>Done</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${this.members.map(member => html`
            <tr>
              <td>${member.name}</td>
              <td class="backlog">${member.backlog}</td>
              <td class="in-progress">${member.inProgress}</td>
              <td class="in-review">${member.inReview}</td>
              <td class="done">${member.done}</td>
              <td class="total">${this.sum(member)}</td>
            </tr>
          `)}
        </tbody>
      </table>
    `;
  }
}

customElements.define('member-stats', MemberStats);
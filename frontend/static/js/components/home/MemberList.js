import { LitElement, html, css } from 'lit';

class MemberList extends LitElement {

  static properties = {
    members: { type: Array }
  }  
  static styles = css`
    h3 {
      font-size: 1.1rem;
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
  `;

  constructor() {
    super();
    this.members = [{name: "Alice"}, {name: "Bob"}, {name: "Charlie"}];
  }

  render() {
    return html`
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

customElements.define('member-list', MemberList);

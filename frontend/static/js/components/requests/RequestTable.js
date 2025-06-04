import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';

import "../shared/Table.js";

class RequestTable extends LitElement {
  static properties = {
    onCreate: { type: Function },
  };

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
      width: 90%;
    }

    h2 {
      margin-top: 0;
      font-size: 1.2rem;
      text-align: center
    }

    .requests {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 90%;
      height: 100%;
      font-family: sans-serif;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 2rem;
    }
  `;



  constructor() {
    super();
    this.onCreate = null;
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return html`
        <section class="requests">
            <h2>Current Requests<h2>
            <custom-table
                .columns = "${[
                    { key: 'user', header: 'User Name' },
                    { key: 'team', header: 'Team Name' }
                ]}"
            
                .data = "${[
                    { team: 'Team A', user: 'Tev' },
                    { team: 'Team B', user: 'Thups' },
                    { team: 'Team A', user: 'Shen' }
                ]}"

                .actions = "${[
                    { label: "Approve", callback: () => {console.log("approved")} },
                    { label: "Decline", callback: () => {console.log("decline")} },
                ]}"
            >
            </custom-table>
        </section>
    `;
  }
}

customElements.define('request-table', RequestTable);
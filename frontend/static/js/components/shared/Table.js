import { LitElement, html, css } from 'lit';

class CustomTable extends LitElement {
  static properties = {
    columns: { type: Array },
    data: { type: Array },
    actions: { type: Array }
  };

  constructor() {
    super();
    this.columns = [];
    this.data = [];
    this.actions = [];
  }

  static styles = css`
    :host {
      display: block;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      margin: 0.5rem 0;
      font-family: sans-serif;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    thead {
      background-color: #f3f4f6;
    }

    th,
    td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      text-align: left;
    }

    th {
      font-weight: 600;
      color: #333;
      text-transform: uppercase;
      font-size: 0.85rem;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background-color: #fafafa;
    }

    .actions button {
      margin-right: 0.5rem;
      padding: 0.4rem 0.75rem;
      border-radius: 4px;
      background-color: #2e2e2e;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.85rem;
      width: 6rem;
    }

    .actions button:hover {
      background-color: #444;
    }

    .empty {
      text-align: center;
      color: #888;
      padding: 1rem;
      font-style: italic;
    }


    .status-cell.pending {
        color: #f39c12;
        font-weight: 600;
    }

    .status-cell.approved {
        color: #2ecc71;
        font-weight: 600;
    }

    .status-cell.declined {
        color: #e74c3c;
        font-weight: 600;
    }
    
    .btn.cancel{
        background-color: #e74c3c;
        font-weight: 600;
    }
  `;

  createRenderRoot() {
    return this.attachShadow({ mode: 'open' });
  }

  render() {
    return html`
      <style>${CustomTable.styles}</style>
      <table>
        <thead>
          <tr>
            ${this.columns.map(col => html`<th>${col.header}</th>`)}
            ${this.actions.length ? html`<th>Actions</th>` : ''}
          </tr>
        </thead>
        <tbody>
        ${this.data.length
            ? this.data.map(row => html`
                <tr>
                ${this.columns.map(col => html`
                    <td class="${col.key === 'status' ? 'status-cell ' + row[col.key].toLowerCase() : ''}">
                    ${row[col.key]}
                    </td>
                `)}
                ${this.actions.length ? html`
                    <td class="actions">
                    ${this.actions.map(action => html`
                        <button class="${action.label === 'Cancel' ? 'btn ' + action.label.toLowerCase() : ''}"
                         @click=${() => action.callback(row)}>
                        ${action.label}
                        </button>
                    `)}
                    </td>` : ''}
                </tr>
            `)
            : html`<tr><td class="empty" colspan="${colSpan}">No data available</td></tr>`}
        </tbody>
      </table>
    `;
  }
}

customElements.define('custom-table', CustomTable);

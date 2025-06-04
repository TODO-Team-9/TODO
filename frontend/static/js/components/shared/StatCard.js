import { LitElement, html, css } from 'lit';

class StatCard extends LitElement {
  static properties = {
    label: { type: String },
    stat: { type: Number },
  };

  static styles = css`
    .stat-card {
      background: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      min-width: 150px;
      text-align: center;
      flex: 1 1 150px;
    }

    .label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .value {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }

    .backlog { color: #e74c3c; }
    .in.progress { color: #f39c12; } 
    .in.review { color: #2563eb; }
    .done { color: #16a34a; }         
  `;

  constructor() {
    super();
    this.label = '';
    this.stat = '';
  }

  render() {
    return html`
        <section class="stat-card">
            <section class="label">${this.label}</section>
            <section class="value ${this.label.toLowerCase()}">${this.stat}</section>
        </section>
    `;
  }
}

customElements.define('stat-card', StatCard);
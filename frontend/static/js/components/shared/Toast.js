import { LitElement, html, css } from 'lit';

class ToastMessage extends LitElement {
  static properties = {
    message: { type: String },
    visible: { type: Boolean, reflect: true },
    type: { type: String, reflect: true }
  };

  static styles = css`
    :host {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--toast-bg, #2e2e2e);
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: 1000;
    }

    :host([visible]) {
      opacity: 1;
    }

    :host([type="error"]) {
      background-color: #d32f2f;
    }

    :host([type="success"]) {
      background-color: #2e7d32;
    }
  `;

  constructor() {
    super();
    this.message = '';
    this.visible = false;
    this.type = 'success';
  }

  show(message, type = 'success') {
    this.message = message;
    this.type = type;
    this.visible = true;
    this.setAttribute('visible', '');

    setTimeout(() => {
      this.visible = false;
      this.removeAttribute('visible');
    }, 4000);
  }

  render() {
    return html`${this.message}`;
  }
}

customElements.define('toast-message', ToastMessage);
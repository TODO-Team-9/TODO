import { LitElement, html, css } from 'lit';

import './Navigation.js';
import './Header.js';

class MainLayout extends LitElement {
  static properties = {
    title: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      height: 100vh;
      font-family: sans-serif;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .content {
        flex: 1;
        display: flex;
        justify-content: center;
        background-color: #f5f5f5;
        padding: 1rem;
    }
  `;

  constructor() {
    super();
  }

  render() {
    return html`
      <navigation-sidebar></navigation-sidebar>
      <section class="main">
        <app-header .title=${this.title}></app-header>
        <section class="content">
          <slot></slot>
        </section>
      </section>
    `;
  }
}

customElements.define('main-layout', MainLayout);

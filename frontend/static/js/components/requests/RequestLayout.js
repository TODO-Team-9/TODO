import { LitElement, html, css } from 'lit';

import '../shared/Navigation.js';
import './RequestNavigation.js';

class RequestLayout extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: sans-serif;
    }

    nav-bar {
      flex-shrink: 0;
    }

    .page {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .navigation {
        width: 15rem;
        background-color: #f3f3f3;
        padding: 1rem;
        overflow-y: auto;
        box-shadow: inset 0 0 1px rgba(0,0,0,0.1);
    }

    .main {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      background-color: #fdfdfd;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
  `;

  render() {
    return html`
        <nav-bar></nav-bar>
        <section class="page">
            <section class="navigation">
                <request-navigation></request-navigation>
            </section>
            <section class="main">
            <slot></slot>
            </section>
        </section>
    `;
  }
}

customElements.define('request-layout', RequestLayout);

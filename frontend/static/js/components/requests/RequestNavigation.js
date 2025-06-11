import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import teamService from '../../services/TeamService.js';

class RequestNavigation extends LitElement {
    static properties = {
        teams: { type: Array },
        members: { type: Array }
    }

    static styles = css`
        h3 {    
        font-size: 14pt;
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

        select {
            display: block;
            width: 100%;
            padding: 0.5rem;
            text-align: center;
            font-size: 12pt;
            border-radius: 4px;
            border: 1px solid #ccc;
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
            margin-top: 1.5rem;
            margin-bottom: 1.5rem;
        }
    `;

    constructor() {
        super();
    }

    connectedCallback(){
        super.connectedCallback();
    }


    navigate(e) {
        const url = e.currentTarget.dataset.id;
        navigator(url);
    }

    render() {
        return html`
        <section class="controls">
            <button data-id="/requests" @click="${this.navigate}">Team Requests</button>
            <button data-id="/roles" @click="${this.navigate}">Team Roles</button>       
        </section>
        `;
    }
}

customElements.define('request-navigation', RequestNavigation);
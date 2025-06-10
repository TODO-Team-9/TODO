import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import teamService from '../../services/TeamService.js';

import "./Header.js";

class CreateTeam extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      font-family: sans-serif;
      width: 90%;
    }

    h2 {
      margin-top: 0;
      font-size: 14pt;
      text-align: center
    }

    .form-container {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      width: 90%;
      height: 15rem;
      font-family: sans-serif;
      margin-left: auto;
      margin-right: auto;
    }

    form { 
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    input, textarea, button {
      padding: 0.5rem;
      font-size: 12pt;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    button {
      background-color: #2e2e2e;
      color: white;
      border: none;
      cursor: pointer;
    }

    button:hover {
      background-color:rgb(71, 71, 71);
    }
  `;

  static properties = {
    onCreate: { type: Function },
  };

  constructor() {
    super();
    this.onCreate = null;
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if(InputValidator.validate(form.name.value.trim()) || InputValidator.validate(form.description.value.trim())){
        alert("Input not allowed! Contains malicious characters");
        form.reset();
        return;
    }else{
        const team = {
        teamName: form.name.value.trim(),
        teamDescription: form.description.value.trim()
        };
    
        teamService.createTeam(team);
        alert('Team:' + form.name.value.trim() + ' Created');
        form.reset();
    }
  }
  render() {
    return html`
      <team-header .title=${'Create Team'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
      <section class="form-container">
        <form @submit=${this.handleSubmit}>
            <input name="name" placeholder="Name" maxlength="32"  required />
            <textarea name="description" placeholder="Description" maxlength="128" rows="3" required></textarea>
            <button type="submit">Create Team</button>
        </form>
    </section>
    `;
  }
}

customElements.define('create-team', CreateTeam);
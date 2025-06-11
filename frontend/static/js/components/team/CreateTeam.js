import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import { InputValidator } from '../../utils/inputValidator.js';
import teamService from '../../services/TeamService.js';
import DOMPurify from 'dompurify';

import "./Header.js";
import '../shared/Toast.js';

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

    .error {
      color: #d32f2f;
      background-color: #ffebee;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 11pt;
    }

    .success {
      color: #2e7d32;
      background-color: #e8f5e8;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 11pt;
    }
  `;

  static properties = {
    onCreate: { type: Function },
    errorMessage: { type: String },
    successMessage: { type: String }
  };

  constructor() {
    super();
    this.onCreate = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if(InputValidator.validate(form.name.value.trim()) || InputValidator.validate(form.description.value.trim())){
        this.errorMessage = 'Input not allowed!';
        form.reset();
        return;
    }else{
        const team = {
            teamName: DOMPurify.sanitize(form.name.value.trim()),
            teamDescription: DOMPurify.sanitize(form.description.value.trim())
        };

        const response = await teamService.createTeam(team);
        if(response.error){
            this.successMessage = '';
            this.errorMessage = response.error; 
        }else{
            this.errorMessage = '';
            this.successMessage = 'Team created succesfully';
            window.dispatchEvent(new CustomEvent('team-created'));
        }
        form.reset();
    }
  }
  render() {
    return html`
      <team-header .title=${'Create Team'} .buttonCaption=${'Team Board'} .route=${'/home'}></team-header>
      <section class="form-container">
        ${this.errorMessage
        ? html`<section class="error">${this.errorMessage}</section>`
        : ""}
        ${this.successMessage
        ? html`<section class="success">${this.successMessage}</section>`
        : ""}

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
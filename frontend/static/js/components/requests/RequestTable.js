import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import { AuthManager } from '../../utils/auth.js';

import "../shared/Table.js";
import '../shared/Toast.js';

import teamService from '../../services/TeamService.js';


class RequestTable extends LitElement {
    static properties = {
        onCreate: { type: Function },
        teams: { type: Array },
        currentRequests: { type: Array },
        isAccessAdmin: { type: Boolean }
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
        font-size: 14pt;
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

        select {
            width: 100%;
            padding: 0.5rem;
            font-size: 12pt;
            border-radius: 4px;
            border: 1px solid #ccc;
            text-align: center;
        }
    `;



    constructor() {
        super();
        this.onCreate = null;
        this.teams = [];
        this.isAccessAdmin = false;
    }

    connectedCallback(){
        super.connectedCallback();
        this.loadTeams();
        this.loadRequests();
    }

    async loadRequests(){
        this.currentRequests = [];
    }

    async loadTeams() {
        try {
            this.isAccessAdmin = !await AuthManager.isNormalUser();
            const teamLeadTeams = await AuthManager.teamLeadTeams();
            if(await AuthManager.isNormalUser() && teamLeadTeams.length != 0){
                this.teams = Array.isArray(teamLeadTeams) ? teamLeadTeams : [];
            }else if(this.isAccessAdmin){
                const teams = await teamService.getTeams();
                this.teams = Array.isArray(teams) ? teams : [];
            }
        } catch (error) {
            this.teams = [];
        }
    }

    filterPending(requests){
        this.currentRequests = requests.filter((request) => request.request_status === 1).map((request) => ({
            id: request.request_id,
            username: request.username,
            team_name: this.teams.find(team => team.team_id === request.team_id).team_name
        }));
    }

    async getTeamRequests(e){
        const selectedTeamName = e.target.value;

        if(selectedTeamName == 0){
            const requests = await teamService.getAllRequests();
            this.currentRequests = requests.filter((request) => request.status == 'PENDING').map((request) => ({
                id: request.request_id,
                username: request.username,
                team_name: this.teams.find(team => team.team_id === request.team_id).team_name
            }));            
        }else{
            const selectedTeam = this.teams.find(team => team.team_name === selectedTeamName);
            try {
                const requests = await teamService.getTeamRequests(selectedTeam.team_id);
                this.filterPending(requests);
            } catch (error) {
                this.currentRequests = [];
            }
        }
    }

    updateRequest(row, status){
        teamService.updateRequest(row.id, {newStatus: status});
        const updatedStatus = status == 2 ? 'Declined' : 'Approved';
        const toast = this.renderRoot.querySelector('#toast');
        const message = updatedStatus + ' request of ' + row.username + ' to join ' + row.team_name;
        if(status == 2){
            toast.show(message, 'error');
        }else{
            toast.show(message, 'success');
        }
        this.currentRequests = this.currentRequests.filter((request) => request.request_id === row.id);
    }


    render() {
        return html`
            <section class="requests">
                <h2>Current Requests<h2>
                <toast-message id="toast"></toast-message>
                <select @change="${this.getTeamRequests}" name="team" required>
                    <option disabled selected value="">Select Team</option>
                    ${this.isAccessAdmin ? 
                        html`<option value="0">
                                All
                            </option>` : ""
                    }
                    ${this.teams.map(
                        (team) => html`
                            <option value="${team.team_name}">
                                ${team.team_name}
                            </option>
                    `
                    )}
                </select>
                <custom-table
                    .columns = "${[
                        { key: 'username', header: 'User Name' },
                        { key: 'team_name', header: 'Team Name' }
                    ]}"
                
                    .data = "${this.currentRequests}"

                    .actions = "${[
                        { label: "Approve", color: 'green', callback: (row) => this.updateRequest(row, 3) },
                        { label: "Decline", color: 'red', callback: (row) => this.updateRequest(row, 2) },
                    ]}"
                >
                </custom-table>
            </section>
        `;
    }
}

customElements.define('request-table', RequestTable);
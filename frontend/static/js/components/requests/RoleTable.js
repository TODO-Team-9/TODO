import { LitElement, html, css } from 'lit';
import { navigator } from '../../index.js';
import { AuthManager } from '../../utils/auth.js';

import "../shared/Table.js";
import '../shared/Toast.js';

import teamService from '../../services/TeamService.js';


class RoleTable extends LitElement {
    static properties = {
        onCreate: { type: Function },
        teams: { type: Array },
        teamMembers: { type: Array }
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

        .roles {
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
        this.teamMembers = [];
    }

    connectedCallback(){
        super.connectedCallback();
        this.loadTeams();
    }

    async loadMembers(teamId){
        try {
            const members = await teamService.getTeamMembers(teamId);
            this.teamMembers = Array.isArray(members) ? members : [];

            this.teamMembers = members.map((member) => ({
                member_id: member.member_id,
                user_id: member.user_id,
                team_id: member.team_id,
                username: member.username,
                team_name: this.teams.find(team => team.team_id === member.team_id).team_name,
                team_role: member.team_role_id == 1 ? 'Team Lead' : 'TODO User'
            }));
        } catch (error) {
            this.teamMembers = [];
        }        
    }

    async loadTeams() {
        try {
            const teamLeadTeams = await AuthManager.teamLeadTeams();
            if(await AuthManager.isNormalUser() && teamLeadTeams.length != 0){
                this.teams = Array.isArray(teamLeadTeams) ? teamLeadTeams : [];
            }else if(!await AuthManager.isNormalUser()){
                const teams = await teamService.getTeams();
                this.teams = Array.isArray(teams) ? teams : [];
            }
        } catch (error) {
            this.teams = [];
        }
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    async getTeamRoles(e){
        const selectedTeamId = e.target.value;
        const selectedTeam = this.teams.find(team => team.team_id == selectedTeamId);

        await this.loadMembers(selectedTeam.team_id);
    }

    async removeMember(row){
        const response = await teamService.removeMember(row.team_id, row.user_id);  
        const toast = this.renderRoot.querySelector('#toast');
        toast.show(response.message, 'error');
        await this.loadMembers(row.team_id);
    }

    async updateRole(row, newRole){
        const toast = this.renderRoot.querySelector('#toast');
        if(newRole == 1 && row.team_role == 'Team Lead'){
            toast.show('User already a Team Lead', 'error');
            return;
        }

        if(newRole == 2 && row.team_role == 'TODO User'){
            toast.show('User already a TODO User', 'error');
            return;
        }
        
        const body = {
            teamId: row.team_id,
            teamRoleId: newRole
        }
        const response = await teamService.updateMemberRole(row.member_id, body);
        toast.show(response.message, 'success');

        await this.loadMembers(row.team_id);
    }

    render() {
        return html`
            <section class="roles">
                <h2>Team Roles<h2>
                <toast-message id="toast"></toast-message>
                <select @change="${this.getTeamRoles}" name="team" required>
                    <option disabled selected value="">Select Team</option>
                    ${this.teams.map(
                        (team) => html`
                            <option value="${team.team_id}">
                                ${team.team_name}
                            </option>
                    `
                    )}
                </select>
                <custom-table
                    .columns = "${[
                        { key: 'username', header: 'User Name' },
                        { key: 'team_name', header: 'Team Name' },
                        { key: 'team_role', header: 'Team Role' }
                    ]}"
                
                    .data = "${this.teamMembers}"

                    .actions = "${[
                        { label: "Promote", color: 'green', callback: (row) => this.updateRole(row, 1) },
                        { label: "Demote", color: 'orange', callback: (row) => this.updateRole(row, 2) },
                        { label: "Remove", color: 'red', callback: (row) => this.removeMember(row) }
                    ]}"
                >
                </custom-table>
            </section>
        `;
    }
}

customElements.define('role-table', RoleTable);
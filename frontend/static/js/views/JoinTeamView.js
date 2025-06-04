import AbstractView from "./AbstractView.js";
import "../components/team/JoinTeam.js";
import "../components/team/TeamLayout.js";

export default class JoinTeamView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Team");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const joinTeam = document.createElement('join-team');
        layout.title = "Join Team";
        layout.appendChild(joinTeam);
        return layout;
    }

    async mount() {}
}
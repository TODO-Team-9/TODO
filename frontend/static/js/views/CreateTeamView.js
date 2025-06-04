import AbstractView from "./AbstractView.js";
import "../components/team/CreateTeam.js";
import "../components/team/TeamLayout.js";

export default class CreateTeamView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Team");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const createTeam = document.createElement('create-team');
        layout.title = "Create Team";
        layout.appendChild(createTeam);
        return layout;
    }

    async mount() {}
}
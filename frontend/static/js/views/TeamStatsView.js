import AbstractView from "./AbstractView.js";
import "../components/team/TeamStats.js";
import "../components/team/TeamLayout.js";

export default class TeamStatsView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Team Stats");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const stats = document.createElement('team-stats');
        layout.title = "Team Statistics";
        layout.appendChild(stats);
        return layout;
    }

    async mount() {}
}
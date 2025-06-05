import AbstractView from "./AbstractView.js";
import "../components/team/TodoBoard.js";
import "../components/team/TeamLayout.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const todoBoard = document.createElement('todo-board');
        todoBoard.teamName = "Team One Project Board";
        layout.appendChild(todoBoard);
        return layout;
    }

    async mount() {}
}
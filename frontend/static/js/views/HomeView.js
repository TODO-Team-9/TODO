import AbstractView from "./AbstractView.js";
import "../components/home/TodoBoard.js";
import "../components/shared/MainLayout.js";
// import "../components/shared/Navigation.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const layout = document.createElement('main-layout');
        const todoBoard = document.createElement('todo-board');
        todoBoard.teamName = "Team One Project Board";
        layout.appendChild(todoBoard);
        return layout;
    }

    async mount() {}
}
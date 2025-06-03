import AbstractView from "./AbstractView.js";
import "../components/home/TodoBoard.js";
import "../components/shared/Header.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const content = document.createElement('section');
        const header = document.createElement('app-header');
        header.title = "Team One Board";
        content.appendChild(header);

        const todoBoard = document.createElement('todo-board');
        content.appendChild(todoBoard);
        return content;
    }

    async mount() {}
}
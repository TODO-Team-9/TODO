import AbstractView from "./AbstractView.js";
import "../components/home/TodoBoard.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const todoBoard = document.createElement('todo-board');
        return todoBoard;
    }

    async mount() {}
}
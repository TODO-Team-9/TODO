import AbstractView from "./AbstractView.js";
import "../components/home/TodoBoard.js";
import "../components/shared/Header.js";
import "../components/shared/Navigation.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const contentContainer = document.createElement('section');
        contentContainer.classList.add('content-container');

        const navigation = document.createElement('navigation-sidebar');
        contentContainer.appendChild(navigation);

        const content = document.createElement('section');
        content.classList.add('content');
        
        const header = document.createElement('app-header');
        header.title = "Team One Board";
        content.appendChild(header);

        const todoBoard = document.createElement('todo-board');
        content.appendChild(todoBoard);

        contentContainer.appendChild(content);
        return contentContainer;
    }

    async mount() {}
}
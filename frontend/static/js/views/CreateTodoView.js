import AbstractView from "./AbstractView.js";
import "../components/team/CreateTodo.js";
import "../components/team/TeamLayout.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Create Todo");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const createTodo = document.createElement('create-todo');
        layout.title = "Create Todo";
        layout.appendChild(createTodo);
        return layout;
    }

    async mount() {}
}
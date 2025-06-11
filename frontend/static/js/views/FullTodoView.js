import AbstractView from "./AbstractView.js";
import "../components/team/FullTodo.js";
import "../components/team/TeamLayout.js";

export default class FullTodoView extends AbstractView {
    constructor() {
        super();
        this.setTitle("View Todo");
    }

    async getHtml() {
        const layout = document.createElement('team-layout');
        const todo = document.createElement('full-todo');
        console.log(todo);
        layout.appendChild(todo);
        return layout;
    }

    async mount() {}
}
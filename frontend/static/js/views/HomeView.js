import AbstractView from "./AbstractView.js";
import { TaskCard } from "../components/home/TaskCard.js";

export default class HomeView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Home");
    }

    async getHtml() {
        const taskCard = document.createElement('task-card');
        return taskCard;
    }

    async mount() {}
}
import AbstractView from "./AbstractView.js";
import "../components/requests/RequestTable.js";
import "../components/requests/RequestLayout.js";

export default class RequestView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Requests");
    }

    async getHtml() {
        const layout = document.createElement('request-layout');
        const table = document.createElement('request-table');
        layout.appendChild(table);
        return layout;
    }

    async mount() {}
}
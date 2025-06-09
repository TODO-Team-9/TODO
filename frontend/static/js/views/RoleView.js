import AbstractView from "./AbstractView.js";
import "../components/requests/RoleTable.js";
import "../components/requests/RequestLayout.js";

export default class RoleView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Roles");
    }

    async getHtml() {
        const layout = document.createElement('request-layout');
        const table = document.createElement('role-table');
        layout.appendChild(table);
        return layout;
    }

    async mount() {}
}
import AbstractView from "./AbstractView.js";
import "../components/auth/Login.js";

export default class LoginView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Login");
    }

    async getHtml() {
        const login = document.createElement('login-form');
        return login;
    }

    async mount() {}
}
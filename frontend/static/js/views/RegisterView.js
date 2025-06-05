import AbstractView from "./AbstractView.js";
import "../components/auth/Register.js";

export default class RegisterView extends AbstractView {
    constructor() {
        super();
        this.setTitle("Register");
    }

    async getHtml() {
        const register = document.createElement('register-form');
        return register;
    }

    async mount() {}
}
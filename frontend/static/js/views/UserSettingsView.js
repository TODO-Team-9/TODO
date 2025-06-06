import AbstractView from "./AbstractView.js";
import "../components/settings/UserSettings.js";
import "../components/requests/RequestLayout.js";

export default class UserSettingsView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Account Settings");
  }
  async getHtml() {
    const layout = document.createElement("request-layout");
    const userSettings = document.createElement("user-settings");
    layout.appendChild(userSettings);
    return layout;
  }

  mount() {}
}

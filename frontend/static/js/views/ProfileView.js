import AbstractView from "./AbstractView.js";
import "../components/profile/UserProfile.js";
import "../components/requests/RequestLayout.js";

export default class ProfileView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("My Profile");
  }

  async getHtml() {
    const layout = document.createElement("request-layout");
    const userProfile = document.createElement("user-profile");
    layout.appendChild(userProfile);
    return layout;
  }

  mount() {}
}

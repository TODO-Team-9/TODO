import AbstractView from "./AbstractView.js";
import "../components/auth/TwoFactorSetup.js";

export default class TwoFactorSetupView extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Setup Two-Factor Authentication");
  }
  async getHtml() {
    const container = document.createElement("div");
    container.id = "two-factor-setup-container";
    const twoFactorSetup = document.createElement("two-factor-setup");
    container.appendChild(twoFactorSetup);
    return container;
  }

  mount() {
    // Component is imported at the top of the file
  }
}

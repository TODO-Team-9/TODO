import { navigator } from "../index.js";
import userService from "./UserService.js";

class AuthService {
  isAuthenticated() {
    return true;
  }

  hasUsername() {
    return this.user && !!this.user.username;
  }



  getAuthHeaders() {
    this.token = "To be implemented";
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }
}

const authService = new AuthService();
export default authService;

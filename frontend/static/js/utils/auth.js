import userService from "../services/UserService";

// Authentication utility functions
export class AuthManager {
  static getToken() {
    return localStorage.getItem("authToken");
  }

  static async isNormalUser(){
    const response = await userService.getUser(JSON.parse(localStorage.getItem('user')).user_id);
    const user = response.user;

    if(user && user.system_role_id === 2){
        return true;
    }else{
        return false;
    }
  }

  static async teamLeadTeams(){
    const response = await userService.getUserTeams(JSON.parse(localStorage.getItem('user')).user_id);
    const teamLeadTeams = response.filter((team) => team.team_role_id === 1).map((team) => ({
        team_id: team.team_id,
        team_name: team.team_name
    }));

    return teamLeadTeams;
  }

  static getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  static isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return (
        payload.exp * 1000 > Date.now() && payload.twoFactorVerified === true
      );
    } catch (error) {
      return false;
    }
  }

  static hasProvisionalToken() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now() && !payload.twoFactorVerified;
    } catch (error) {
      console.warn("Token validation error:", error);
      return false;
    }
  }

  static logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  static async makeAuthenticatedRequest(url, options = {}) {
    const token = this.getToken();

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);

      if (response.status === 401) {
        // Token expired or invalid
        this.logout();
        return null;
      }

      return response;
    } catch (error) {
      console.error("Authenticated request failed:", error);
      throw error;
    }
  }
}

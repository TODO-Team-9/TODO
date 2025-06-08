import { navigator } from "../index.js";
// import { Message, Http, Storage } from "../enums/index.js";

class AuthService {
//   constructor() {
//     this.token = localStorage.getItem(Storage.Key.Auth.TOKEN);
//     this.user = JSON.parse(localStorage.getItem(Storage.Key.Auth.USER) || "null");
//   }

  isAuthenticated() {
    // return !!this.token;
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

//   getUser() {
//     return this.user;
//   }

//   async setUsername(username) {
//     try {
//       const response = await fetch(Http.Api.Auth.SET_USERNAME, {
//         method: "PUT",
//         headers: this.getAuthHeaders(),
//         body: JSON.stringify({ username }),
//       });

//       if (!response.ok) {
//         throw new Error(Message.Error.Auth.FAILED_USERNAME);
//       }

//       const user = await response.json();
//       this.user = user;
//       localStorage.setItem(Storage.Key.Auth.USER, JSON.stringify(user));

//       return user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async refreshUserData() {
//     if (!this.token) return Promise.reject(Message.Error.Auth.NOT_AUTHENTICATED);

//     try {
//       const response = await fetch(Http.Api.Auth.GET_USER, {
//         headers: this.getAuthHeaders(),
//       });

//       if (!response.ok) {
//         if (response.status === Http.Status.UNAUTHORIZED) {
//           this.logout();
//           return Promise.reject(Message.Error.Auth.SESSION_EXPIRED);
//         }
//         throw new Error(Message.Error.Auth.FAILED_USER_DATA);
//       }

//       const user = await response.json();
//       this.user = user;
//       localStorage.setItem(Storage.Key.Auth.USER, JSON.stringify(user));

//       return user;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async checkAuthentication() {
//     if (!this.token) {
//       return false;
//     }

//     try {
//       await this.refreshUserData();
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

}

const authService = new AuthService();
export default authService;

import apiService from './ApiRequestService.js';

class UserService {
    async getUser(userId) {
        return apiService.get(`/users/${userId}`);
    }

    async getUserTeams(userId) {
        return apiService.get(`/users/${userId}/teams`);
    }
}

const userService = new UserService();
export default userService;
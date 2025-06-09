import apiService from './ApiRequestService.js';

class UserService {
    async getUser(userId) {
        return apiService.get(`/users/${userId}`);
    }
}

const userService = new UserService();
export default userService;
import apiService from './ApiRequestService.js';

class TeamService {
    async createTeam() {
        return apiService.post();
    }

    async getTeamMembers() {
        return apiService.get();
    }

    async assignTeamMember() {
        return apiService.get();
    }

    async getTeamTodos() {
        return apiService.get();
    }
}

const categoryService = new CategoryService();
export default categoryService;
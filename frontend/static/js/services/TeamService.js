import apiService from './ApiRequestService.js';

class TeamService {
    async createTeam(data) {
        return apiService.post(`http://localhost:3000/api/teams`, data);
    }

    async getTeams() {
        return apiService.get(`http://localhost:3000/api/teams`);
    }

    async getTeam(teamId) {
        return apiService.get(`http://localhost:3000/api/teams/${teamId}`);
    }

    async getTeamMembers(teamId) {
        return apiService.get(`http://localhost:3000/api/teams/${teamId}/members`);
    }

    // async assignTeamMember() {
    //     return apiService.get();
    // }

    // async getTeamTodos() {
    //     return apiService.get();
    // }
}

const teamService = new TeamService();
export default teamService;
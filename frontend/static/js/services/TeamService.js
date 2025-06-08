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

    async requestTeam(data){
        return apiService.post(`http://localhost:3000/api/join`, data);
    }

    async getTeamRequests(teamId){
        return apiService.get(`http://localhost:3000/api/join/teams/${teamId}`);
    }

    async updateRequest(requestId, data) {
        return apiService.post(`http://localhost:3000/api/join/${requestId}/status`, data);
    }
}

const teamService = new TeamService();
export default teamService;
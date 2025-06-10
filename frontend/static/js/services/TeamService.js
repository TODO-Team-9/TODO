import apiService from './ApiRequestService.js';

class TeamService {
    async createTeam(data) {
        return apiService.post(`/teams`, data);
    }

    async getTeams() {
        return apiService.get(`/teams`);
    }

    async getUserTeams(userId) {
        return apiService.get(`/users/${userId}/teams`);
    }

    async getTeam(teamId) {
        return apiService.get(`/teams/${teamId}`);
    }

    async getTeamMembers(teamId) {
        return apiService.get(`/teams/${teamId}/members`);
    }

    async requestTeam(data){
        return apiService.post(`/join-requests`, data);
    }

    async getTeamRequests(teamId){
        return apiService.get(`/join-requests/teams/${teamId}`);
    }

    async getAllRequests(){
        return apiService.get(`/join-requests`);
    }

    async updateRequest(requestId, data) {
        return apiService.post(`/join-requests/${requestId}/status`, data);
    }

    async updateMemberRole(memberId, data) {
        return apiService.post(`/members/${memberId}/updateRole`, data);
    }

    async removeMember(teamId, userId) {
        return apiService.delete(`/teams/${teamId}/members/${userId}`);
    }

    async getTeamStats(teamId,startDate, endDate){
        return apiService.get(`/reports/teams/${teamId}/stats?startDate=${startDate}&endDate=${endDate}`);
    }

    async getTeamActivity(teamId,startDate, endDate){
        return apiService.get(`/reports/teams/${teamId}/stats?startDate=${startDate}&endDate=${endDate}`);
    }
}

const teamService = new TeamService();
export default teamService;
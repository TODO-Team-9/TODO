import apiService from './ApiRequestService.js';

class TodoService {
    async createTodo(data){
        return apiService.post(`/tasks`, data);
    }

    async updateStatus(taskId, data) {
        return apiService.post(`/tasks/${taskId}/status`, data);
    }

    async getMemberTodos(memberName) {
        return apiService.post();
    }

    async getStatuses() {
        return apiService.get(`/statuses`);
    }

    async getTeamTodos(teamId) {
        return apiService.get(`/tasks/teams/${teamId}`);
    }

    async assignTodo(taskId, data) {
        return apiService.post();
    }
}

const todoService = new TodoService();
export default todoService;
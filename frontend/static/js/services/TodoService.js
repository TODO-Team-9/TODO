import apiService from './ApiRequestService.js';

class TodoService {
    async createTodo(data){
        return apiService.post(`http://localhost:3000/api/tasks`, data);
    }

    async updateStatus(taskId, data) {
        return apiService.post(`http://localhost:3000/api/tasks/${taskId}/status`, data);
    }

    async getMemberTodos(memberName) {
        return apiService.post();
    }

    async getStatuses() {
        return apiService.get(`http://localhost:3000/api/statuses`);
    }

    async getTeamTodos(teamId) {
        return apiService.get(`http://localhost:3000/api/tasks/teams/${teamId}`);
    }

    async assignTodo(taskId, data) {
        return apiService.post();
    }
}

const todoService = new TodoService();
export default todoService;
import apiService from './ApiRequestService.js';

class TodoService {
    async createTodo(data){
        return apiService.post(`http://localhost:3000/api/tasks`, data);
    }

    async updateStatus(taskId, data) {
        return apiService.post();
    }

    async getTodos(memberName) {
        return apiService.post();
    }

    async assignTodo(taskId, data) {
        return apiService.post();
    }
}

const todoService = new TodoService();
export default todoService;
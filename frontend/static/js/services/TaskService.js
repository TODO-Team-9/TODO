import apiService from './ApiRequestService.js';

class Taskervice {
    async updateStatus(taskId, data) {
        return apiService.get(`/api/tasks/${taskId}`, data);
    }
}

const taskService = new Taskervice();
export default taskService;
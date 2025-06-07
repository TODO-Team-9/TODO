import apiService from './ApiRequestService.js';

class TeamService {
    async getAllCategories(page = 1, limit = 4) {
        return apiService.get(`/api/categories/list?page=${page}&limit=${limit}`);
    }
}

const categoryService = new CategoryService();
export default categoryService;
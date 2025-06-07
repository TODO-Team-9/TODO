import authService from './AuthService.js';

class ApiService {
    async request(url, options = {}) {
        try {
            if (authService.isAuthenticated()) {
                options.headers = {
                    ...options.headers,
                    ...authService.getAuthHeaders()
                };
            } else if (!options.headers) {
                options.headers = {
                    'Content-Type': 'application/json'
                };
            }
            
            const response = await fetch(url, options);
            
            if (response.status === 401 && authService.isAuthenticated()) {
                authService.logout();
                throw new Error('Your session has expired. Please login again.');
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    get(url) {
        return this.request(url);
    }

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }
}

const apiService = new ApiService();
export default apiService;
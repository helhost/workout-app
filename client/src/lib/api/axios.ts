import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Create base axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    withCredentials: true, // Required for cookies to be sent/received
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for CSRF token
api.interceptors.request.use((config) => {
    // Add CSRF token to non-GET requests
    if (config.method !== 'get') {
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
        if (csrfCookie) {
            const csrfToken = csrfCookie.split('=')[1];
            config.headers['X-XSRF-TOKEN'] = csrfToken;
        }
    }
    return config;
});

// Add response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                await api.post('/auth/refresh');

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
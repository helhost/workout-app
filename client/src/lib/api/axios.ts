import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Create base axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    withCredentials: true, // Important for CORS with cookies
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
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for handling token refresh
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;
let refreshFailure = false;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet and not already refreshing
        if (error.response?.status === 401 && !originalRequest._retry && !refreshFailure) {
            // Only try to refresh if we're not already doing so
            if (!isRefreshing) {
                isRefreshing = true;
                refreshPromise = api.post('/auth/refresh')
                    .then(response => {
                        isRefreshing = false;
                        refreshFailure = false;
                        return response;
                    })
                    .catch(refreshError => {
                        console.error('Token refresh failed:', refreshError);
                        isRefreshing = false;
                        refreshFailure = true;

                        // If we're on a login or register page, don't redirect
                        const currentPath = window.location.pathname;
                        if (!/^\/(login|register)/.test(currentPath)) {
                            // If refresh fails and we're not on login page, redirect to login
                            window.location.href = '/login';
                        }

                        return Promise.reject(refreshError);
                    });
            }

            try {
                originalRequest._retry = true;

                // Wait for the refresh to complete
                await refreshPromise;

                // If refresh was successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh failed, we already handled the redirect in the catch above
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
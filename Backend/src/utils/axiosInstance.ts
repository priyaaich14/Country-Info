import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REST_COUNTRIES_API, // Fetch from .env
    timeout: 10000, // Set a timeout for requests
});
// Optional: Add interceptors for centralized logging/error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;

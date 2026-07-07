import axios from 'axios';

// This instance talks to your Next.js backend
const api = axios.create({
    baseURL: '/api', // Points to your Next.js app/api folder
    headers: {
        'Content-Type': 'application/json',
    },
});

// You can easily add interceptors here later if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;
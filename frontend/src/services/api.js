import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Send user message to backend
export const sendMessage = (message) => {
  return api.post('/api/chat', {
    message
  });
};

export default api;
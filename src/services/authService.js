import api from '../lib/apiClient';

export const authService = {
  login: async (mobile_no) => {
    const { data } = await api.post('/auth/login', { mobile_no });
    return data;
  },
  
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  verifyGST: async (gst_no) => {
    const { data } = await api.post('/auth/verify-gst', { gst_no });
    return data;
  }
};
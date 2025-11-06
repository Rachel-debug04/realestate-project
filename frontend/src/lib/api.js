import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Profile API
export const profileAPI = {
  get: async () => {
    const response = await axios.get(`${API}/profile`);
    return response.data;
  },
  update: async (data) => {
    const response = await axios.put(`${API}/profile`, data);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  upload: async (file, docType) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API}/documents/upload?doc_type=${docType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  getAll: async () => {
    const response = await axios.get(`${API}/documents`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (message, sessionId = null, usePrimary = true) => {
    const response = await axios.post(`${API}/chat/message`, {
      message,
      session_id: sessionId,
      use_primary: usePrimary,
    });
    return response.data;
  },
  getHistory: async (sessionId) => {
    const response = await axios.get(`${API}/chat/history/${sessionId}`);
    return response.data;
  },
};

// Pre-Qualification API
export const prequalAPI = {
  calculate: async (data) => {
    const response = await axios.post(`${API}/prequal/calculate`, data);
    return response.data;
  },
  getHistory: async () => {
    const response = await axios.get(`${API}/prequal/history`);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/products`);
    return response.data;
  },
};

// Applications API
export const applicationsAPI = {
  create: async (data) => {
    const response = await axios.post(`${API}/applications`, data);
    return response.data;
  },
  getAll: async () => {
    const response = await axios.get(`${API}/applications`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API}/applications/${id}`);
    return response.data;
  },
  submit: async (id) => {
    const response = await axios.put(`${API}/applications/${id}/submit`);
    return response.data;
  },
};
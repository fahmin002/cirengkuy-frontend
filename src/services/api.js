const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
      }
      return await response.json();

    } catch (err) {
      console.error('API GET error:', err);
      throw err;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
      }
      return await response.json();

    } catch (err) {
      console.error('API POST error:', err);
      throw err;
    }
  },
  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API PUT error:', err);
      throw err;
    }
  },
  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API DELETE error:', err);
      throw err;
    }
  },
};

export default api;
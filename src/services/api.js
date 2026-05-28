const backendUrl = "https://paso-remarkable-updating-queue.trycloudflare.com"
const API_BASE_URL =
  backendUrl + "/api" || "http://192.168.1.5:5000/api";

const request = async (endpoint, options = {}) => {
  try {
    const isFormData = options.body instanceof FormData;
    const token = localStorage.getItem("token");

    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // 🔥 handle unauthorized (auto logout)
    if (response.status === 401) {
      localStorage.removeItem("token");
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (err) {
    // console.error("API error:", err.message);
    throw err;
  }
};

const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE",
    }),
};

export { api };

// import axios from 'axios';

// export const api = axios.create({
//   baseURL: 'http://192.168.1.5:5000/api',
//   withCredentials: true // jaga-jaga nanti pakai auth
// });

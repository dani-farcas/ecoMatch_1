// 📁 src/api/axios.ts

import axios from 'axios';

// 🌍 Basis-URL aus .env
const baseURL = import.meta.env.VITE_API_URL;

// 🛠️ Eigene Axios-Instanz erstellen
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // ⚠️ Nur wenn Cookies verwendet werden
});

// 🔐 Interceptor zum Anhängen des Access Tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Interceptor zur Behandlung von 401 → AccessToken automatisch erneuern
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ 401 → AccessToken ist abgelaufen, prüfen ob RefreshToken vorhanden ist
    if (
      error.response?.status === 401 &&
      error.response.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) throw new Error('Kein RefreshToken vorhanden');

        // 🆕 Versuche, neues AccessToken vom Server zu erhalten
        const res = await axios.post(`${baseURL}token/refresh/`, { refresh });

        const newAccess = res.data.access;
        localStorage.setItem('accessToken', newAccess);

        // 🔄 Füge neues AccessToken dem ursprünglichen Request hinzu
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return api(originalRequest); // 🔁 Wiederhole Anfrage
      } catch (refreshError) {
        // ❌ Refresh fehlgeschlagen → Logout und zurück zum Login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// 📁 src/api/axios.ts
// 🌍 Zentrale Axios-Instanz mit JWT-Interceptors für Access- & Refresh-Token

import axios, { AxiosRequestConfig } from "axios";

// Basis-URL aus .env (Fallback: http://localhost:8000/api/)
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";

// Sicherstellen, dass baseURL mit '/' endet
if (!baseURL.endsWith("/")) {
  baseURL += "/";
}

// Erweiterung für AxiosRequestConfig, damit wir "_retry" setzen können
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Eigene Axios-Instanz erstellen
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// 🔐 Request-Interceptor: setzt automatisch den Authorization-Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response-Interceptor: Access-Token bei Ablauf automatisch erneuern
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) throw new Error("Kein Refresh-Token vorhanden");

        // Wichtig: axios.post direkt, nicht über api (um Endlosschleifen zu vermeiden)
        const res = await axios.post(`${baseURL}token/refresh/`, { refresh });

        const newAccess = res.data?.access;
        if (!newAccess) throw new Error("Kein neues Access-Token erhalten");

        // Neues Access-Token speichern
        localStorage.setItem("access", newAccess);

        // Header der Original-Anfrage aktualisieren
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        }

        // Anfrage erneut senden mit aktualisiertem Token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh-Token ungültig oder Fehler → Logout erzwingen
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

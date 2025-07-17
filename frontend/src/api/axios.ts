// 📁 src/api/axios.ts

import axios from "axios";

// 🌍 Basis-URL aus .env (z.B. http://localhost:8000/api/)
let baseURL = import.meta.env.VITE_API_URL || "http://localhost/api/";

// Sicherstellen, dass baseURL mit '/' endet
if (!baseURL.endsWith("/")) {
  baseURL += "/";
}

// 🛠️ Eigene Axios-Instanz erstellen
const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Keine Cookies versenden
});

// 🔐 Request-Interceptor: Authorization Header hinzufügen, falls Token vorhanden
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response-Interceptor: Token bei 401 automatisch erneuern
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prüfen, ob 401 wegen ungültigem Token und ob Retry noch nicht versucht
    if (
      error.response?.status === 401 &&
      error.response.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) throw new Error("Kein Refresh-Token vorhanden");

        // Refresh-Token an API senden, um neuen Access-Token zu erhalten
        const res = await axios.post(`${baseURL}token/refresh/`, { refresh });
        const newAccess = res.data.access;

        // Neuen Access-Token speichern
        localStorage.setItem("accessToken", newAccess);

        // Originalanfrage mit neuem Token erneut senden
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh-Token ungültig: Tokens löschen und zum Login weiterleiten
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

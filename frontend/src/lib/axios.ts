import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:4000/api"
          }/auth/refresh`,
          { refreshToken }
        );

        const { accessToken } = response.data.data;
        useAuthStore.getState().setTokens(accessToken, refreshToken!);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    const message = error.response?.data?.message || "An error occurred";
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;

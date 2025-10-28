/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/api.ts
import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for httpOnly cookies
});

// Helper to get token from cookies (client-side only)
const getTokenFromCookies = (): string | null => {
  if (typeof window === "undefined") return null;
  const name = "accessToken=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split("; ");
  const tokenCookie = ca.find((row) => row.startsWith(name));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Try Zustand first (for UI state)
    let token = useAuthStore.getState().accessToken;

    // Fallback: try reading from httpOnly cookie (if Zustand not synced)
    if (!token) {
      token = getTokenFromCookies();
    }

    // Fallback: localStorage (dev/demo)
    if (!token) {
      token = localStorage.getItem("accessToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          useAuthStore.getState().refreshToken ||
          localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        // Update Zustand
        useAuthStore.getState().setTokens(accessToken, refreshToken);

        // Update localStorage (fallback)
        localStorage.setItem("accessToken", accessToken);

        // Update header and retry
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError: any) {
        // Force logout
        useAuthStore.getState().logout();
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear cookies via API
        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {}

        toast.error("Session expired. Please log in again.");
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

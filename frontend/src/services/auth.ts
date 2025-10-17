import api from "@/lib/axios";
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from "@/types";

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      credentials
    );
    return response.data.data!;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      data
    );
    return response.data.data!;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data.data!;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post<ApiResponse>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse>("/auth/profile");
    return response.data.data;
  },
};

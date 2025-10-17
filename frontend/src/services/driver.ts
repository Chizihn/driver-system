import api from "@/lib/axios";
import type { Driver, ApiResponse } from "@/types";

export const driverService = {
  getAllDrivers: async (page = 1, limit = 20) => {
    const response = await api.get<ApiResponse<Driver[]>>("/drivers", {
      params: { page, limit },
    });
    return response.data;
  },

  getDriverById: async (id: string) => {
    const response = await api.get<ApiResponse<Driver>>(`/drivers/${id}`);
    return response.data.data!;
  },

  searchDrivers: async (query: string) => {
    const response = await api.get<ApiResponse<Driver[]>>("/drivers/search", {
      params: { q: query },
    });
    return response.data.data!;
  },

  createDriver: async (data: Partial<Driver>) => {
    const response = await api.post<ApiResponse<Driver>>("/drivers", data);
    return response.data.data!;
  },

  updateDriver: async (id: string, data: Partial<Driver>) => {
    const response = await api.put<ApiResponse<Driver>>(`/drivers/${id}`, data);
    return response.data.data!;
  },

  deactivateDriver: async (id: string) => {
    const response = await api.delete<ApiResponse<Driver>>(
      `/drivers/${id}/deactivate`
    );
    return response.data.data!;
  },
};

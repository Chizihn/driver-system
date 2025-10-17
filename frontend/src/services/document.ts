import api from "@/lib/axios";
import type { Document, ApiResponse, DocumentStatus } from "@/types";

export const documentService = {
  getDocumentById: async (id: string) => {
    const response = await api.get<ApiResponse<Document>>(`/documents/${id}`);
    return response.data.data!;
  },

  getDocumentByNumber: async (documentNumber: string) => {
    const response = await api.get<ApiResponse<Document>>(
      `/documents/number/${documentNumber}`
    );
    return response.data.data!;
  },

  getDriverDocuments: async (driverId: string) => {
    const response = await api.get<ApiResponse<Document[]>>(
      `/documents/driver/${driverId}`
    );
    return response.data.data!;
  },

  createDocument: async (data: Partial<Document>) => {
    const response = await api.post<ApiResponse<Document>>("/documents", data);
    return response.data.data!;
  },

  updateDocument: async (id: string, data: Partial<Document>) => {
    const response = await api.put<ApiResponse<Document>>(
      `/documents/${id}`,
      data
    );
    return response.data.data!;
  },

  updateDocumentStatus: async (id: string, status: DocumentStatus) => {
    const response = await api.patch<ApiResponse<Document>>(
      `/documents/${id}/status`,
      { status }
    );
    return response.data.data!;
  },

  getExpiringSoon: async (days = 30) => {
    const response = await api.get<ApiResponse<Document[]>>(
      "/documents/expiring",
      {
        params: { days },
      }
    );
    return response.data.data!;
  },
};

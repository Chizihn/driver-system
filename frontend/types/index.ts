/* eslint-disable @typescript-eslint/no-explicit-any */
export enum UserRole {
  ADMIN = "ADMIN",
  OFFICER = "OFFICER",
}

export enum DocumentType {
  LICENSE = "LICENSE",
  INSURANCE = "INSURANCE",
  REGISTRATION = "REGISTRATION",
}

export enum DocumentStatus {
  VALID = "VALID",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
  REVOKED = "REVOKED",
}

export enum VerificationResult {
  VALID = "VALID",
  INVALID = "INVALID",
  EXPIRED = "EXPIRED",
  FORGED = "FORGED",
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  badgeNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  phoneNumber: string;
  email?: string;
  address: string;
  stateOfOrigin: string;
  lga: string;
  nationality: string;
  photo?: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  documents?: Document[];
  verificationLogs?: VerificationLog[];
}

export interface Document {
  id: string;
  driverId: string;
  type: DocumentType;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: DocumentStatus;
  fileUrl?: string;
  qrCode: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  driver?: Driver;
}

export interface VerificationLog {
  id: string;
  officerId: string;
  driverId: string;
  documentId?: string;
  result: VerificationResult;
  location?: string;
  notes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  officer?: Partial<User>;
  driver?: Partial<Driver>;
  document?: Partial<Document>;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  badgeNumber?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  totalDrivers: number;
  totalDocuments: number;
  totalVerifications: number;
  recentVerifications: VerificationLog[];
  expiringDocuments?: Document[];
  verificationsByResult?: Record<string, number>;
}

export interface VerificationRequest {
  driverId?: string;
  documentNumber?: string;
  qrCodeData?: string;
  location?: string;
  notes?: string;
}

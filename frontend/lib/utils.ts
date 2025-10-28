import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { DocumentStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: string | Date,
  formatStr: string = "PP"
): string {
  return format(new Date(date), formatStr);
}

export function calculateAge(birthDate: string | Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

export function getStatusColor(status: DocumentStatus): string {
  switch (status) {
    case DocumentStatus.VALID:
      return "bg-green-100 text-green-800";
    case DocumentStatus.EXPIRED:
      return "bg-red-100 text-red-800";
    case DocumentStatus.SUSPENDED:
      return "bg-yellow-100 text-yellow-800";
    case DocumentStatus.REVOKED:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusText(status: DocumentStatus): string {
  switch (status) {
    case DocumentStatus.VALID:
      return "Valid";
    case DocumentStatus.EXPIRED:
      return "Expired";
    case DocumentStatus.SUSPENDED:
      return "Suspended";
    case DocumentStatus.REVOKED:
      return "Revoked";
    default:
      return "Unknown";
  }
}

"use client";

import Image from "next/image";
import { type Driver, type Document, DocumentType } from "@/types";
import {
  calculateAge,
  formatDate,
  getStatusColor,
  getStatusText,
} from "@/lib/utils";
import {
  User,
  Calendar,
  Phone,
  MapPin,
  FileText,
  Shield,
  Car,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

interface DriverIDCardProps {
  driver: Driver;
  documents?: Document[];
}

export default function DriverIDCard({ driver, documents }: DriverIDCardProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  /* ---------- QR-code generation (client side) ---------- */
  useEffect(() => {
    if (driver.qrCode) {
      QRCode.toDataURL(driver.qrCode, { width: 120, margin: 1 })
        .then(setQrCodeUrl)
        .catch((err) => {
          console.error("QR Code generation failed:", err);
          setQrCodeUrl("");
        });
    }
  }, [driver.qrCode]);

  /* ---------- Find documents ---------- */
  const license = documents?.find((d) => d.type === DocumentType.LICENSE);
  const insurance = documents?.find((d) => d.type === DocumentType.INSURANCE);
  const registration = documents?.find(
    (d) => d.type === DocumentType.REGISTRATION
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* ==== ID Card Front ==== */}
      <div className="bg-gradient-to-br from-government-green to-green-800 rounded-xl shadow-2xl p-8 text-white mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">
              Federal Republic of Nigeria
            </h2>
            <p className="text-green-100 text-sm">Driver Identification Card</p>
          </div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-government-green font-bold text-2xl">NG</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* ---- Photo + QR ---- */}
          <div className="col-span-1 space-y-3">
            {/* Driver Photo – next/image */}
            <div className="bg-white rounded-lg p-2">
              {driver.photo ? (
                <div className="relative w-full h-48">
                  <Image
                    src={driver.photo}
                    alt={`${driver.firstName} ${driver.lastName}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>

            {/* QR Code – next/image (data URL) */}
            {qrCodeUrl && (
              <div className="bg-white rounded-lg p-2">
                <div className="relative w-full h-32">
                  <Image
                    src={qrCodeUrl}
                    alt="Driver QR Code"
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ---- Details ---- */}
          <div className="col-span-2 space-y-4">
            <div>
              <h3 className="text-3xl font-bold mb-1">
                {driver.firstName} {driver.middleName} {driver.lastName}
              </h3>
              <p className="text-green-100 text-sm">
                Driver ID: {driver.id.slice(0, 8).toUpperCase()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-200" />
                  <div>
                    <p className="text-xs text-green-200">Date of Birth</p>
                    <p className="font-medium">
                      {formatDate(driver.dateOfBirth, "PP")}
                    </p>
                    <p className="text-xs text-green-200">
                      Age: {calculateAge(driver.dateOfBirth)} years
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-green-200" />
                  <div>
                    <p className="text-xs text-green-200">Phone Number</p>
                    <p className="font-medium">{driver.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-200" />
                  <div>
                    <p className="text-xs text-green-200">State of Origin</p>
                    <p className="font-medium">{driver.stateOfOrigin}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-green-200">Address</p>
                  <p className="font-medium text-sm">{driver.address}</p>
                </div>

                <div>
                  <p className="text-xs text-green-200">LGA</p>
                  <p className="font-medium">{driver.lga}</p>
                </div>

                <div>
                  <p className="text-xs text-green-200">Nationality</p>
                  <p className="font-medium">{driver.nationality}</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-green-600">
              <p className="text-xs text-green-200">
                Registered: {formatDate(driver.createdAt, "PP")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==== Document Cards ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* License */}
        {license && (
          <div className="card border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Driver&apos;s License</h3>
              </div>
              <span className={`badge ${getStatusColor(license.status)}`}>
                {getStatusText(license.status)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">License Number</p>
                <p className="font-medium">{license.documentNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium">
                  {formatDate(license.issueDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">
                  {formatDate(license.expiryDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Issuing Authority</p>
                <p className="font-medium text-xs">
                  {license.issuingAuthority}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Insurance */}
        {insurance && (
          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Insurance</h3>
              </div>
              <span className={`badge ${getStatusColor(insurance.status)}`}>
                {getStatusText(insurance.status)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Policy Number</p>
                <p className="font-medium">{insurance.documentNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium">
                  {formatDate(insurance.issueDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">
                  {formatDate(insurance.expiryDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Provider</p>
                <p className="font-medium text-xs">
                  {insurance.issuingAuthority}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration */}
        {registration && (
          <div className="card border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Car className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">Vehicle Registration</h3>
              </div>
              <span className={`badge ${getStatusColor(registration.status)}`}>
                {getStatusText(registration.status)}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-500">Registration Number</p>
                <p className="font-medium">{registration.documentNumber}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium">
                  {formatDate(registration.issueDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Expiry Date</p>
                <p className="font-medium">
                  {formatDate(registration.expiryDate, "PP")}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Issuing Authority</p>
                <p className="font-medium text-xs">
                  {registration.issuingAuthority}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useRef, useEffect } from "react";
import {
  QrCode,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import QrScanner from "qr-scanner";
import {
  verificationService,
  type VerificationResult,
} from "@/services/verification";
import toast from "react-hot-toast";

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanner = async () => {
    try {
      setResult(null);
      setIsScanning(true);

      // Wait a bit for the video element to be rendered in the DOM
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!videoRef.current) {
        toast.error("Video element not ready");
        setIsScanning(false);
        return;
      }

      if (scannerRef.current) {
        scannerRef.current.destroy();
      }

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleQRCodeScan(result.data),
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
      toast.success("Camera active - scan QR code", { duration: 2000 });
    } catch (err: any) {
      console.error("Scanner error:", err);
      setIsScanning(false);

      let errorMsg = "Failed to start camera";
      if (err.name === "NotAllowedError") {
        errorMsg = "Camera permission denied";
      } else if (err.name === "NotFoundError") {
        errorMsg = "No camera found";
      } else if (err.name === "NotReadableError") {
        errorMsg = "Camera already in use";
      }

      toast.error(errorMsg);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeScan = async (qrCodeData: string) => {
    if (!qrCodeData || isVerifying) return;

    setIsVerifying(true);
    stopScanner();

    try {
      const verificationResult = await verificationService.verifyByQRCode(
        qrCodeData
      );
      setResult(verificationResult);

      if (verificationResult.valid) {
        toast.success("Verification successful!");
      } else {
        toast.error(verificationResult.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to verify QR code";
      setResult({
        valid: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScanAgain = () => {
    setResult(null);
    startScanner();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">QR Code Scanner</h1>
          <p className="text-sm opacity-90">
            Scan a driver&apos;s QR code to verify their documents
          </p>
        </div>

        <div className="p-4">
          {isVerifying ? (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 mb-6">
                Verifying QR code, please wait...
              </p>
            </div>
          ) : isScanning ? (
            <>
              <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-4 border-blue-400 border-dashed rounded-lg m-4 pointer-events-none"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 p-2">
                  Position QR code within the frame
                </div>
              </div>
              <button
                onClick={stopScanner}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Stop Scanning
              </button>
            </>
          ) : result ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div
                className={`p-6 ${result.valid ? "bg-green-50" : "bg-red-50"}`}
              >
                <div className="flex items-start">
                  <div
                    className={`flex-shrink-0 ${
                      result.valid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {result.valid ? (
                      <CheckCircle2 className="h-8 w-8" />
                    ) : (
                      <AlertCircle className="h-8 w-8" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3
                      className={`text-lg font-medium ${
                        result.valid ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.valid
                        ? "Verification Successful"
                        : "Verification Failed"}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        result.valid ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {result.valid
                        ? "The QR code has been successfully verified."
                        : result.error || "The QR code could not be verified."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Verification Details
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span
                      className={`font-medium ${
                        result.valid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.valid ? "Valid" : "Invalid"}
                    </span>
                  </div>
                  {result.verification && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Result</span>
                        <span className="font-medium">
                          {result.verification.result}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Verified At</span>
                        <span>
                          {new Date(
                            result.verification.timestamp
                          ).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                  {result.driver && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Driver Information
                      </h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name</span>
                          <span>
                            {result.driver.firstName} {result.driver.lastName}
                          </span>
                        </div>
                        {result.driver.phoneNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Phone</span>
                            <span>{result.driver.phoneNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {result.document && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="font-medium text-gray-900 mb-2">
                        Document Information
                      </h5>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type</span>
                          <span>{result.document.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Number</span>
                          <span>{result.document.documentNumber}</span>
                        </div>
                        {result.document.expiryDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Expires</span>
                            <span>
                              {new Date(
                                result.document.expiryDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:px-6 flex justify-end">
                <button
                  onClick={handleScanAgain}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Scan Again
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-6">
                Click the button below to start scanning a QR code
              </p>
              <button
                onClick={startScanner}
                className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Start Scanning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

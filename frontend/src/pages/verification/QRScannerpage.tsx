import { useState, useRef, useEffect } from "react";
import {
  QrCode,
  AlertCircle,
  CheckCircle2,
  Loader2,
  RotateCcw,
} from "lucide-react";
import {
  verificationService,
  type VerificationResult,
} from "@/services/verification";
import toast from "react-hot-toast";

// QR Code detection using jsQR library (included via CDN in HTML)
declare const jsQR: any;

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [jsQRLoaded, setJsQRLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load jsQR library
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js";
    script.async = true;
    script.onload = () => setJsQRLoaded(true);
    script.onerror = () => {
      setError("Failed to load QR scanner library");
      toast.error("Failed to load QR scanner");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      stopScanner();
    };
  }, []);

  // Start scanner when component mounts
  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, [jsQRLoaded]);

  const startScanner = async () => {
    if (!jsQRLoaded) {
      toast("QR scanner is still loading. Please wait...");
      return;
    }

    try {
      setError(null);
      setResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await videoRef.current.play();
        setIsScanning(true);
        detectQRCode();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      const errorMessage =
        "Could not access camera. Please ensure you have granted camera permissions.";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsScanning(false);
  };

  const detectQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    const scan = () => {
      if (!video || !canvas || !context || !isScanning) return;

      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );

          if (typeof jsQR !== "undefined") {
            const code = jsQR(
              imageData.data,
              imageData.width,
              imageData.height,
              {
                inversionAttempts: "dontInvert",
              }
            );

            if (code?.data) {
              handleQRCodeScan(code.data);
              return;
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(scan);
      } catch (err) {
        console.error("Error scanning QR code:", err);
        if (animationFrameRef.current) {
          animationFrameRef.current = requestAnimationFrame(scan);
        }
      }
    };

    scan();
  };

  const handleQRCodeScan = async (qrCodeData: string) => {
    if (!qrCodeData) {
      setError("Invalid QR code");
      toast.error("Invalid QR code");
      return;
    }

    setIsVerifying(true);
    stopScanner();

    try {
      toast.loading("Verifying QR code...");
      const verificationResult = await verificationService.verifyByQRCode(
        qrCodeData
      );

      setResult(verificationResult);

      if (verificationResult.valid) {
        toast.success("Verification successful");
      } else {
        toast.error(verificationResult.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying QR code:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to verify QR code";
      setError(errorMessage);
      setResult({
        valid: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      toast.dismiss();
      setIsVerifying(false);
    }
  };

  const handleScanAgain = () => {
    setResult(null);
    setError(null);
    startScanner();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            QR Code Verification
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Scan a driver's QR code to verify their credentials
          </p>
        </div>

        {/* Scanner Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            {!isScanning && !result && !isVerifying && (
              <div className="text-center p-6">
                <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-300">
                  {error ||
                    "Camera is not active. Click start to begin scanning."}
                </p>
              </div>
            )}

            {isVerifying && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-white text-lg font-medium">
                  Verifying QR code...
                </p>
              </div>
            )}

            <video
              ref={videoRef}
              className={`w-full h-full ${!isScanning ? "hidden" : ""}`}
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            {isScanning && (
              <div className="absolute inset-0 border-4 border-blue-500 border-dashed rounded-lg m-2 pointer-events-none" />
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4">
              {!isScanning ? (
                <button
                  onClick={startScanner}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center"
                  disabled={!jsQRLoaded || isVerifying}
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Start Scanner
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center"
                  disabled={isVerifying}
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Stop Scanner
                </button>
              )}

              {!isScanning && !isVerifying && result && (
                <button
                  onClick={handleScanAgain}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded-md flex items-center"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Scan Again
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
            <div
              className={`p-6 ${
                result.valid
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 ${
                    result.valid ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {result.valid ? (
                    <CheckCircle2 className="w-8 h-8" />
                  ) : (
                    <AlertCircle className="w-8 h-8" />
                  )}
                </div>
                <div className="ml-4">
                  <h3
                    className={`text-lg font-medium ${
                      result.valid
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}
                  >
                    {result.valid
                      ? "Verification Successful"
                      : "Verification Failed"}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      result.valid
                        ? "text-green-700 dark:text-green-300"
                        : "text-red-700 dark:text-red-300"
                    }`}
                  >
                    {result.valid
                      ? "The QR code has been successfully verified."
                      : result.error || "The QR code could not be verified."}
                  </p>
                </div>
              </div>
            </div>

            {result.driver && (
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Driver Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {result.driver.firstName} {result.driver.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Phone Number
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {result.driver.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date of Birth
                    </p>
                    <p className="mt-1 text-gray-900 dark:text-white">
                      {result.driver.dateOfBirth
                        ? formatDate(result.driver.dateOfBirth)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </p>
                    <p
                      className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.driver.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                      }`}
                    >
                      {result.driver.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>

                {result.verification && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Verification Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Verification ID
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white font-mono text-sm">
                          {result.verification.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Result
                        </p>
                        <p
                          className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.verification.result === "VALID"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                          }`}
                        >
                          {result.verification.result}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Verified On
                        </p>
                        <p className="mt-1 text-gray-900 dark:text-white">
                          {formatDate(result.verification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Debug Section - Only show in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Development Tools
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleQRCodeScan("driver:test123")}
                className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md"
                disabled={isVerifying}
              >
                Test Valid QR
              </button>
              <button
                onClick={() => handleQRCodeScan("invalid:test123")}
                className="px-3 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md"
                disabled={isVerifying}
              >
                Test Invalid QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

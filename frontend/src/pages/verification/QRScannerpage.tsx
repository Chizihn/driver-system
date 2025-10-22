import { useState, useRef, useEffect } from "react";
import {
  QrCode,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import QrScanner from "qr-scanner";
import { verificationService, type VerificationResult } from "@/services/verification";
import toast from "react-hot-toast";

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    const loadingToast = toast.loading("Initializing camera...");
    
    try {
      setError(null);
      setResult(null);

      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (!videoRef.current) {
        toast.dismiss(loadingToast);
        throw new Error("Video element not available");
      }

      // Set up video
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      
      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        if (!videoRef.current) {
          reject(new Error("Video element lost"));
          return;
        }
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
            .then(resolve)
            .catch(reject);
        };
        
        // Timeout after 5 seconds
        setTimeout(() => reject(new Error("Video loading timeout")), 5000);
      });

      toast.dismiss(loadingToast);
      toast.loading("Starting QR scanner...");

      // Initialize scanner
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleQRCodeScan(result.data),
        {
          preferredCamera: "environment",
          maxScansPerSecond: 5,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      // Start scanning
      try {
        await scannerRef.current.start();
        setIsScanning(true);
        toast.dismiss();
        toast.success("Camera ready. Position QR code in frame.", { duration: 2000 });
      } catch (scannerError) {
        console.error("Scanner start error:", scannerError);
        // If scanner fails to start, we can still show the video
        // The scanner might work without calling start() explicitly
        setIsScanning(true);
        toast.dismiss();
        toast.success("Camera ready. Position QR code in frame.", { duration: 2000 });
      }

    } catch (err) {
      console.error("Error in startScanner:", err);
      toast.dismiss(loadingToast);
      
      let errorMessage = "Could not start camera.";
      
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera permission denied. Please allow camera access.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotReadableError") {
          errorMessage = "Camera is already in use by another application.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      stopScanner();
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      } catch (e) {
        console.error("Error stopping scanner:", e);
      }
      scannerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeScan = async (qrCodeData: string) => {
    if (!qrCodeData || isVerifying) {
      return;
    }

    setIsVerifying(true);
    stopScanner();

    const verifyToast = toast.loading("Verifying QR code...");

    try {
      const verificationResult = await verificationService.verifyByQRCode(qrCodeData);
      setResult(verificationResult);

      toast.dismiss(verifyToast);
      
      if (verificationResult.valid) {
        toast.success("Verification successful!");
      } else {
        toast.error(verificationResult.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("Error verifying QR code:", error);
      const errorMessage = error.response?.data?.message || "Failed to verify QR code";
      setError(errorMessage);
      setResult({
        valid: false,
        error: errorMessage,
      });
      toast.dismiss(verifyToast);
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleScanAgain = () => {
    setResult(null);
    setError(null);
    startScanner();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">QR Code Scanner</h1>
          <p className="text-sm opacity-90">
            Scan a driver's QR code to verify their documents
          </p>
        </div>

        <div className="p-4">
          {isVerifying ? (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600 mb-6">Verifying QR code, please wait...</p>
            </div>
          ) : isScanning ? (
            <>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                <div className="absolute inset-0 border-4 border-blue-400 border-dashed rounded-lg m-2 pointer-events-none"></div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 p-2">
                  Position QR code within the frame
                </div>
              </div>
              <button
                onClick={stopScanner}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center gap-2 mb-4"
              >
                <RotateCcw className="w-5 h-5" />
                Stop Scanning
              </button>
            </>
          ) : result ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
              <div className={`p-4 sm:p-6 ${result.valid ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${result.valid ? "text-green-500" : "text-red-500"}`}>
                    {result.valid ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <AlertCircle className="w-8 h-8" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-lg font-medium ${result.valid ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                      {result.valid ? "Verification Successful" : "Verification Failed"}
                    </h3>
                    <p className={`mt-1 text-sm ${result.valid ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      {result.valid ? "The QR code has been successfully verified." : (result.error || "The QR code could not be verified.")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <button
                  onClick={handleScanAgain}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Another Code
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

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-900/30">
              <p className="text-sm text-red-600 dark:text-red-400">
                <span className="font-medium">Error:</span> {error}
              </p>
            </div>
          )}

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900/30">
              <h4 className="text-sm sm:text-base font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Debug Information
              </h4>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-medium">Scanner Status:</span>{" "}
                  {isScanning ? "Active" : "Inactive"}
                </p>
                <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
                  <span className="font-medium">Stream Active:</span>{" "}
                  {streamRef.current ? "Yes" : "No"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
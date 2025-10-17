"use client";

import type React from "react";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, QrCode, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { driverService } from "@/services/driver";
import { verificationService } from "@/services/verification";
import DriverIDCard from "@/components/drivers/DriverIDCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

import type { VerificationResult as ServiceVerificationResult } from "@/services/verification";

// Define the document type we expect from the verification service
interface VerificationDocument {
  id: string;
  documentNumber: string;
  documentType: string;
  expiryDate: string;
  status: 'VALID' | 'INVALID' | 'EXPIRED' | 'FORGED';
  [key: string]: any; // Allow additional properties
}

// Local type that extends the service result with our document type
interface VerificationResult extends Omit<ServiceVerificationResult, 'document'> {
  document?: VerificationDocument | null;
}

export default function VerifyDriverPage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState<"id" | "license">("id");
  const [searchValue, setSearchValue] = useState("");
  const [driverData, setDriverData] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (value: string) => {
      if (searchType === "id") {
        return await driverService.getDriverById(value);
      } else {
        const response = await driverService.searchDrivers(value);
        if (response.length === 0) {
          throw new Error("Driver not found");
        }
        return response[0];
      }
    },
    onSuccess: (data) => {
      setDriverData(data);
      setVerificationResult(null);
      toast.success("Driver found");
    },
    onError: (error: any) => {
      toast.error(error.message || "Driver not found");
      setDriverData(null);
      setVerificationResult(null);
    },
  });

  const verifyDocument = async (documentNumber: string) => {
    if (!documentNumber) {
      toast.error("No document number found");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verificationService.verifyByDocumentNumber(documentNumber);
      
      // Create a new document object with only the properties we need
      const document = result.document ? {
        id: result.document.id,
        documentNumber: result.document.documentNumber,
        documentType: 'documentType' in result.document ? String(result.document.documentType) : 'DRIVER_LICENSE',
        expiryDate: 'expiryDate' in result.document ? String(result.document.expiryDate) : new Date().toISOString(),
        status: ('status' in result.document 
          ? String(result.document.status).toUpperCase() 
          : 'INVALID') as 'VALID' | 'INVALID' | 'EXPIRED' | 'FORGED'
      } : null;

      // Create the verification data with the properly typed document
      const verificationData: VerificationResult = {
        valid: result.valid,
        error: result.error,
        document,
        verification: result.verification
      };
      
      setVerificationResult(verificationData);
      
      if (result.valid) {
        toast.success("Document verified successfully");
      } else {
        toast.error(result.error || "Document verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      const errorMessage = error.response?.data?.message || "Failed to verify document";
      toast.error(errorMessage);
      setVerificationResult({
        valid: false,
        error: errorMessage,
        document: null
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      toast.error("Please enter a search value");
      return;
    }
    searchMutation.mutate(searchValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Verify Driver</h1>
        <p className="text-slate-600 mt-1">
          Search and verify driver credentials
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Driver</CardTitle>
          <CardDescription>
            Enter driver ID or license number to verify credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={searchType}
            onValueChange={(v) => setSearchType(v as "id" | "license")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="id">Driver ID</TabsTrigger>
              <TabsTrigger value="license">License Number</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">
                  {searchType === "id" ? "Driver ID" : "License Number"}
                </Label>
                <Input
                  id="search"
                  type="text"
                  placeholder={
                    searchType === "id"
                      ? "Enter driver ID"
                      : "Enter license number"
                  }
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={searchMutation.isPending}
                  className="flex-1"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {searchMutation.isPending ? "Searching..." : "Search"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/scan-qr")}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Scan QR
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>

      {driverData && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Driver Information
            </h2>
            <DriverIDCard driver={driverData} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Verify the authenticity of the driver's document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {driverData.documentNumber ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Document Number</p>
                      <p className="text-sm text-gray-500">{driverData.documentNumber}</p>
                    </div>
                    <Button 
                      onClick={() => verifyDocument(driverData.documentNumber)}
                      disabled={isVerifying}
                    >
                      {isVerifying ? "Verifying..." : "Verify Document"}
                    </Button>
                  </div>

                  {verificationResult && (
                    <div className={`p-4 rounded-lg ${
                      verificationResult.valid 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        {verificationResult.valid ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <h4 className="font-medium">
                            {verificationResult.valid 
                              ? 'Document Verified Successfully' 
                              : 'Verification Failed'}
                          </h4>
                          {verificationResult.document && (
                            <div className="mt-2 space-y-1 text-sm">
                              <p><span className="font-medium">Status:</span>{" "}
                                <Badge 
                                  variant={verificationResult.document.status === 'VALID' ? 'default' : 'destructive'}
                                  className={`ml-1 ${
                                    verificationResult.document.status === 'VALID' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                      : ''
                                  }`}
                                >
                                  {verificationResult.document.status}
                                </Badge>
                              </p>
                              <p><span className="font-medium">Expires:</span>{" "}
                                {verificationResult.document.expiryDate 
                                  ? new Date(verificationResult.document.expiryDate).toLocaleDateString()
                                  : 'N/A'}
                              </p>
                            </div>
                          )}
                          {verificationResult.error && (
                            <p className="text-sm text-red-600 mt-1">
                              {verificationResult.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
                  <p className="text-gray-600">No document information available for this driver</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

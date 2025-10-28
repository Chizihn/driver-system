"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { driverService } from "@/services/driver";
import DriverIDCard from "@/components/drivers/DriverIDCard";
import { Document } from "@/types";

export default function DriverDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

  const { data: driver, isLoading } = useQuery({
    queryKey: ["driver", id],
    queryFn: () => driverService.getDriverById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Driver not found</p>
        <Button onClick={() => router.push("/drivers")} className="mt-4">
          Back to Drivers
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/drivers")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Driver Details</h1>
          <p className="text-slate-600 mt-1">
            Complete driver information and documents
          </p>
        </div>
      </div>

      <DriverIDCard driver={driver} />

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {driver.documents?.length === 0 ? (
            <p className="text-slate-500 text-sm">No documents available</p>
          ) : (
            <div className="space-y-4">
              {driver.documents?.map((doc: Document) => (
                <div key={doc.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{doc.type}</p>
                      <p className="text-sm text-slate-600">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.status === "VALID"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

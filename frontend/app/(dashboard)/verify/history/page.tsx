"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { verificationService } from "@/services/verification";
import { format } from "date-fns";
import { VerificationLog, VerificationResult } from "@/types";

export default function VerificationHistoryPage() {
  const { data: verifications, isLoading } = useQuery<VerificationLog[]>({
    queryKey: ["verifications"],
    queryFn: async () => {
      return await verificationService.getVerificationHistory();
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Verification History
        </h1>
        <p className="text-slate-600 mt-1">
          View all driver verification records
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verifications?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500"
                    >
                      No verification records found
                    </TableCell>
                  </TableRow>
                ) : (
                  verifications?.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell>
                        {format(
                          new Date(verification.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {verification.driver?.firstName}{" "}
                        {verification.driver?.lastName}
                      </TableCell>
                      <TableCell>
                        {verification.document?.documentNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {verification.officer?.firstName}{" "}
                        {verification.officer?.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            verification.result === VerificationResult.VALID
                              ? "bg-green-100 text-green-800"
                              : verification.result ===
                                VerificationResult.INVALID
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {verification.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

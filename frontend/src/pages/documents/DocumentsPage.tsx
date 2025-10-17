import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText, AlertTriangle } from "lucide-react";
import api from "@/lib/axios";
import { formatDate, getStatusColor, getStatusText } from "@/lib/utils";
import type { Document } from "@/types";

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: documentsResponse, isLoading } = useQuery({
    queryKey: ["documents", searchQuery],
    queryFn: async () => {
      const response = await api.get("/documents", {
        params: searchQuery ? { search: searchQuery } : {},
      });
      return response.data;
    },
  });

  const { data: expiringDocs } = useQuery({
    queryKey: ["expiring-documents"],
    queryFn: async () => {
      const response = await api.get("/documents/expiring", {
        params: { days: 30 },
      });
      return response.data.data || [];
    },
  });

  const documents = documentsResponse?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
        <p className="text-slate-600 mt-1">
          Manage driver documents and track expiration dates
        </p>
      </div>

      {/* Expiring Documents Alert */}
      {expiringDocs && expiringDocs.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Documents Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700 mb-3">
              {expiringDocs.length} document(s) will expire within 30 days
            </p>
            <div className="space-y-2">
              {expiringDocs.slice(0, 5).map((doc: Document) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {doc.driver?.firstName} {doc.driver?.lastName} - {doc.type}
                  </span>
                  <span className="text-orange-600 font-medium">
                    Expires: {formatDate(doc.expiryDate)}
                  </span>
                </div>
              ))}
              {expiringDocs.length > 5 && (
                <p className="text-orange-600 text-sm">
                  +{expiringDocs.length - 5} more documents
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            All Documents
          </CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by document number, driver name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
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
                  <TableHead>Document Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-slate-500"
                    >
                      No documents found
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc: Document) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        {doc.documentNumber}
                      </TableCell>
                      <TableCell>{doc.type}</TableCell>
                      <TableCell>
                        {doc.driver?.firstName} {doc.driver?.lastName}
                      </TableCell>
                      <TableCell>{formatDate(doc.issueDate)}</TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(doc.expiryDate) < new Date()
                              ? "text-red-600 font-medium"
                              : new Date(doc.expiryDate) <
                                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              ? "text-orange-600 font-medium"
                              : ""
                          }
                        >
                          {formatDate(doc.expiryDate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
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

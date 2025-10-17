"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, Search, Eye } from "lucide-react";
import { driverService } from "@/services/driver";
import { format } from "date-fns";

export default function DriversListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: driversResponse, isLoading } = useQuery({
    queryKey: ["drivers", searchQuery],
    queryFn: async () => {
      if (searchQuery) {
        return { data: await driverService.searchDrivers(searchQuery) };
      } else {
        return await driverService.getAllDrivers();
      }
    },
  });

  const drivers = driversResponse?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Drivers</h1>
          <p className="text-slate-600 mt-1">
            Manage driver records and information
          </p>
        </div>
        <Button onClick={() => navigate("/drivers/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, license number..."
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
                  <TableHead>Full Name</TableHead>
                  <TableHead>License Number</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500"
                    >
                      No drivers found
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers?.map((driver: any) => (
                    <TableRow key={driver.id}>
                      <TableCell className="font-medium">
                        {driver.firstName} {driver.lastName}
                      </TableCell>
                      <TableCell>
                        {driver.documents?.[0]?.documentNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(driver.dateOfBirth), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            driver.documents?.some(
                              (d: any) => d.status === "EXPIRED"
                            )
                              ? "destructive"
                              : "default"
                          }
                        >
                          {driver.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/drivers/${driver.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
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

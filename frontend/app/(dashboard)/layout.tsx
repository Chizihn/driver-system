"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Header />
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 mt-16 md:ml-64">
        <div className="max-w-full overflow-x-auto">{children}</div>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  QrCode,
  Users,
  FileText,
  History,
  UserPlus,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ← Next.js active route
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@/types";

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname(); // ← Replaces useLocation
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileMenuOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    // Optional: Clear httpOnly cookies via API
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Failed to clear server cookies", err);
    }

    // Clear localStorage fallback
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    logout(); // Clear Zustand
    window.location.href = "/login"; // Full reload to clear state
  };

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/verify", icon: Search, label: "Verify Driver" },
    { href: "/scan-qr", icon: QrCode, label: "Scan QR Code" },
    { href: "/drivers", icon: Users, label: "Drivers" },
    { href: "/documents", icon: FileText, label: "Documents" },
    { href: "/verify/history", icon: History, label: "Verification History" },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({
      href: "/drivers/new",
      icon: UserPlus,
      label: "Add Driver",
    });
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-government-green text-white shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-30 transition-transform duration-300 ease-in-out ${
          isMobile
            ? isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }`}
      >
        {/* User Info */}
        <div className="p-4 border-b border-gray-200 mt-16">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-government-green text-white flex items-center justify-center">
              <span className="font-bold">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role} {user?.badgeNumber && `• ${user.badgeNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-government-green text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  QrCode,
  Users,
  FileText,
  History,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { UserRole } from "@/types";

export default function Sidebar() {
  const { user } = useAuthStore();

  const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/verify", icon: Search, label: "Verify Driver" },
    { to: "/scan-qr", icon: QrCode, label: "Scan QR Code" },
    { to: "/drivers", icon: Users, label: "Drivers" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/history", icon: History, label: "Verification History" },
  ];

  if (user?.role === UserRole.ADMIN) {
    navItems.push({ to: "/drivers/new", icon: UserPlus, label: "Add Driver" });
  }

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-government-green text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

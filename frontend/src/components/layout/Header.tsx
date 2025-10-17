import { useAuthStore } from "@/stores/auth.store";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-government-green text-white shadow-md z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-government-green font-bold text-xl">NG</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Driver Identification System</h1>
            <p className="text-xs text-green-100">Federal Road Safety Corps</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-green-100">
              {user?.role} {user?.badgeNumber && `• ${user.badgeNumber}`}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-green-700 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

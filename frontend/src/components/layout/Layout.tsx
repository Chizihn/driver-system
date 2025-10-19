import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <Header />
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 mt-16 md:ml-64">
        <div className="max-w-full overflow-x-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

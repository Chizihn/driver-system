import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./stores/auth.store";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import VerifyDriverPage from "./pages/verification/VerifyDriverPage";
import DriverDetailsPage from "./pages/drivers/DriverDetailsPage";
import DriversListPage from "./pages/drivers/DriversListPage";
import CreateDriverPage from "./pages/drivers/CreateDriverPage";
import DocumentsPage from "./pages/documents/DocumentsPage";
import VerificationHistoryPage from "./pages/verification/VerificationHistoryPage";
import Layout from "./components/layout/Layout";
import QRScannerPage from "./pages/verification/QRScannerpage";

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/verify" element={<VerifyDriverPage />} />
            <Route path="/scan-qr" element={<QRScannerPage />} />
            <Route path="/drivers" element={<DriversListPage />} />
            <Route path="/drivers/new" element={<CreateDriverPage />} />
            <Route path="/drivers/:id" element={<DriverDetailsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/history" element={<VerificationHistoryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

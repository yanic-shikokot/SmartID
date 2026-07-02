import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import StudentsPage from "@/pages/StudentsPage";
import IDCardsPage from "@/pages/IDCardsPage";
import ScannerPage from "@/pages/ScannerPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin", "registrar", "finance"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "registrar"]}>
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/id-cards"
            element={
              <ProtectedRoute allowedRoles={["admin", "registrar"]}>
                <IDCardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <ProtectedRoute allowedRoles={["admin", "registrar"]}>
                <ScannerPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

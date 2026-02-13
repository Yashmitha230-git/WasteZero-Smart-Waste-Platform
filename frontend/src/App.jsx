import { Routes, Route } from "react-router-dom";

import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";

import AdminDashboard from "./pages/AdminDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<OtpVerification />} />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo"
        element={
          <ProtectedRoute allowedRoles={["ngo"]}>
            <NgoDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/volunteer"
        element={
          <ProtectedRoute allowedRoles={["volunteer"]}>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;

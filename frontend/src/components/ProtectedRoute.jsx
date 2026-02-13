import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles) {
    const user = JSON.parse(storedUser);

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;

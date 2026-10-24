import { Navigate } from "react-router-dom";
import { useAuth, roleHome } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to={roleHome[user.role]} replace />;
  return children;
}

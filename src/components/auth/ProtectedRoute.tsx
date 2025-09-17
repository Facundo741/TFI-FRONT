import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  roleRequired?: "admin" | "user";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;

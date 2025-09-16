import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  roleRequired?: string;
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roleRequired, children }) => {
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (roleRequired && role !== roleRequired) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;

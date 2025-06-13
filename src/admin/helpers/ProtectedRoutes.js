import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole, userRole }) => {
  if (!userRole) {
    return <Navigate to="/docora-fe/login" replace />;
  }

  if (userRole !== requiredRole) {
    return <Navigate to="/docora-fe/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

// components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nema tokena – redirect na login
    return <Navigate to="/docora-fe/login" replace />;
  }

  try {
    const { role } = JSON.parse(atob(token.split('.')[1])); // decode payload

    if (requiredRole && role !== requiredRole) {
      // Nema prava – redirect na početnu
      return <Navigate to="/docora-fe" replace />;
    }

    return children;
  } catch (err) {
    // Token nevažeći
    localStorage.removeItem("token");
    return <Navigate to="/docora-fe/login" replace />;
  }
};

export default ProtectedRoute;

import { useLocation, Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children, role }) => {
  const location = useLocation();

  if (!role) {
    return children;
  }

  let redirectPath = null;
  if (role === "admin") redirectPath = "/docora-fe/admin-page";
  else if (role === "user") redirectPath = "/docora-fe/application";

  if (redirectPath && location.pathname !== redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;

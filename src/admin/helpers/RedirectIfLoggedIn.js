import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const RedirectIfLoggedIn = ({ children }) => {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const { role } = jwtDecode(token);
        toast.info("Prvo se izloguj pa onda pristupi ovoj stranici.", {
          toastId: "already-logged-in", // sprečava duplikate
        });

        setShouldRedirect(true);
        if (role === "admin") {
          setRedirectPath("/docora-fe/admin-page");
        } else if (role === "user") {
          setRedirectPath("/docora-fe/application");
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  if (shouldRedirect && redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;

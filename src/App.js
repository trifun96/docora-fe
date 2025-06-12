import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "./users/components/LandingPage/Background";
import LoginPage from "./users/components/LoginPage/LoginPage";
import PatientForm from "./users/components/PatientForm/PatientForm";
import ReportDisplay from "./users/components/ReportDisplay/ReportDisplay";
import RegisterForm from "./admin/components/RegistrationForm/RegistrationForm";
import ProtectedRoute from "./admin/helpers/ProtectedRoutes";
import RedirectIfLoggedIn from "./admin/helpers/RedirectIfLoggedIn";

function App() {
  const [role, setRole] = useState(null);
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [patientData, setPatientData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { role } = jwtDecode(token);
        setRole(role);
      } catch {
        localStorage.removeItem("token");
        setRole(null);
      }
    }
  }, []);

  const clearReport = () => {
    setReport("");
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/docora-fe" replace />} />

        <Route
          path="/docora-fe"
          element={
            <RedirectIfLoggedIn>
              <LandingPage />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/docora-fe/login"
          element={
            <RedirectIfLoggedIn>
              <LoginPage />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/docora-fe/application"
          element={
            <ProtectedRoute requiredRole="user">
              <PatientForm
                onGenerateReport={setReport}
                onEmailChange={setEmail}
                onPatientDataFilled={setPatientData}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/docora-fe/admin-page"
          element={
            <ProtectedRoute requiredRole="admin">
              <RegisterForm />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/docora-fe" replace />} />
      </Routes>

      <ReportDisplay
        report={report}
        patientData={patientData}
        email={email}
        clearReport={clearReport}
      />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;

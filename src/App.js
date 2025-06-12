import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import LandingPage from "./users/components/LandingPage/Background";
import LoginPage from "./users/components/LoginPage/LoginPage";
import PatientForm from "./users/components/PatientForm/PatientForm";
import ReportDisplay from "./users/components/ReportDisplay/ReportDisplay";
import RegisterForm from "./admin/components/RegistrationForm/RegistrationForm";

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
        console.log(role, "role");

        setRole(role);
      } catch {
        localStorage.removeItem("token");
        setRole(null);
      }
    }
  }, []);

  const isUser = role === "user";
  const isAdmin = role === "admin";

  const clearReport = () => {
    setReport("");
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/docora-fe" replace />} />

        <Route path="/docora-fe" element={<LandingPage />} />

        <Route
          path="/docora-fe/login"
          element={
            role ? (
              <Navigate
                to={
                  isAdmin ? "/docora-fe/admin-page" : "/docora-fe/application"
                }
                replace
              />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/docora-fe/application"
          element={
            <PatientForm
              onGenerateReport={setReport}
              onEmailChange={setEmail}
              onPatientDataFilled={setPatientData}
            />
          }
        />
        <Route path="/docora-fe/admin-page" element={<RegisterForm />} />

        <Route path="*" element={<Navigate to="/docora-fe" replace />} />
      </Routes>
      <ReportDisplay
        report={report}
        patientData={patientData}
        email={email}
        clearReport={clearReport}
      />
    </div>
  );
}

export default App;

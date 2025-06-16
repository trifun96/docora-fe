import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./users/components/Header/Header";
import LandingPage from "./users/components/LandingPage/Background";
import LoginPage from "./users/components/LoginPage/LoginPage";
import PatientForm from "./users/components/PatientForm/PatientForm";
import ReportDisplay from "./users/components/ReportDisplay/ReportDisplay";
import RegisterForm from "./admin/components/RegistrationForm/RegistrationForm";
import ProtectedRoute from "./admin/helpers/ProtectedRoutes";
import RedirectIfLoggedIn from "./admin/helpers/RedirectIfLoggedIn";
import { fetchProfile } from "./api/api";

import { getSession } from "./api/api";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [patientData, setPatientData] = useState({});
  const [profile, setProfile] = useState(null); // dodato

  useEffect(() => {
    getSession()
      .then((data) => {
        if (data?.role) setRole(data.role);
        if (data?.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }

        // Poziv fetchProfile
        return fetchProfile();
      })
      .then((profileData) => {
        setProfile(profileData);
      })
      .catch(() => {
        setRole(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const clearReport = () => {
    setReport("");
  };

  if (loading) return <p>Učitavanje...</p>;

  return (
    <div>
      <Header role={role} setRole={setRole} userName={user?.name} setProfile={setProfile} />

      <Routes>
        <Route path="/" element={<Navigate to="/docora-fe" replace />} />

        <Route path="/docora-fe" element={<LandingPage />} />

        <Route
          path="/docora-fe/login"
          element={
            <RedirectIfLoggedIn role={role}>
              <LoginPage
                setRole={setRole}
                setUser={setUser}
                setProfile={setProfile}
              />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/docora-fe/application"
          element={
            <ProtectedRoute requiredRole="user" userRole={role}>
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
            <ProtectedRoute requiredRole="admin" userRole={role}>
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
        profile={profile}
      />

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default App;

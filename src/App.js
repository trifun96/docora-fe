import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./users/components/LandingPage/Background";
import LoginPage from "./users/components/LoginPage/LoginPage";
import PatientForm from "./users/components/PatientForm/PatientForm";
import ReportDisplay from "./users/components/ReportDisplay/ReportDisplay";
import RegisterForm from "./admin/components/RegistrationForm";
import { useState } from "react";

function App() {
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [patientData, setPatientData] = useState({});
  return (
    <div
    >
      <Routes>
        <Route path="/" element={<Navigate to="/docora-fe" replace />} />
        <Route path="/docora-fe" element={<LandingPage />} />
        <Route path="/docora-fe/login" element={<LoginPage />} />
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
      </Routes>
      <ReportDisplay
        report={report}
        patientData={patientData}
        email={email}
      ></ReportDisplay>
      {/* <RegisterForm></RegisterForm> */}
    </div>
  );
}

export default App;

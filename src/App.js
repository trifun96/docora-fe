import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./users/components/LandingPage/Background";
import LoginPage from "./users/components/LoginPage/LoginPage";
import PatientForm from "./components/PatientForm";
import ReportDisplay from "./components/ReportDisplay";
import { useState } from "react";

function App() {
  const [report, setReport] = useState("");
  const [email, setEmail] = useState("");
  const [patientData, setPatientData] = useState({});
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/docora-fe" replace />} />

        <Route path="/docora-fe" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <PatientForm
        onGenerateReport={setReport}
        onEmailChange={setEmail}
        onPatientDataFilled={setPatientData}
      />
      <ReportDisplay
        report={report}
        patientData={patientData}
        email={email}
      ></ReportDisplay>
    </div>
  );
}

export default App;

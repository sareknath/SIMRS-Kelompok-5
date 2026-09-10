import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ClinicProvider } from "./context/ClinicContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/PatientList";
import PatientForm from "./pages/PatientForm";
import PatientHistory from "./pages/PatientHistory";
import NurseStation from "./pages/NurseStation";
import DoctorQueue from "./pages/DoctorQueue";
import MedicalRecord from "./pages/MedicalRecord";
import PrescriptionPage from "./pages/Prescription";

function App() {
  return (
    <AuthProvider>
      <ClinicProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pasien"
              element={
                <ProtectedRoute>
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pasien/baru"
              element={
                <ProtectedRoute>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pasien/:id/edit"
              element={
                <ProtectedRoute>
                  <PatientForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pasien/:id/riwayat"
              element={
                <ProtectedRoute>
                  <PatientHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nurse-station"
              element={
                <ProtectedRoute>
                  <NurseStation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/antrian-dokter"
              element={
                <ProtectedRoute>
                  <DoctorQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kunjungan/:visitId"
              element={
                <ProtectedRoute>
                  <MedicalRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kunjungan/:visitId/resep"
              element={
                <ProtectedRoute>
                  <PrescriptionPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resep"
              element={
                <ProtectedRoute>
                  <PrescriptionPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ClinicProvider>
    </AuthProvider>
  );
}

export default App;

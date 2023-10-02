import "./App.css";
import LoginPage from "./templates/registration/LoginPage";
import MapPage from "./templates/MapPage";
import RegisterPage from "./templates/registration/RegisterPage";
import UserPage from "./templates/UserPage";
import Navbar from "./components/Navbar";
import AdminPage from "./templates/admin/AdminPage";
import ReportPage from "./templates/ReportPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/report" element={<ReportPage />} />

      </Routes>
    </BrowserRouter>
  );
}

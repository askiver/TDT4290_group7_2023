import "./App.css";
import LoginPage from "./templates/registration/LoginPage";
import MapPage from "./templates/MapPage";
import RegisterPage from "./templates/registration/RegisterPage";
import UserPage from "./templates/UserPage";
import Navbar from "./components/Navbar";
import AdminPage from "./templates/admin/AdminPage";
import ReportPage from "./templates/ReportPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

export default function App() {

  const isAuthenticated = async () => {
    
    try {
      // Check if the user is authenticated
      console.log("Starting function")
      const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:8000/api/check_login/",
        withCredentials: true, // Send credentials (cookies) if needed
      });
      
      console.log("Came this far")
      const response = await axiosInstance.get("");
      return response

    } catch (error) {
      console.log("Checking authentication failed.")
      console.log(error)
      return false
    }
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route
          path="/map"
          element={isAuthenticated() ? <MapPage /> : <Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );


}

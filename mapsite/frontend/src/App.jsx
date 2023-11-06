import "./App.css";
import LoginPage from "./templates/registration/LoginPage";
import RegisterPage from "./templates/registration/RegisterPage";
import UserPage from "./templates/UserPage";
import Navbar from "./components/Navbar";
import AdminPage from "./templates/admin/AdminPage";
import ReportPage from "./templates/ReportPage";
import ReportsPage from "./templates/ReportsPage";
import Map from "./templates/map/Map";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  /*
  const isAuthenticated = async () => {
    try {
      // Check if the user is authenticated
      console.log("Starting function");
      const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:8000/api/check_login/",
        withCredentials: true, // Send credentials (cookies) if needed
      });

      console.log("Came this far");
      await axiosInstance.get("");
      return true;
    } catch (error) {
      console.log("Checking authentication failed.");
      console.log(error);
      return false;
    }
  };*/

  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ paddingTop: "64px" }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/report" element={<ReportsPage />}/>
          <Route path="/report/:selectedBuilding" element={<ReportPage/>}/>

          <Route path="/map" element={<Map />} />

          {/*
            // How to route with authentication
            <Route
              path="/map"
              element={isAuthenticated() ? <MapPage /> : <Navigate to="/login" />}
            />
    */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

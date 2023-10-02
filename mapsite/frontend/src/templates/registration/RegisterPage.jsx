import React, { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      // Create an Axios instance with CORS support
      const axiosInstance = axios.create({
        baseURL: "http://127.0.0.1:8000/api/register/",
        withCredentials: true, // Send credentials (cookies) if needed
      });

      // TODO: REGISTRATION LOGIC
      const response = await axiosInstance.post("", { username, password });

      // Handle successful registration
      console.log("Registration successful:", response);

      // Navigate to the "/map" route
      navigate("/map");
    } catch (error) {
      // Handle login error
      console.error("Registration failed:", error);

      setFormData({
        ...formData,
        error: "Registration failed. Please check your credentials.",
      });
    }
  };

  const { username, password, error } = formData;

  return (
    <div>
      <Box
        sx={{
          width: 500,
          height: 600,
          backgroundColor: "white",
          p: "1rem",
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
        <h2>Registrer ny bruker</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <TextField
              id="username-input"
              label="Brukernavn"
              type="username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="email-input"
              label="Email-addresse"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              id="password-input"
              label="Passord"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="button">
            Logg inn
          </button>
          {error && <p>{error}</p>}
        </form>
        <h4>Har du ikke bruker? Registrer deg her:</h4>
        <button type="register" className="button" onClick={navigateToRegistration}>
          Registrer bruker
        </button>
      </Box>
    </div>
  );
}

export default RegisterPage;

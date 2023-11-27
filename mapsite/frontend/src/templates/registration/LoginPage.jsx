import { useState } from "react";
import { post } from "../../components/AxiosModule";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    error: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const navigateToRegistration = () => {
    navigate('/register')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    try {
      const response = await post("login/", { username, password });

      // Handle successful login
      console.log("Login successful:", response);

      // Navigate to the "/map" route
      navigate("/map");
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error);

      setFormData({
        ...formData,
        error: "Innlogging mislyktes. Dobbeltsjekk ditt brukernavn og passord.", //Brukernavn og passord stemmer ikke overens. Vennligst prøv igjen. -Viaplay
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
          mx: "auto",
          backgroundColor: "white",
          p: "1rem",
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
        <h2>For å bruke denne siden må du logge inn.</h2>
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
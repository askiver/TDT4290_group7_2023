import { useState } from "react";
import { post } from "../../components/AxiosModule";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

/**
 * This template displays the registration page.
 * @returns 
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password1: "",
    password2: "",
    email: "",
    error: "",
  });

  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password1, password2, email } = formData;

    try {
      const response = await post("register/", { username, password1, password2, email });

      // Handle successful registration
      console.log("Registration successful:", response);
      navigate("/map");
    } catch (error) {
      console.error("Registration failed:", error);

      setFormData({
        ...formData,
        error: "Registreringen mislyktes. Prøv igjen senere.",
      });
    }
  };

  const { username, password1, password2, error, email} = formData;

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
              label="Epost-adresse"
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
              name="password1"
              value={password1}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <div>
            <TextField
              id="password-input2"
              label="Gjengi passord"
              type="password"
              name="password2"
              value={password2}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="button">
            Opprett bruker
          </button>
          {error && <p>{error}</p>}
        </form>
        <h4>Har du allerede bruker? Logg inn her:</h4>
        <button type="register" className="button" onClick={navigateToLogin}>
          Logg inn
        </button>
      </Box>
    </div>
  );
}
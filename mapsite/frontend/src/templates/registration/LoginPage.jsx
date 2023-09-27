import React from "react";

class LoginPage extends React.Component {
  render() {
    // Access form data passed as props from Django template
    return (
      <div>
        <h1>Login Page</h1>
        <form method="post">
          {/* Render form fields */}
          <div className="form-group">
            <label htmlFor="id_username">Username:</label>
            <input type="text" name="username" id="id_username" required />
          </div>

          <div className="form-group">
            <label htmlFor="id_password">Password:</label>
            <input type="password" name="password" id="id_password" required />
          </div>

          <button type="submit">Log In</button>
        </form>
      </div>
    );
  }
}

export default LoginPage;

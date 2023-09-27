import React from 'react';
import axios from 'axios';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      error: ''
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    axios.post('http://127.0.0.1:8000/login', { username, password })
      .then((response) => {
        // Handle successful login
        console.log('Login successful:', response);
        // TODO: Redirect to main page
      })
      .catch((error) => {
        // Handle login error
        console.error('Login failed:', error);
        this.setState({ error: 'Login failed. Please check your credentials.' });
      });
  }

  render() {
    const { username, password, error } = this.state;

    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </div>
          <button type="submit">Login</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    );
  }
}

export default LoginPage;

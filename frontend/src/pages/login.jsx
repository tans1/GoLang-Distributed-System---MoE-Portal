import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import "../styles/login.css"

function Login() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password
    };

    // if (location.state?.from) {
    //   navigate(location.state.from);
    // } else {
    //   navigate("/");
    // }

  };
  return (
    <div className="body-container">
        <div className="login-container">
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          className="form-input"
          type="text"
          placeholder="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="form-label" htmlFor="password">
          Password
        </label>
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input className="form-submit" type="submit" value="Login" />
      </form>

      <div className="register-link-container">
        <div>Already don't have an account?</div>
        <Link to="/signup">Register</Link>
      </div>
    </div>
    </div>
  );
}

export default Login;
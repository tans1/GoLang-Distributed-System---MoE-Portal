import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import "../styles/signup.css";

function SignUp() {
  // const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setpassword] = useState("");
  const [password2, setpassword2] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("passwords do not match");
      return;
    }
    const data = {
      username: username,
      email: email,
      fullName: fullName,
      password: password
    };
  };
  return (
    <div className="body-container">
      <div className="signup-container">
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

          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            className="form-input"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="Full Name"
            name="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            onChange={(e) => setpassword(e.target.value)}
          />

          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="form-input"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={password2}
            onChange={(e) => setpassword2(e.target.value)}
          />

          <input className="form-submit" type="submit" value="Register" />
        </form>

        <div className="login-link-container">
          <div>Already have an account?</div>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;

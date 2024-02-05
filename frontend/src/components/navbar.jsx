import React, { useEffect, useState } from "react";
import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      let decodedToken = jwtDecode(token);
      if (decodedToken.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

  }, []);
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };
  return (
    <nav>
      <div className="logo--container">
        <Link to="/" className="link">
          <img src="Ministry_of_Education_(Ethiopia).png" alt="" />
          <span>Ministry Of Education</span>
        </Link>
      </div>
      <div className="nav-items">
        <div className="nav-item">
          <Link to="/result" className="link">
            {" "}
            see result{" "}
          </Link>
        </div>
        {isAdmin && (
          <div className="nav-item">
            <Link to="/upload" className="link">
              upload result
            </Link>
          </div>
        )}

        <div className="nav-item">
          <Link to="/petitions" className="link">
            {" "}
            petitions
          </Link>
        </div>
        <div className="nav-item">
          {isLoggedIn ? (
            <span onClick={handleLogout} className="link"> log out </span>
          ) : (
            <Link to="/login" className="link">
              {" "}
              login{" "}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

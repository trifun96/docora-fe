import React, { useState, useEffect, useRef } from "react";
import DocoraLogo from "../logoDocora";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../api/api";

const Header = ({ role, setRole, userName, setProfile }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setRole(null);
      setProfile(null)
      localStorage.removeItem("user");
      navigate("/docora-fe/login");
    } catch (error) {
      console.error("Greška pri odjavi:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="landing-header">
      <div className="header-content">
        <div className="logo-container">
          <DocoraLogo />
        </div>

        {role && userName && (
          <div className="user-dropdown" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
         {userName} ▼
            </button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li onClick={handleLogout} className="logout-btn">
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

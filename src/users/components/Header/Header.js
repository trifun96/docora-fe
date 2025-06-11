import React, { useState, useEffect, useRef } from 'react';
import DocoraLogo from '../logoDocora';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser)); // ✅ sad je objekat sa .name itd.
    } catch (e) {
      console.error('Greška pri parsiranju usera iz localStorage:', e);
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ili 'user'
    setUser(null);
    // Možeš dodatno da redirectuješ na login stranu ako koristiš react-router
    navigate('/docora-fe/login');
  };

  // Zatvaranje dropdowna klikom van
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

return (
 <header className="landing-header">
  <div className="header-content">
    <div className="logo-container">
      <DocoraLogo />
    </div>

    {user && (
      <div className="user-dropdown" ref={dropdownRef}>
        <button
          className="dropdown-toggle"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {user.name || 'Korisnik'} ▼
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
)

};

export default Header;

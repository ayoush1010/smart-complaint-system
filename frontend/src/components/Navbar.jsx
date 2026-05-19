import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🛡️</span>
          <span className="brand-text">SmartComplaint</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {user ? (
            <>
              <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/new-complaint" onClick={() => setMenuOpen(false)}>New Complaint</Link>
              <Link to="/complaints" onClick={() => setMenuOpen(false)}>All Complaints</Link>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

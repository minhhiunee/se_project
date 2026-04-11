import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isAuthenticated, logout, ready } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand-link">
        Ecommerce
      </Link>
      <div className="nav-links">
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        {!ready ? null : isAuthenticated ? (
          <>
            <span className="nav-user" title={user?.email}>
              {user?.name || user?.email}
            </span>
            <button type="button" className="nav-logout" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

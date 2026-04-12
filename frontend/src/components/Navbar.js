import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

function IconCart() {
  return (
    <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
      />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="nav-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  );
}

function Navbar() {
  const { user, isAuthenticated, logout, ready } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNavSearch(keyword) {
    setMobileOpen(false);
    navigate("/products", { state: { q: keyword } });
  }

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main">
        <div className="navbar__top">
          <Link to="/" className="navbar__brand">
            <span className="navbar__logo">ShopWave</span>
          </Link>

          <div className="navbar__search-wrap">
            <SearchBar
              compact
              onSearch={handleNavSearch}
              placeholder="Search our catalog…"
            />
          </div>

          <div className="navbar__actions">
            <Link
              to="/cart"
              className="navbar__icon-btn"
              aria-label="Shopping cart"
            >
              <IconCart />
            </Link>
            {ready && isAuthenticated ? (
              <div className="navbar__user">
                <span className="navbar__user-icon" aria-hidden>
                  <IconUser />
                </span>
                <span className="navbar__user-name" title={user?.email}>
                  {user?.name || "Account"}
                </span>
              </div>
            ) : ready ? (
              <Link
                to="/login"
                className="navbar__icon-btn"
                aria-label="Sign in"
              >
                <IconUser />
              </Link>
            ) : null}

            <button
              type="button"
              className="navbar__menu-toggle"
              aria-expanded={mobileOpen}
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <div className={`navbar__links-row${mobileOpen ? " is-open" : ""}`}>
          <Link to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Link>
          <Link to="/products" onClick={() => setMobileOpen(false)}>
            Products
          </Link>
          {ready && isAuthenticated ? (
            <>
              <Link to="/checkout" onClick={() => setMobileOpen(false)}>
                Checkout
              </Link>
              <Link to="/orders" onClick={() => setMobileOpen(false)}>
                Orders
              </Link>
              <button
                type="button"
                className="nav-link-btn"
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
              >
                Log out
              </button>
            </>
          ) : ready ? (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                Register
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav 
      className="navbar" 
      style={{
        display: "flex",
        justifyContent: "space-between", /* Pushes logo left, links right */
        alignItems: "center",
        padding: "16px 40px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
      }}
    >
      <Link to="/" className="logo">
        <img
          src="/LOGO.png"
          alt="PARAKH - Legal Metrology Compliance Checker"
          style={{ height: "40px", objectFit: "contain" }}
        />
      </Link>

      <div className="nav-links" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <Link 
          to="/" 
          style={{ textDecoration: "none", color: "#4a5568", fontWeight: "600", fontSize: "1.05rem", transition: "color 0.2s" }}
        >
          Home
        </Link>
        <Link 
          to="/inspection" 
          style={{ textDecoration: "none", color: "#4a5568", fontWeight: "600", fontSize: "1.05rem", transition: "color 0.2s" }}
        >
          Inspection
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
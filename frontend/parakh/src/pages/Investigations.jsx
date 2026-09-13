import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, XCircle, Search, Filter } from "../components/Icons";

function Investigations() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const stored = localStorage.getItem("parakhHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored).reverse()); // newest first
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(search.toLowerCase()) || 
      item.id.toLowerCase().includes(search.toLowerCase());
    
    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "COMPLIANT") return matchesSearch && item.isCompliant;
    if (statusFilter === "NON_COMPLIANT") return matchesSearch && !item.isCompliant;
    return matchesSearch;
  });

  const handleViewReport = (reportItem) => {
    // Re-populate session storage so Result page can display it
    sessionStorage.setItem("parakhProductName", reportItem.productName);
    if (reportItem.image) {
      sessionStorage.setItem("parakhImage", reportItem.image);
    } else {
      sessionStorage.removeItem("parakhImage");
    }
    sessionStorage.setItem("parakhComplianceReport", JSON.stringify(reportItem.reportData));
    navigate("/result");
  };

  return (
    <div className="site">
      <Navbar />

      <main className="page-container" style={{ minHeight: "80vh", fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        
        <div className="page-heading" style={{ marginBottom: "32px" }}>
          <div className="eyebrow" style={{ fontWeight: "700", letterSpacing: "1px" }}>INVESTIGATION RECORDS</div>
          <h1 style={{ fontWeight: "800" }}>Compliance History</h1>
          <p style={{ fontSize: "1.1rem" }}>View, search, and filter past inspection reports.</p>
        </div>

        {/* CONTROLS */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
            <input 
              type="text" 
              placeholder="Search by product name or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "14px 16px 14px 44px", border: "1px solid #000000",
                fontSize: "1rem", outline: "none", boxSizing: "border-box"
              }}
            />
          </div>
          <div style={{ position: "relative", minWidth: "200px" }}>
            <Filter size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#718096" }} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "100%", padding: "14px 16px 14px 44px", border: "1px solid #000000",
                fontSize: "1rem", outline: "none", appearance: "none", backgroundColor: "#ffffff", cursor: "pointer", boxSizing: "border-box"
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NON_COMPLIANT">Non-Compliant Only</option>
            </select>
          </div>
        </div>

        {/* LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredHistory.length === 0 ? (
            <div className="white-card" style={{ textAlign: "center", padding: "48px 24px", color: "#718096" }}>
              <p style={{ fontSize: "1.1rem" }}>No investigations found.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="white-card" 
                style={{ 
                  display: "flex", justifyContent: "space-between", alignItems: "center", 
                  padding: "24px", cursor: "pointer", transition: "0.2s",
                  border: "1px solid #000000",
                  flexWrap: "wrap", gap: "16px"
                }}
                onClick={() => handleViewReport(item)}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#ffffff"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: "1", minWidth: "250px" }}>
                  <div style={{ flexShrink: 0 }}>
                    {item.isCompliant ? (
                      <CheckCircle size={32} color="#000000" />
                    ) : (
                      <XCircle size={32} color="#000000" />
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#000000", marginBottom: "4px" }}>
                      {item.productName}
                    </h3>
                    <div style={{ display: "flex", gap: "12px", fontSize: "0.9rem", color: "#4a5568", fontFamily: "monospace" }}>
                      <span>{item.id}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "0.8rem", color: "#718096", fontWeight: "600", letterSpacing: "0.5px", display: "block" }}>SCORE</span>
                    <strong style={{ fontSize: "1.4rem", color: "#000000" }}>{item.score}%</strong>
                  </div>
                  <div>
                    <span 
                      style={{ 
                        fontWeight: "700", padding: "6px 12px", 
                        border: "1px solid #000000", fontSize: "0.85rem",
                        background: item.isCompliant ? "#000000" : "transparent",
                        color: item.isCompliant ? "#ffffff" : "#000000"
                      }}
                    >
                      {item.isCompliant ? "COMPLIANT" : "NON-COMPLIANT"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

export default Investigations;

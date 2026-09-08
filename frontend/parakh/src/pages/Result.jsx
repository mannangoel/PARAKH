import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  CheckCircle,
  XCircle,
  Download,
  ArrowLeft
} from "../components/Icons";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StepIndicator from "../components/StepIndicator";

function Result() {
  const productName = sessionStorage.getItem("parakhProductName") || "Packaged Commodity";
  const image = sessionStorage.getItem("parakhImage");

  const [attributes, setAttributes] = useState([
    { name: "MRP (Maximum Retail Price)", value: "₹120", pass: true, citation: "Compliant" },
    { name: "Net Weight / Net Quantity", value: "500 g", pass: true, citation: "Compliant" },
    { name: "Unit Sale Price (USP)", value: "₹240 / kg", pass: true, citation: "Compliant" },
    { name: "Manufacturer / Packer Details", value: "ABC Foods Pvt. Ltd.", pass: true, citation: "Compliant" },
    { name: "Batch / Lot Number", value: "Missing / Unclear", pass: false, citation: "Violation of LMPC Rule 6(1)" }
  ]);
  
  const [violations, setViolations] = useState([
    "Package missing complete Batch / Lot Number identification as required by Legal Metrology rules."
  ]);

  const [showRawOCR, setShowRawOCR] = useState(false);
  const [rawOcrData, setRawOcrData] = useState([]);
  const [remediationSteps, setRemediationSteps] = useState([
    "Ensure 'Batch / Lot Number' is clearly printed on the principal display panel.",
    "Verify font height meets the minimum 1.5mm standard as per Rule 7."
  ]);
  const [latency, setLatency] = useState("PaddleOCR (2.1s) → ChromaDB (0.1s) → Gemini (1.8s)");

  useEffect(() => {
    const reportRaw = sessionStorage.getItem("parakhComplianceReport");
    if (reportRaw) {
      try {
        const report = JSON.parse(reportRaw);
        
        if (report.attributes) {
          setAttributes(
            report.attributes.map(attr => ({
              name: attr.name,
              value: attr.extracted_text || attr.value,
              pass: attr.pass_status ?? attr.pass,
              citation: attr.violation_citation || attr.remark || (attr.pass_status ? "Compliant" : "Non-compliant")
            }))
          );
        }
        if (report.violations_and_citations) {
          setViolations(report.violations_and_citations);
        }
        if (report.raw_ocr_data) setRawOcrData(report.raw_ocr_data);
        if (report.remediation_plan) setRemediationSteps(report.remediation_plan);
        if (report.latency_metrics) setLatency(report.latency_metrics);

      } catch (e) {
        console.error("Failed to parse compliance report in Result page", e);
      }
    }
  }, []);

  const totalChecks = attributes.length;
  const passedChecks = attributes.filter((a) => a.pass).length;
  const failedChecks = totalChecks - passedChecks;
  const isCompliant = failedChecks === 0;

  return (
    <div className="site">
      <Navbar />

      <main className="page-container" style={{ fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
        <StepIndicator currentStep={3} />

        <div className="page-heading">
          <div className="eyebrow" style={{ fontWeight: "700", letterSpacing: "1px" }}>COMPLIANCE RESULT</div>
          <h1 style={{ fontWeight: "800" }}>Inspection completed</h1>
          <p style={{ fontSize: "1.1rem" }}>PARAKH has evaluated the mandatory package declarations.</p>
        </div>

        {/* RESULT HEADER */}
        <div className="result-banner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div className="result-status" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className={`result-status-icon ${isCompliant ? "pass-icon" : ""}`}>
              {isCompliant ? <CheckCircle size={29} /> : <XCircle size={29} />}
            </div>
            <div>
              <span style={{ fontWeight: "600", fontSize: "0.85rem", color: "#4a5568" }}>OVERALL STATUS</span>
              <h2 style={{ color: isCompliant ? "var(--green)" : "var(--red)", fontWeight: "800", margin: "4px 0", fontSize: "1.6rem" }}>
                {isCompliant ? "COMPLIANT" : "NON-COMPLIANT"}
              </h2>
              <p style={{ fontSize: "1.05rem", color: "#2d3748" }}>
                {isCompliant
                  ? "All mandatory declarations are present."
                  : `${failedChecks} mandatory attribute requires attention.`}
              </p>
            </div>
          </div>

          <div className="score-box" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "16px 24px",
            background: "#f7fafc",
            borderRadius: "8px",
            borderLeft: "4px solid #4299e1",
            minWidth: "180px"
          }}>
            <span style={{ fontWeight: "700", color: "#4a5568", fontSize: "0.85rem", letterSpacing: "0.5px" }}>
              COMPLIANCE SCORE
            </span>
            <strong style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1a202c", lineHeight: "1.1", marginTop: "4px" }}>
              {Math.round((passedChecks / totalChecks) * 100)}%
            </strong>
          </div>
        </div>

        {/* PRODUCT SUMMARY */}
        <div className="result-card">
          <div className="result-card-title">
            <div>
              <h2 style={{ fontWeight: "700" }}>Product Summary</h2>
              <p>Inspection record</p>
            </div>
          </div>

          <div className="product-summary">
            <div className="result-product-image">
              {image ? (
                <img src={image} alt={productName} style={{ maxHeight: "140px", objectFit: "contain", width: "100%", borderRadius: "8px" }} />
              ) : (
                <span>PRODUCT</span>
              )}
            </div>

            <div className="summary-info">
              <h3 style={{ fontWeight: "700", fontSize: "1.2rem" }}>{productName}</h3>
              <p style={{ fontFamily: "monospace", fontSize: "1rem" }}>Inspection ID: PRK-260908</p>

              <div className="summary-meta">
                <span style={{ fontWeight: "500" }}>08 Sep 2026</span>
                <span style={{ fontWeight: "500" }}>Package Inspection</span>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY NUMBERS */}
        <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <Summary title="Total Mandatory Attributes" value={totalChecks} />
          <Summary title="Verified / Present" value={passedChecks} type="success" />
          <Summary title="Missing / Unclear" value={failedChecks} type={failedChecks > 0 ? "danger" : "success"} />
        </div>

        {/* FIELD CHECKS */}
        <div className="result-card">
          <div className="result-card-title">
            <div>
              <h2 style={{ fontWeight: "700" }}>LMPC Statutory Compliance Audit</h2>
              <p>OCR extracted data & rule citation status</p>
            </div>
          </div>

          {attributes.map((attr) => (
            <CheckRow
              key={attr.name}
              name={attr.name}
              value={attr.value}
              pass={attr.pass}
              citation={attr.citation}
            />
          ))}
        </div>

        {/* VIOLATION & REMEDIATION CARD */}
        {!isCompliant && (
          <div className="violation-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* 1. Legal Violation Block */}
            <div>
              <div className="violation-heading" style={{ alignItems: "flex-start" }}>
                <XCircle size={28} style={{ marginTop: "4px" }} />
                <div>
                  <span style={{ fontWeight: "700", letterSpacing: "0.5px" }}>VIOLATION DETECTED</span>
                  <h2 style={{ fontWeight: "800", fontSize: "1.4rem", margin: "4px 0" }}>Mandatory declaration missing or illegible</h2>
                </div>
              </div>

              <div className="legal-reference" style={{ marginTop: "16px", padding: "16px", background: "#fff5f5", borderRadius: "8px", borderLeft: "4px solid #e53e3e" }}>
                <strong style={{ fontSize: "1.1rem", color: "#c53030", textTransform: "uppercase" }}>Legal Validation Reference</strong>
                {violations.map((v, i) => (
                  <p key={i} style={{ margin: "8px 0", fontSize: "1.15rem", lineHeight: "1.6", fontWeight: "600", color: "#2d3748" }}>
                    {v}
                  </p>
                ))}
              </div>
            </div>

            {/* 2. Automated Remediation Plan */}
            <div style={{ padding: "16px", background: "#ebf8fa", borderRadius: "8px", borderLeft: "4px solid #3182ce" }}>
              <strong style={{ fontSize: "1.1rem", color: "#2b6cb0", textTransform: "uppercase" }}>Automated Remediation Plan</strong>
              <ul style={{ margin: "8px 0 0 24px", color: "#2d3748", fontSize: "1.05rem", fontWeight: "600", lineHeight: "1.6" }}>
                {remediationSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: "6px" }}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* EVIDENCE */}
        <div className="result-card">
          <div className="result-card-title">
            <div>
              <h2 style={{ fontWeight: "700" }}>Evidence Image</h2>
              <p>Source image evaluated during inspection</p>
            </div>
          </div>

          <div className="evidence-area" style={{ padding: "16px", background: "#f7fafc", borderRadius: "8px" }}>
            {image ? (
              <img src={image} alt="Inspection evidence" style={{ maxHeight: "180px", objectFit: "contain", width: "100%", display: "block", margin: "0 auto", border: "1px solid #e2e8f0", padding: "8px", background: "#fff", borderRadius: "4px" }} />
            ) : (
              <div className="evidence-product">PRODUCT IMAGE</div>
            )}
          </div>
        </div>

        {/* RAW PADDLE-OCR TELEMETRY */}
        <div className="result-card" style={{ marginTop: "24px" }}>
          <div 
            className="result-card-title" 
            style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            onClick={() => setShowRawOCR(!showRawOCR)}
          >
            <div>
              <h2 style={{ fontWeight: "700" }}>Raw Vision Telemetry</h2>
              <p>PaddleOCR Extraction & Confidence Scores (Click to Expand)</p>
            </div>
            <strong style={{ fontSize: "1.5rem", color: "#4a5568", background: "#edf2f7", padding: "4px 12px", borderRadius: "8px" }}>
              {showRawOCR ? "−" : "+"}
            </strong>
          </div>

          {showRawOCR && (
            <div style={{ padding: "16px", background: "#1a202c", borderRadius: "8px", overflowX: "auto", marginTop: "12px" }}>
              <table style={{ width: "100%", color: "#e2e8f0", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #4a5568" }}>
                    <th style={{ padding: "8px", fontWeight: "600" }}>Detected Text</th>
                    <th style={{ padding: "8px", fontWeight: "600" }}>Confidence</th>
                    <th style={{ padding: "8px", fontWeight: "600" }}>Est. Height</th>
                  </tr>
                </thead>
                <tbody>
                  {rawOcrData.length > 0 ? (
                    rawOcrData.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #2d3748", fontFamily: "monospace" }}>
                        <td style={{ padding: "8px", color: "#9ae6b4" }}>"{item.text}"</td>
                        <td style={{ padding: "8px" }}>{(item.confidence * 100).toFixed(1)}%</td>
                        <td style={{ padding: "8px", color: "#fbd38d" }}>{item.height || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ padding: "8px", color: "#a0aec0" }}>
                        <pre style={{ margin: 0 }}>
{`// No backend OCR data found. Example fallback:
[
  { text: "MRP Rs.120", confidence: 0.98, height: "1.8mm" },
  { text: "Net Wt. 500g", confidence: 0.95, height: "1.5mm" }
]`}
                        </pre>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="result-actions" style={{ marginTop: "32px" }}>
          <button
            className="download-button"
            style={{ fontWeight: "700", fontSize: "1rem" }}
            onClick={() => alert("Report generation triggered.")}
          >
            <Download size={18} />
            Download Report
          </button>

          <Link to="/inspection" className="secondary-button" style={{ fontWeight: "700", fontSize: "1rem" }}>
            <ArrowLeft size={18} />
            New Inspection
          </Link>
        </div>

        {/* PIPELINE LATENCY FOOTER */}
        <div style={{ textAlign: "center", marginTop: "40px", padding: "16px", color: "#718096", fontSize: "0.85rem", borderTop: "1px solid #e2e8f0" }}>
          <span style={{ fontFamily: "monospace" }}>⏱ System Latency: {latency}</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Summary({ title, value, type }) {
  const valueColor = type === "success" ? "#2f855a" : type === "danger" ? "#c53030" : "#2d3748";

  return (
    <div className={`summary-box ${type || ""}`} style={{
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px 16px",
      background: "#fff",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      textAlign: "center"
    }}>
      <span style={{ fontWeight: "600", color: "#718096", fontSize: "0.95rem", marginBottom: "8px" }}>
        {title}
      </span>
      <strong style={{ fontSize: "2.5rem", fontWeight: "800", color: valueColor, lineHeight: "1" }}>
        {value}
      </strong>
    </div>
  );
}

function CheckRow({ name, value, pass, citation }) {
  return (
    <div className="check-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 0", borderBottom: "1px solid #edf2f7", gap: "20px" }}>
      <div className="check-name" style={{ display: "flex", alignItems: "flex-start", gap: "12px", flex: "1.6" }}>
        {pass ? (
          <CheckCircle size={22} className="pass-icon" style={{ marginTop: "3px", flexShrink: 0 }} />
        ) : (
          <XCircle size={22} className="fail-icon" style={{ marginTop: "3px", flexShrink: 0 }} />
        )}
        <div>
          <strong style={{ fontSize: "1.15rem", fontWeight: "700", color: "#1a202c", display: "block", marginBottom: "6px" }}>{name}</strong>
          {/* Increased font size, weight, and contrast for the citation rule text */}
          <p style={{ fontSize: "1.05rem", color: "#2d3748", margin: "0", lineHeight: "1.5", fontWeight: "600" }}>{citation}</p>
        </div>
      </div>

      <div className="check-value" style={{ flex: "1.2", textAlign: "right" }}>
        <span style={{ fontWeight: "700", color: "#1a202c", fontSize: "1.05rem", fontFamily: "monospace", display: "block", wordBreak: "break-word" }}>{value}</span>
      </div>

      <div style={{ flexShrink: 0, textAlign: "right" }}>
        <span className={pass ? "pass-label" : "fail-label"} style={{ fontWeight: "800", padding: "6px 14px", borderRadius: "20px", fontSize: "0.85rem", display: "inline-block" }}>
          {pass ? "PASS" : "FAIL"}
        </span>
      </div>
    </div>
  );
}

export default Result;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Check,
  LoaderCircle,
  ArrowRight
} from "../components/Icons";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StepIndicator from "../components/StepIndicator";

function Analysis() {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const image = sessionStorage.getItem("parakhImage");

  // Load the backend response stored during inspection
  const [attributes, setAttributes] = useState([]);

 useEffect(() => {
    const reportRaw = sessionStorage.getItem("parakhComplianceReport");
    if (reportRaw) {
      try {
        const report = JSON.parse(reportRaw);
        // Map backend 5 attributes to UI
        if (report.attributes) {
          const formattedAttributes = report.attributes.map(attr => ({
            name: attr.name,
            value: attr.value,
            pass: attr.pass_status
          }));
          setAttributes(formattedAttributes);
        }
      } catch (e) {
        console.error("Failed to parse compliance report", e);
      }
    }
  }, []);
  
  const stages = [
    "Image Preprocessing",
    "Declaration Region Detection",
    "PaddleOCR Text Extraction",
    "Font Height & Vector Lookup",
    "Legal Metrology Validation"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((previous) => {
        if (previous < stages.length) {
          return previous + 1;
        }
        return previous;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [stages.length]);

  return (
    <div className="site">
      <Navbar />

      <main className="page-container">
        <StepIndicator currentStep={2} />

        <div className="page-heading">
          <div className="eyebrow">AI ANALYSIS</div>
          <h1>Analysing package declarations</h1>
          <p>PARAKH is processing the image via PaddleOCR and evaluating rules via ChromaDB/Gemini.</p>
        </div>

        <div className="analysis-layout">
          {/* IMAGE */}
          <div className="white-card analysis-image-card">
            <div className="card-topline">
              <strong>PRODUCT IMAGE</strong>
              <span>ANALYSIS</span>
            </div>

            <div className="analysis-image">
              {image ? (
                <img src={image} alt="Product being analysed" />
              ) : (
                <div className="demo-product">PRODUCT</div>
              )}
            </div>
          </div>

          {/* PROCESS */}
          <div className="white-card">
            <div className="card-topline">
              <strong>PROCESSING PIPELINE</strong>
              <span className="processing-text">
                {currentStage >= stages.length ? "COMPLETE" : "PROCESSING"}
              </span>
            </div>

            <div className="stage-list">
              {stages.map((stage, index) => {
                const completed = index < currentStage;
                const active = index === currentStage && currentStage < stages.length;

                return (
                  <div className="analysis-stage" key={stage}>
                    <div
                      className={`stage-circle ${completed ? "completed" : active ? "active" : ""}`}
                    >
                      {completed ? (
                        <Check size={15} />
                      ) : active ? (
                        <LoaderCircle size={15} className="spin" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div>
                      <strong>{stage}</strong>
                      <span>
                        {completed ? "Completed" : active ? "In progress" : "Waiting"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* EXTRACTED DATA */}
        <div className="analysis-bottom" style={{ gridTemplateColumns: "1fr" }}>
          <div className="white-card">
            <div className="card-topline">
              <strong>EXTRACTED ATTRIBUTES & DECLARATIONS</strong>
              <span>{currentStage >= 3 ? "EXTRACTED" : "PROCESSING"}</span>
            </div>

            <div className="data-grid">
              {attributes.map((attr, idx) => (
                <Data key={idx} title={attr.name} value={attr.value} pass={attr.pass} />
              ))}
            </div>
          </div>
        </div>

        {/* LEGAL VALIDATION BAR */}
        <div className="legal-card">
          <div>
            <strong>Legal Metrology Screening</strong>
            <p>Cross-referencing OCR text and font heights against LMPC Rules.</p>
          </div>

          <div className="legal-bar">
            <span
              style={{
                width: `${Math.min((currentStage / stages.length) * 100, 100)}%`
              }}
            />
          </div>
        </div>

        <button
          className="result-button"
          disabled={currentStage < stages.length}
          onClick={() => navigate("/result")}
        >
          View Compliance Result
          <ArrowRight size={18} />
        </button>
      </main>

      <Footer />
    </div>
  );
}

function Data({ title, value, pass }) {
  return (
    <div className="data-item">
      <span>{title}</span>
      <strong style={{ color: pass === false ? "#e53e3e" : "#2b6cb0" }}>{value}</strong>
    </div>
  );
}

export default Analysis;
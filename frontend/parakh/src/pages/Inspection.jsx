import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Upload,
  Camera,
  ArrowRight,
  Package,
  ShoppingBag
} from "../components/Icons";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StepIndicator from "../components/StepIndicator";

function Inspection() {
  const navigate = useNavigate();
  const [inspectionType, setInspectionType] = useState("physical");
  const [imageFile, setImageFile] = useState(null); // Stores raw File object for API
  const [imagePreview, setImagePreview] = useState(null); // Stores display URL
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  function handleImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    setImageFile(file); // Keep raw file for backend upload
    const imageURL = URL.createObjectURL(file);
    setImagePreview(imageURL);
    sessionStorage.setItem("parakhImage", imageURL);
  }

  async function startAnalysis() {
    if (!imageFile) return;

    setLoading(true);
    setErrorMsg("");

    sessionStorage.setItem("parakhProductName", productName || "Packaged Commodity");
    sessionStorage.setItem("parakhInspectionType", inspectionType);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      // Call FastAPI backend running on port 8000
      const response = await fetch("http://localhost:8000/api/analyze-label", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process label through the backend pipeline.");
      }

      const complianceData = await response.json();
      
      // Store the real Gemini RAG and PaddleOCR response in sessionStorage for the Analysis/Result pages
      sessionStorage.setItem("parakhComplianceReport", JSON.stringify(complianceData));
      
      navigate("/analysis");
    } catch (err) {
      console.error(err);
      setErrorMsg("Error connecting to backend API. Ensure uvicorn is running.");
      setLoading(false);
    }
  }

  return (
    <div className="site">
      <Navbar />

      <main className="page-container">
        <StepIndicator currentStep={1} />

        <div className="page-heading">
          <div className="eyebrow">PRODUCT INSPECTION</div>
          <h1>Start a new inspection</h1>
          <p>Provide the product image to analyze its mandatory package declarations.</p>
        </div>

        <div className="inspection-layout">
          {/* LEFT CARD */}
          <div className="white-card">
            <h2>Inspection Type</h2>
            <p className="card-description">Select how the product is being inspected.</p>

            <div className="type-options">
              <button
                className={`type-option ${inspectionType === "physical" ? "selected" : ""}`}
                onClick={() => setInspectionType("physical")}
              >
                <Package size={20} />
                <div>
                  <strong>Physical Product</strong>
                  <span>Product available for inspection</span>
                </div>
              </button>

              <button
                className={`type-option ${inspectionType === "ecommerce" ? "selected" : ""}`}
                onClick={() => setInspectionType("ecommerce")}
              >
                <ShoppingBag size={20} />
                <div>
                  <strong>E-Commerce Product</strong>
                  <span>Product listing or online image</span>
                </div>
              </button>
            </div>

            <div className="form-divider" />

            <h2>Product Image</h2>
            <p className="card-description">Upload a clear image showing product package declarations.</p>

            {!imagePreview ? (
              <label className="upload-area">
                <Upload size={28} />
                <strong>Upload product image</strong>
                <span>JPG, PNG or WEBP</span>
                <input type="file" accept="image/*" onChange={handleImage} />
              </label>
            ) : (
              <div className="uploaded-image">
                <img src={imagePreview} alt="Uploaded product" />
                <button onClick={() => { setImagePreview(null); setImageFile(null); }}>Change image</button>
              </div>
            )}

            <button className="capture-button">
              <Camera size={17} />
              Capture Image
            </button>
          </div>

          {/* RIGHT CARD */}
          <div className="white-card">
            <h2>Product Details</h2>
            <p className="card-description">Basic label for the inspection record.</p>

            <label className="form-label">Product Name / Title</label>
            <input
              className="form-input"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Packaged Commodity Name"
            />

            <div className="inspection-details">
              <div>
                <span>DATE</span>
                <strong>08 Sep 2026</strong>
              </div>
              <div>
                <span>INSPECTION ID</span>
                <strong>PRK-260908</strong>
              </div>
            </div>

            {errorMsg && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "8px" }}>{errorMsg}</p>}

            <button
              className="analysis-button"
              disabled={!imageFile || loading}
              onClick={startAnalysis}
            >
              {loading ? "Processing Pipeline..." : "Analyze Product"}
              <ArrowRight size={18} />
            </button>

            {!imageFile && (
              <p className="button-hint">Upload a product image to continue.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Inspection;
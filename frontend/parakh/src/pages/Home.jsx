import React from "react";
import { Link } from "react-router-dom";

import {
  ScanLine,
  Ruler,
  FileCheck,
  FileText,
  ArrowRight,
  Check
} from "../components/Icons";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="site">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">PACKAGE COMPLIANCE SYSTEM</div>
          <h1>
            Making package
            <br />
            <span>compliance simpler.</span>
          </h1>
          <p>
            PARAKH is an intelligent inspection system designed to analyse packaged commodities,
            detect mandatory declarations, and assist with Legal Metrology compliance checks.
          </p>

          <Link to="/inspection" className="primary-button">
            <ScanLine size={18} />
            Start Inspection
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">
          <div className="inspection-window">
            <div className="window-top">
              <span>PARAKH INSPECTION</span>
              <span className="ready">● READY</span>
            </div>

            <div className="product-demo">
              <div className="product-pack">
                <small>PACKAGED</small>
                <strong>PRODUCT</strong>
                <span>MANDATORY LABELS</span>
              </div>
            </div>

            <div className="demo-data">
              <div>
                <span>MRP</span>
                <strong>Required</strong>
              </div>
              <div>
                <span>Net Qty</span>
                <strong>Required</strong>
              </div>
              <div>
                <span>Status</span>
                <strong className="demo-pass">Ready</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section">
        <div className="section-heading">
          <div className="eyebrow">KEY CAPABILITIES</div>
          <h2>What PARAKH checks</h2>
          <p>A focused workflow for verifying mandatory package declarations.</p>
        </div>

        <div className="feature-grid">
          <Feature
            icon={<ScanLine size={20} />}
            title="Declaration Detection"
            text="Identify mandatory text zones on the product packaging automatically."
          />
          <Feature
            icon={<Ruler size={20} />}
            title="OCR Extraction"
            text="Extract MRP, Net Weight, USP, Manufacturer, and Batch details."
          />
          <Feature
            icon={<FileCheck size={20} />}
            title="Legal Validation"
            text="Validate detected attributes against Legal Metrology guidelines."
          />
          <Feature
            icon={<FileText size={20} />}
            title="Report Generation"
            text="Present findings, field statuses, and compliance evidence clearly."
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="process-section">
        <div className="section-heading">
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>From image to inspection result</h2>
        </div>

        <div className="process-grid">
          <Process number="01" title="Upload Image" text="Capture or upload the package image." />
          <Process number="02" title="Detection" text="Locate mandatory text declarations." />
          <Process number="03" title="Extraction" text="Extract the 5 primary package attributes." />
          <Process number="04" title="Validation" text="Verify completeness against Legal Metrology rules." />
        </div>
      </section>

      {/* WHAT WE CHECK */}
      <section className="section">
        <div className="check-section">
          <div className="check-intro">
            <div className="eyebrow">WHAT WE CHECK</div>
            <h2>5 Mandatory Declarations</h2>
            <p>Verification focuses exclusively on the key attributes required by inspection officers.</p>
          </div>

          <div className="check-list">
            <CheckItem text="Maximum Retail Price (MRP)" />
            <CheckItem text="Net Weight / Net Quantity" />
            <CheckItem text="Unit Sale Price (USP)" />
            <CheckItem text="Manufacturer / Packer Details" />
            <CheckItem text="Batch / Lot Number" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div>
          <div className="eyebrow">BEGIN AN INSPECTION</div>
          <h2>Check a packaged commodity.</h2>
          <p>Upload a product image and start analyzing mandatory package attributes.</p>
        </div>

        <Link to="/inspection" className="primary-button">
          Start Inspection
          <ArrowRight size={17} />
        </Link>
      </section>

      <Footer />
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Process({ number, title, text }) {
  return (
    <div className="process-item">
      <span className="process-number">{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div className="check-item">
      <Check size={16} />
      <span>{text}</span>
    </div>
  );
}

export default Home;
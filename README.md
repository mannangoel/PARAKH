#  PARAKH: AI-Powered Legal Metrology Compliance Engine

PARAKH is an intelligent, production-grade inspection system designed to automatically analyze packaged commodities, detect mandatory declarations, and validate strict compliance against the Legal Metrology (Packaged Commodities) Rules, 2011.

---

##  Features

* **High-Fidelity Optical Character Recognition**: Utilizes **PaddleOCR** to extract label text, bounding box coordinates, and calculate exact physical font heights (in mm) based on image DPI. 
* **Legal RAG Pipeline**: Uses **ChromaDB** to vectorize and retrieve relevant legal clauses from LMPC 2011 documents, ensuring AI hallucinations are eliminated. 
* **LLM Reasoning & Remediation**: Powered by **Google Gemini**, the engine evaluates the OCR data against retrieved legal context to provide a definitive `PASS`/`FAIL` for 5 mandatory attributes (MRP, Net Weight, USP, Manufacturer, Batch Number). 
* **Automated Remediation**: Generates actionable, step-by-step instructions to correct label violations. 
* **Developer Telemetry**: Exposes raw vision model outputs, confidence scores, and pipeline latency directly in the UI for complete audit transparency. 

---

##  Tech Stack

* **Frontend**: React, Vite, Node.js (with custom Flexbox UI & interactive telemetry). 
* **Backend**: FastAPI, Python, Pydantic (strictly typed schemas).
* **AI & Vision**: PaddleOCR, Gemini API, RAG Pipeline
* **Vector Database**: ChromaDB (Local persistence).
* 

---

## Local Setup & Installation

### 1. Backend (Python)
Ensure you have Python 3.10+ installed.

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/PARAKH.git
cd PARAKH

# Create and activate virtual environment
python -m venv parakh_env
parakh_env\Scripts\activate  # On Windows

# Install dependencies
pip install fastapi uvicorn paddleocr chromadb google-genai python-docx langchain-text-splitters pydantic python-multipart
```

Configure Environment Variables:
Create a `.env` file in the root directory and add: 
```env
GEMINI_API_KEY="your_api_key_here"
```

Run the FastAPI server: 
```bash
uvicorn api:app --reload
```

### 2. Frontend (React / Vite)
Open a new terminal window. 

```bash
cd frontend/parakh

# Install Node dependencies (using --no-optional to bypass Windows binary bugs on Node v25)
npm install --no-optional

# Start the development server
npm run dev
```

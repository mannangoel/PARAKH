#  PARAKH: AI-Powered Legal Metrology Compliance Engine

PARAKH is an intelligent, production-grade inspection system designed to automatically analyze packaged commodities, detect mandatory declarations, and validate strict compliance against the Legal Metrology (Packaged Commodities) Rules, 2011.

---

##  Features

* **High-Fidelity Optical Character Recognition**: Utilizes **PaddleOCR** to extract label text, bounding box coordinates, and calculate exact physical font heights (in mm) based on image DPI. [cite: 1]
* **Legal RAG Pipeline**: Uses **ChromaDB** to vectorize and retrieve relevant legal clauses from LMPC 2011 documents, ensuring AI hallucinations are eliminated. [cite: 1]
* **LLM Reasoning & Remediation**: Powered by **Google Gemini**, the engine evaluates the OCR data against retrieved legal context to provide a definitive `PASS`/`FAIL` for 5 mandatory attributes (MRP, Net Weight, USP, Manufacturer, Batch Number). [cite: 1]
* **Automated Remediation**: Generates actionable, step-by-step instructions to correct label violations. [cite: 1]
* **Developer Telemetry**: Exposes raw vision model outputs, confidence scores, and pipeline latency directly in the UI for complete audit transparency. [cite: 1]

---

##  Tech Stack

* **Frontend**: React, Vite, Node.js (with custom Flexbox UI & interactive telemetry). [cite: 1]
* **Backend**: FastAPI, Python, Pydantic (strictly typed schemas). [cite: 1]
* **AI & Vision**: PaddleOCR, Google GenAI SDK (Gemini), LangChain Text Splitters. [cite: 1]
* **Vector Database**: ChromaDB (Local persistence). [cite: 1]

---

## Local Setup & Installation

### 1. Backend (Python)
Ensure you have Python 3.10+ installed. [cite: 1]

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
Create a `.env` file in the root directory and add: [cite: 1]
```env
GEMINI_API_KEY="your_api_key_here"
```

Run the FastAPI server: [cite: 1]
```bash
uvicorn api:app --reload
```

### 2. Frontend (React / Vite)
Open a new terminal window. [cite: 1]

```bash
cd frontend/parakh

# Install Node dependencies (using --no-optional to bypass Windows binary bugs on Node v25)
npm install --no-optional

# Start the development server
npm run dev
```
# PARAKH - Legal Metrology Compliance Checker

PARAKH is an automated inspection pipeline that uses OCR (PaddleOCR) and LLMs (Google Gemini API via RAG) to verify if packaged commodities comply with Legal Metrology Packaging Rules.

## Features
- **Frontend**: A React/Vite minimalist UI dashboard.
- **Backend**: A FastAPI server running OCR extraction and RAG-based compliance evaluation.
- **Features**: Live AI inspection, PDF report generation, and historical inspection tracking.

## Prerequisites
- Python 3.12+
- Node.js v18+
- [uv](https://github.com/astral-sh/uv) (for ultra-fast Python package management)
- A valid Google Gemini API Key

## Setup Instructions

### 1. Backend Setup
Navigate to the root directory and set up the Python environment:
```bash
# Create a virtual environment and sync dependencies using uv
uv venv .venv
.\.venv\Scripts\activate

# Install dependencies
uv pip install -r requirements.txt
# Or use uv sync if uv.lock is present:
uv sync
```

Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 2. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend/parakh
npm install
```

## Running the Application

You need two terminal windows open.

**Terminal 1 (Backend - FastAPI)**
```bash
.\.venv\Scripts\activate
uvicorn api:app --reload
# Runs on http://127.0.0.1:8000
```

**Terminal 2 (Frontend - React/Vite)**
```bash
cd frontend/parakh
npm run dev
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser to access the PARAKH dashboard.

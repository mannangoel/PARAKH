import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Base Directories
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
PERSIST_DIR = BASE_DIR / "chroma_db"

# Master Rules Folder Path
RULES_DIR = DATA_DIR / "SIH Dataset" / "Packaged Commodities"

# Model Configurations
EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
GEMINI_MODEL_NAME = "gemini-3.5-flash"

# RAG Chunking Settings
CHUNK_SIZE = 600
CHUNK_OVERLAP = 100
TOP_K_RESULTS = 3

# Gemini API Key fallback
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
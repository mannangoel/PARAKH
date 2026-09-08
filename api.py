import os
import json
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# Import pipeline modules
from run_ocr import read_label
from src.vectorstore import VectorStoreManager
from src.rag_engine import LMPCRagEngine

app = FastAPI(title="PARAKH LMPC API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Initializing RAG Engine...")
VectorStoreManager().index_documents()
rag_engine = LMPCRagEngine()
print("RAG Engine Ready.")

@app.post("/api/analyze-label")
async def analyze_label(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        start_time = time.time()
        
        # 1. Run Vision OCR & Track Latency
        t_ocr_start = time.time()
        ocr_structured_output = read_label(temp_path)
        ocr_duration = time.time() - t_ocr_start
        
        if not ocr_structured_output:
            return {"error": "OCR failed to detect any text on the label."}
            
        # 2. Run RAG Compliance Evaluation & Track Latency
        t_rag_start = time.time()
        compliance_report = rag_engine.evaluate_product_compliance(ocr_structured_output)
        rag_duration = time.time() - t_rag_start
        
        total_duration = time.time() - start_time
        
        # 3. Format Raw OCR Telemetry for the Frontend Table
        formatted_ocr_data = [
            {
                "text": item.get("text", ""),
                "confidence": item.get("confidence", 0.0),
                "height": f"{item.get('font_height_mm', 0)}mm"
            }
            for item in ocr_structured_output
        ]
        
        # Attach hackathon-ready metrics
        compliance_report["raw_ocr_data"] = formatted_ocr_data
        compliance_report["latency_metrics"] = f"PaddleOCR ({ocr_duration:.1f}s) → ChromaDB/Gemini-RAG ({rag_duration:.1f}s) [Total: {total_duration:.1f}s]"
        
        return compliance_report
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise e
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
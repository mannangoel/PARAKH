import json
import sys
from pathlib import Path
from paddleocr import PaddleOCR

# Import your RAG components
from src.vectorstore import VectorStoreManager
from src.rag_engine import LMPCRagEngine

# Initialize PaddleOCR with enable_mkldnn=False to fix the PIR/oneDNN crash
ocr = PaddleOCR(
    lang="en",
    use_textline_orientation=True,  
    text_det_limit_side_len=2048,        
    text_det_thresh=0.3,              
    text_det_box_thresh=0.5,          
    text_det_unclip_ratio=1.6,
    enable_mkldnn=False  # <--- THIS STOPS THE CRASH
)     

def read_label(image_path: str, image_dpi: int = 300) -> list:
    results = ocr.predict(image_path)

    lines = []
    for res in results:               
        texts = res["rec_texts"]
        scores = res["rec_scores"]
        boxes = res["rec_boxes"]      
        
        for text, score, box in zip(texts, scores, boxes):
            clean_box = [round(float(v), 1) for v in box]
            y_coords = [coord[1] for coord in box] if isinstance(box[0], (list, tuple)) else [clean_box[1], clean_box[3]]
            pixel_height = abs(max(y_coords) - min(y_coords))
            
            height_mm = round((pixel_height / image_dpi) * 25.4, 2)
            
            lines.append({
                "field": "Scanned Label Text",
                "text": text,
                "font_height_mm": height_mm,
                "confidence": round(float(score), 4),
                "box_coords": clean_box
            })
            
    return lines


if __name__ == "__main__":
    IMAGE_PATH = sys.argv[1] if len(sys.argv) > 1 else "labelimage.jpg"
    
    if not Path(IMAGE_PATH).is_file():
        raise FileNotFoundError(f"Image not found: '{IMAGE_PATH}'. Please place it in C:\\courses\\SIH.")

    print(f" Step 1: Running PaddleOCR Vision Pipeline on {IMAGE_PATH}...")
    ocr_structured_output = read_label(IMAGE_PATH)

    print(f"\n--- Extracted Text & Font Sizes ---")
    for line in ocr_structured_output:
        print(f"[{line['font_height_mm']}mm] ({line['confidence']:.2f}) -> {line['text']}")

    print("\n Step 2: Indexing Rules & Initializing RAG Engine...")
    vector_manager = VectorStoreManager()
    vector_manager.index_documents()
    rag_engine = LMPCRagEngine()
    
    print("\n Step 3: Evaluating Compliance via Gemini RAG...")
    compliance_report = rag_engine.evaluate_product_compliance(ocr_structured_output)
    
    print("\n Final Compliance Report:")
    print(json.dumps(compliance_report, indent=2))
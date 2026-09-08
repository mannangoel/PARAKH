import json
from src.vectorstore import VectorStoreManager
from src.rag_engine import LMPCRagEngine

def test_pipeline():
    print("Step 1: Initializing Vector Store & Indexing .docx Rules...")
    vector_manager = VectorStoreManager()
    vector_manager.index_documents()

    print("\nStep 2: Initializing Gemini RAG Engine...")
    rag_engine = LMPCRagEngine()

    # --- TEST CASE 1: Compliant Label ---
    print("\n" + "="*50)
    print("RUNNING TEST 1: Fully Compliant Label Text")
    print("="*50)
    
    sample_ocr_pass = """
        PARAKH Tasty Snacks
        Net Quantity: 500g [Font Height: 1.5mm]
        MRP: Rs. 50.00 [Font Height: 3.0mm]
        Month & Year of Mfg: 01/2026 [Font Height: 1.0mm]
        Manufactured by: XYZ Corp, Mumbai [Font Height: 2.0mm]
        """

    print("Feeding sample OCR text to RAG...")
    result_pass = rag_engine.evaluate_product_compliance(sample_ocr_pass)
    print("\n TEST 1 VERDICT:")
    print(json.dumps(result_pass, indent=2))

    # --- TEST CASE 2: Non-Compliant Label ---
    print("\n" + "="*50)
    print(" RUNNING TEST 2: Non-Compliant Label Text (Missing MRP & Mfg Date)")
    print("="*50)

    sample_ocr_fail = """
    PARAKH Tasty Snacks
    Net Quantity: 500g
    Manufactured by: XYZ Corp, Mumbai
    """

    print("Feeding deficient OCR text to RAG...")
    result_fail = rag_engine.evaluate_product_compliance(sample_ocr_fail)
    print("\n TEST 2 VERDICT:")
    print(json.dumps(result_fail, indent=2))

if __name__ == "__main__":
    test_pipeline()
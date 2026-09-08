import streamlit as st
from PIL import Image
 

from src.vectorstore import VectorStoreManager
from src.rag_engine import LMPCRagEngine


st.set_page_config(page_title="PARAKH: Integrated LMPC Scanner", layout="wide")

@st.cache_resource
def init_rag_system():
    vector_manager = VectorStoreManager()
    vector_manager.index_documents()
    return LMPCRagEngine()

try:
    rag_engine = init_rag_system()
except Exception as e:
    st.error(f"RAG Initialization failed: {e}")
    st.stop()

st.title("🛡️ PARAKH: End-to-End Compliance Scanner")
st.markdown("Upload a product label to run Vision OCR and Legal RAG Evaluation.")
st.divider()

uploaded_file = st.file_uploader("Upload Product Label Image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    # Display the uploaded image
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("1. Scanned Image")
        image = Image.open(uploaded_file).convert('RGB')
        st.image(image, use_container_width=True)
    
    with col2:
        st.subheader("2. OCR Pipeline Extraction")
        with st.spinner("Extracting text via Vision Pipeline..."):
            # --- HANDOFF POINT: Pass the image to their OCR function ---
            extracted_text = run_ocr(uploaded_file)
            # -----------------------------------------------------------
            
            st.info("**Extracted Text:**")
            st.write(extracted_text)

    st.divider()
    st.subheader("3. PARAKH RAG Legal Assessment")
    
    if extracted_text:
        with st.spinner("Querying ChromaDB & Evaluating Legal Rules..."):
            # --- HANDOFF POINT: Pass their text to your RAG engine ---
            assessment_json = rag_engine.evaluate_product_compliance(extracted_text)
            # ---------------------------------------------------------
            
            if assessment_json.get("is_compliant"):
                st.success(" **PASS: Product is fully compliant with LMPC Rules.**")
            else:
                st.error(" **FAIL: Product violates LMPC mandatory declarations.**")
            
            col_a, col_b = st.columns(2)
            
            with col_a:
                st.markdown("** Detected Data**")
                for key, val in assessment_json.get("detected_declarations", {}).items():
                    st.markdown(f"- **{key}**: {val}")
                    
            with col_b:
                st.markdown("** Missing Declarations**")
                for item in assessment_json.get("missing_declarations", []):
                    st.markdown(f"- ⚠️ {item}")
                    
            st.divider()
            st.markdown("** Official Legal Violations**")
            for violation in assessment_json.get("violations_and_citations", []):
                st.warning(violation)
import json
from typing import Union
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

from src.config import GEMINI_MODEL_NAME, GEMINI_API_KEY
from src.vectorstore import VectorStoreManager

class DeclarationAttribute(BaseModel):
    name: str = Field(description="Name of the attribute (e.g., 'MRP', 'Net Weight / Qty', 'Unit Sale Price (USP)', 'Manufacturer / Packer', 'Batch / Lot Number')")
    extracted_text: str = Field(description="The exact text or value extracted by OCR, or 'Missing / Unclear'")
    pass_status: bool = Field(description="True if compliant, False if missing or violating rules")
    violation_citation: str = Field(description="Specific LMPC rule violation text, or 'Fully compliant with LMPC Rules'")

class ComplianceReport(BaseModel):
    is_compliant: bool = Field(description="True only if all attributes pass.")
    attributes: list[DeclarationAttribute] = Field(description="The 5 mandatory attributes with their OCR-extracted values and rule citations.")
    violations_and_citations: list[str] = Field(description="Summary of legal infractions citing specific LMPC sub-rules.")
    remediation_plan: list[str] = Field(description="Actionable steps or corrections required to make the packaging fully compliant with Legal Metrology rules.")
    
class LMPCRagEngine:
    def __init__(self):
        self.ai_client = genai.Client(api_key=GEMINI_API_KEY)
        self.search_engine = VectorStoreManager()

    def evaluate_product_compliance(self, ocr_input: Union[str, dict, list], product_category: str = "Packaged Commodity") -> dict:
        if isinstance(ocr_input, (dict, list)):
            ocr_text_str = json.dumps(ocr_input, indent=2)
        else:
            ocr_text_str = str(ocr_input)

        search_query = f"Mandatory declarations rules for {product_category} matching text: {ocr_text_str[:200]}"
        
        retrieved_rules = self.search_engine.search_relevant_rules(search_query)
        context_str = "\n\n".join([f"[Legal Clause]: {r['content']}" for r in retrieved_rules])
        
        prompt = f"""
You are the PARAKH Legal Metrology Compliance Engine. 
Evaluate the Extracted OCR Data against the retrieved LMPC Rules for these exact 5 mandatory declarations:
1. MRP (Maximum Retail Price)
2. Net Weight / Qty (and check font height vs Rule 7 tables)
3. Unit Sale Price (USP)
4. Manufacturer / Packer Details
5. Batch / Lot Number

EXTRACTED OCR DATA FROM PRODUCT LABEL:
\"\"\"{ocr_text_str}\"\"\"

RETRIEVED LEGAL METROLOGY RULES (LMPC 2011 & Amendments):
\"\"\"{context_str}\"\"\"

Task:
1. Evaluate each of the 5 attributes. Provide its detected value, pass_status, and violation citations.
2. Provide a clear remediation_plan list containing actionable steps to fix any non-compliant or missing elements.
"""

        response = self.ai_client.models.generate_content(
            model=GEMINI_MODEL_NAME,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json",
                response_schema=ComplianceReport,
            )
        )
        
        return json.loads(response.text)
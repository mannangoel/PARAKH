from sentence_transformers import SentenceTransformer
from src.config import EMBEDDING_MODEL_NAME

class Embedding:
    def __init__(self, model_name:str = EMBEDDING_MODEL_NAME):
        self.model = SentenceTransformer(model_name)
        
    def embed_texts(self, texts: list[str])-> list[list[float]]:
        embeddings = self.model.encode(texts, convert_to_numpy = True )
        return embeddings.tolist()
    
    def embed_query(self, query: str)->list[float]:
        embedding = self.model.encode(query, convert_to_numpy = True)
        return embedding.tolist()
    
from src.embeddings import Embedding
from src.vectorstore import VectorStoreManager
from src.config import TOP_K_RESULTS

class LMPCSearchEngine:
    def __init__(self):
        self.embedding_service = Embedding()
        self.vector_manager = VectorStoreManager()

    def search_relevant_rules(self, query: str, top_k: int = TOP_K_RESULTS) -> list[dict]:
        query_embedding = self.embedding_service.embed_query(query)
        
        results = self.vector_manager.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        retrieved_docs = []
        if results and "documents" in results and results["documents"]:
            docs = results["documents"][0]
            metadatas = results["metadatas"][0] if "metadatas" in results else [{}] * len(docs)
            distances = results["distances"][0] if "distances" in results else [0.0] * len(docs)
            
            for doc, meta, dist in zip(docs, metadatas, distances):
                retrieved_docs.append({
                    "content": doc,
                    "metadata": meta,
                    "similarity_score": round(1.0 - dist, 4)
                })
                
        return retrieved_docs
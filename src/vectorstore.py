from pathlib import Path
import docx
from langchain_text_splitters import RecursiveCharacterTextSplitter
from src.config import PERSIST_DIR, CHUNK_SIZE, CHUNK_OVERLAP, RULES_DIR
from src.embeddings import Embedding
import chromadb

class VectorStoreManager:
    def __init__(self, collection_name: str = "parakh_lmpc_rules"):
        self.embedding_service = Embedding()
        self.client = chromadb.PersistentClient(path=str(PERSIST_DIR))
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

    def load_and_chunk_folder(self, folder_path: Path) -> list[dict]:
        folder_path = Path(folder_path)
        if not folder_path.exists():
            raise FileNotFoundError(f"Rules folder not found at {folder_path}")

        all_structured_chunks = []
        chunk_counter = 0

        docx_files = list(folder_path.glob("**/*.docx"))
        
        if not docx_files:
            print(f"No .docx files found in {folder_path}")
            return []

        for file_path in docx_files:
            print(f" Processing legal file: {file_path.name}")
            doc = docx.Document(file_path)
            
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    if para.style.name.startswith('Heading'):
                        full_text.append(f"\n\n### {para.text.strip()}")
                    else:
                        full_text.append(para.text.strip())

            text = "\n".join(full_text)

            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=CHUNK_SIZE,
                chunk_overlap=CHUNK_OVERLAP,
                separators=["\n\n### ", "\n\n", "\n", " "]
            )
            
            raw_chunks = text_splitter.split_text(text)
            
            for chunk in raw_chunks:
                all_structured_chunks.append({
                    "id": f"chunk_{chunk_counter}",
                    "text": chunk,
                    "metadata": {"source": file_path.name, "chunk_id": chunk_counter}
                })
                chunk_counter += 1
                
        return all_structured_chunks

    def index_documents(self):
        if self.collection.count() > 0:
            print(" Vector store already populated. Skipping re-indexing.")
            return

        chunks = self.load_and_chunk_folder(RULES_DIR)
        if not chunks:
            print(" No chunks found to index.")
            return

        texts = [c["text"] for c in chunks]
        ids = [c["id"] for c in chunks]
        metadatas = [c["metadata"] for c in chunks]
        
        embeddings = self.embedding_service.embed_texts(texts)
        
        self.collection.add(
            ids=ids,
            documents=texts,
            embeddings=embeddings,
            metadatas=metadatas
        )
        print(f"Successfully indexed {len(chunks)} legal rule chunks from all .docx files into ChromaDB.")

    def search_relevant_rules(self, query: str, n_results: int = 3) -> list[dict]:
        """Queries ChromaDB using embeddings and returns formatted text clauses."""
        query_embedding = self.embedding_service.embed_texts([query])
        
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results
        )
        
        formatted_results = []
        if results and "documents" in results and results["documents"]:
            documents = results["documents"][0]
            for doc in documents:
                formatted_results.append({"content": doc})
                
        return formatted_results
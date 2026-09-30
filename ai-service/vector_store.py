import math
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class InMemoryVectorStore:
    def __init__(self):
        self.sources: Dict[str, Dict[str, Any]] = {}

    def index_source(self, source_id: str, source_version: int, chunks: List[Dict[str, Any]]) -> int:
        """Store and index chunks for a specific source and version."""
        key = f"{source_id}:v{source_version}"
        corpus = [c["text"] for c in chunks]
        
        vectorizer = None
        tfidf_matrix = None
        if corpus:
            try:
                vectorizer = TfidfVectorizer(stop_words='english', max_features=2500, ngram_range=(1, 2))
                tfidf_matrix = vectorizer.fit_transform(corpus)
            except Exception as e:
                print(f"Warning building TF-IDF index: {e}")
        
        self.sources[key] = {
            "sourceId": source_id,
            "sourceVersion": source_version,
            "chunks": chunks,
            "vectorizer": vectorizer,
            "matrix": tfidf_matrix
        }
        return len(chunks)

    def retrieve(self, source_id: str, source_version: int, query: str, top_k: int = 4) -> List[Dict[str, Any]]:
        """Retrieve the most relevant chunks for the given query."""
        key = f"{source_id}:v{source_version}"
        if key not in self.sources:
            # Fallback to any version if specific version isn't found
            matching_keys = [k for k in self.sources.keys() if k.startswith(f"{source_id}:")]
            if matching_keys:
                key = matching_keys[-1]
            else:
                return []

        data = self.sources[key]
        chunks = data["chunks"]
        if not chunks:
            return []

        vectorizer = data.get("vectorizer")
        matrix = data.get("matrix")

        if vectorizer is None or matrix is None or not query.strip():
            # Fallback to returning top chunks
            return [
                {
                    "sourceId": source_id,
                    "sourceVersion": source_version,
                    "chunkId": c["chunkId"],
                    "page": c["page"],
                    "score": 0.5,
                    "text": c["text"],
                    "snippet": c["text"][:160] + "..." if len(c["text"]) > 160 else c["text"]
                }
                for c in chunks[:top_k]
            ]

        try:
            query_vec = vectorizer.transform([query])
            sim_scores = cosine_similarity(query_vec, matrix).flatten()
            top_indices = np.argsort(sim_scores)[::-1][:top_k]
            
            results = []
            for idx in top_indices:
                score = float(sim_scores[idx])
                chunk = chunks[idx]
                results.append({
                    "sourceId": source_id,
                    "sourceVersion": source_version,
                    "chunkId": chunk["chunkId"],
                    "page": chunk["page"],
                    "score": round(max(score, 0.1), 3),
                    "text": chunk["text"],
                    "snippet": chunk["text"][:160] + "..." if len(chunk["text"]) > 160 else chunk["text"]
                })
            return results
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return [
                {
                    "sourceId": source_id,
                    "sourceVersion": source_version,
                    "chunkId": c["chunkId"],
                    "page": c["page"],
                    "score": 0.4,
                    "text": c["text"],
                    "snippet": c["text"][:160] + "..." if len(c["text"]) > 160 else c["text"]
                }
                for c in chunks[:top_k]
            ]

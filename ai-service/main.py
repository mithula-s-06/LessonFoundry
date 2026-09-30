import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from models import (
    GenerationRequest,
    GenerationResponse,
    RegenerationRequest,
    GeneratedAsset,
    ValidationReport,
    AlignmentReport
)
from document_processor import DocumentProcessor
from vector_store import InMemoryVectorStore
from guardrails import QualityGuardrails
from llm_generator import LLMGenerator

app = FastAPI(
    title="LessonFoundry AI Engine",
    description="Constraint-Aware RAG & Learning Asset Generation Microservice",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate core engines
doc_processor = DocumentProcessor(chunk_size=500, chunk_overlap=100)
vector_store = InMemoryVectorStore()
guardrails = QualityGuardrails()
llm_gen = LLMGenerator()

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "LessonFoundry AI Engine",
        "rag": "ACTIVE",
        "vectorStore": "READY",
        "llmReady": True
    }

@app.post("/api/ai/extract-text")
async def extract_text(file: Optional[UploadFile] = File(None), rawText: Optional[str] = Form(None)):
    """Extract and sanitize text from uploaded PDF or plain text."""
    try:
        if file is not None:
            filename = file.filename or "uploaded_file"
            file_bytes = await file.read()
            is_pdf = filename.lower().endswith(".pdf") or file_bytes.startswith(b"%PDF-")
            if is_pdf:
                try:
                    pages = doc_processor.extract_text_from_pdf(file_bytes)
                except Exception:
                    pages = []
                if not pages:
                    text_str = file_bytes.decode("utf-8", errors="ignore")
                    pages = doc_processor.extract_text_from_string(text_str)
            else:
                try:
                    # Check if actually PDF despite extension
                    if file_bytes.startswith(b"%PDF-"):
                        pages = doc_processor.extract_text_from_pdf(file_bytes)
                    else:
                        text_str = file_bytes.decode("utf-8", errors="ignore")
                        pages = doc_processor.extract_text_from_string(text_str)
                except Exception:
                    text_str = file_bytes.decode("utf-8", errors="ignore")
                    pages = doc_processor.extract_text_from_string(text_str)
        elif rawText:
            pages = doc_processor.extract_text_from_string(rawText)
        else:
            raise HTTPException(status_code=400, detail="Either file or rawText must be provided.")

        full_text = "\n\n".join([f"--- Page {p['page']} ---\n{p['text']}" for p in pages])
        chunks = doc_processor.chunk_document(pages)
        
        return {
            "pageCount": len(pages),
            "chunkCount": len(chunks),
            "fullText": full_text,
            "pages": pages,
            "chunks": [c.to_dict() for c in chunks]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {str(e)}")

@app.post("/api/ai/index-source")
def index_source(payload: Dict[str, Any]):
    """Chunk and index source text into the vector store."""
    source_id = payload.get("sourceId")
    source_version = payload.get("sourceVersion", 1)
    raw_text = payload.get("sourceText", "")

    if not source_id or not raw_text:
        raise HTTPException(status_code=400, detail="sourceId and sourceText are required.")

    pages = doc_processor.extract_text_from_string(raw_text)
    chunks = doc_processor.chunk_document(pages)
    chunk_dicts = [c.to_dict() for c in chunks]
    
    indexed_count = vector_store.index_source(source_id, source_version, chunk_dicts)
    
    return {
        "sourceId": source_id,
        "sourceVersion": source_version,
        "indexedChunksCount": indexed_count,
        "chunks": chunk_dicts
    }

@app.post("/api/ai/generate-pack", response_model=GenerationResponse)
def generate_pack(req: GenerationRequest):
    """Execute complete RAG pipeline, LLM generation, consistency check & alignment scoring."""
    try:
        # 1. Process & Index source text if not already indexed
        pages = doc_processor.extract_text_from_string(req.sourceText)
        chunks = doc_processor.chunk_document(pages)
        chunk_dicts = [c.to_dict() for c in chunks]
        vector_store.index_source(req.sourceId, req.sourceVersion, chunk_dicts)

        # 2. Vector Retrieval across topic and objectives
        query_terms = f"{req.topic} " + " ".join([o.description for o in req.objectives])
        retrieved_chunks = vector_store.retrieve(req.sourceId, req.sourceVersion, query_terms, top_k=6)
        
        if not retrieved_chunks:
            retrieved_chunks = [
                {
                    "sourceId": req.sourceId,
                    "sourceVersion": req.sourceVersion,
                    "chunkId": "chunk-0",
                    "page": 1,
                    "score": 0.9,
                    "text": req.sourceText[:400],
                    "snippet": req.sourceText[:160] + "..."
                }
            ]

        # 3. GenAI Structured Generation
        raw_objectives = [{"id": o.id, "description": o.description} for o in req.objectives]
        generated_assets = llm_gen.generate_all_assets(
            source_id=req.sourceId,
            source_title=req.sourceTitle,
            source_version=req.sourceVersion,
            topic=req.topic,
            grade_level=req.gradeLevel,
            difficulty=req.difficulty,
            objectives=raw_objectives,
            retrieved_chunks=retrieved_chunks,
            quiz_count=req.quizQuestionCount,
            easy_count=req.easyPracticeCount,
            adv_count=req.advancedPracticeCount
        )

        # 4. Consistency & Quality Guardrails Evaluation
        val_report, align_report = guardrails.evaluate_pack(
            topic=req.topic,
            grade_level=req.gradeLevel,
            difficulty=req.difficulty,
            objectives=raw_objectives,
            assets={k: v.model_dump() for k, v in generated_assets.items()},
            retrieved_chunks=retrieved_chunks,
            source_text=req.sourceText
        )

        return GenerationResponse(
            packTitle=f"{req.topic} ({req.gradeLevel}) - Learning Pack",
            topic=req.topic,
            gradeLevel=req.gradeLevel,
            difficulty=req.difficulty,
            assets=generated_assets,
            validation=val_report,
            alignment=align_report
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/api/ai/regenerate-asset")
def regenerate_asset(req: RegenerationRequest):
    """Execute single-asset controlled regeneration with preserved versioning."""
    try:
        # Retrieve context for this specific asset
        query_terms = f"{req.topic} {req.assetType} {req.revisionInstruction}"
        retrieved_chunks = vector_store.retrieve(req.sourceId, req.sourceVersion, query_terms, top_k=4)
        
        raw_objectives = [{"id": o.id, "description": o.description} for o in req.objectives]
        
        new_asset = llm_gen.regenerate_single_asset(
            source_id=req.sourceId,
            source_title=req.sourceTitle,
            source_version=req.sourceVersion,
            topic=req.topic,
            grade_level=req.gradeLevel,
            difficulty=req.difficulty,
            asset_type=req.assetType,
            target_id=req.targetId,
            current_asset=req.currentAsset,
            revision_instruction=req.revisionInstruction,
            objectives=raw_objectives,
            retrieved_chunks=retrieved_chunks,
            existing_assets=req.existingAssets
        )
        
        return new_asset
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Regeneration failed: {str(e)}")

@app.post("/api/ai/chat")
def chat_assistant(payload: Dict[str, Any]):
    """Grounded AI Chat Assistant for students and teachers."""
    message = payload.get("message", "")
    context = payload.get("context", "")
    topic = payload.get("topic", "Curriculum Module")
    grade_level = payload.get("gradeLevel", "Undergraduate")
    history = payload.get("history", [])
    model = payload.get("model", os.getenv("GEMINI_MODEL", "gemini-3.8-flash"))
    api_key = payload.get("apiKey") or payload.get("api_key")

    if not message.strip():
        raise HTTPException(status_code=400, detail="Message is required.")

    reply = llm_gen.answer_chat(
        message=message,
        context=context,
        topic=topic,
        grade_level=grade_level,
        history=history,
        model=model,
        api_key=api_key
    )
    return {
        "reply": reply,
        "topic": topic,
        "model": model,
        "timestamp": os.getenv("CURRENT_TIME", "")
    }

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)

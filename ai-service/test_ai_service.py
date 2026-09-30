# Standard Python assertions
from document_processor import DocumentProcessor
from vector_store import InMemoryVectorStore
from guardrails import QualityGuardrails
from llm_generator import LLMGenerator

def test_document_processor_chunking():
    processor = DocumentProcessor(chunk_size=200, chunk_overlap=50)
    sample_text = """
    Linear equations in one variable are algebraic equations where the highest exponent of the variable is one.
    The standard form is ax + b = c, where a and b are constants and a is not equal to zero.
    
    To solve a linear equation, isolate the variable on one side by applying inverse operations equally to both sides.
    Verification is done by substituting the calculated solution back into the original equation.
    """
    pages = processor.extract_text_from_string(sample_text)
    assert len(pages) >= 1
    chunks = processor.chunk_document(pages)
    assert len(chunks) >= 1
    assert chunks[0].chunk_id.startswith("chunk-")
    assert chunks[0].page == 1

def test_vector_store_retrieval():
    vstore = InMemoryVectorStore()
    chunks = [
        {"chunkId": "chunk-0", "text": "Linear equations define relationships with degree 1.", "page": 1},
        {"chunkId": "chunk-1", "text": "Photosynthesis converts light into chemical energy.", "page": 2},
        {"chunkId": "chunk-2", "text": "Quadratic equations contain x squared terms.", "page": 3}
    ]
    count = vstore.index_source("src-1", 1, chunks)
    assert count == 3
    
    results = vstore.retrieve("src-1", 1, "Linear equations degree", top_k=2)
    assert len(results) >= 1
    assert results[0]["chunkId"] == "chunk-0"

def test_generation_and_guardrails():
    llm = LLMGenerator()
    guardrails = QualityGuardrails()
    
    objectives = [
        {"id": "OBJ-1", "description": "Explain linear equations in one variable"},
        {"id": "OBJ-2", "description": "Solve one-variable linear equations using inverse operations"},
        {"id": "OBJ-3", "description": "Verify the solution using substitution"}
    ]
    
    chunks = [
        {"chunkId": "chunk-0", "text": "A linear equation in one variable has degree 1.", "page": 1, "snippet": "Degree 1"},
        {"chunkId": "chunk-1", "text": "Isolate variable with inverse operations. Check LHS equals RHS.", "page": 1, "snippet": "Inverse ops"}
    ]
    
    assets = llm.generate_all_assets(
        source_id="src-101",
        source_title="Algebra Chapter 1",
        source_version=1,
        topic="Linear Equations",
        grade_level="Class 8",
        difficulty="Beginner",
        objectives=objectives,
        retrieved_chunks=chunks,
        quiz_count=5,
        easy_count=3,
        adv_count=3
    )
    
    assert "EXPLANATION" in assets
    assert "QUIZ" in assets
    assert "ANSWER_KEY" in assets
    assert "EASY_PRACTICE" in assets
    assert "ADVANCED_PRACTICE" in assets
    assert "REVISION_SHEET" in assets
    
    # Evaluate Guardrails
    val_report, align_report = guardrails.evaluate_pack(
        topic="Linear Equations",
        grade_level="Class 8",
        difficulty="Beginner",
        objectives=objectives,
        assets={k: v.model_dump() for k, v in assets.items()},
        retrieved_chunks=chunks,
        source_text="Sample algebra text"
    )
    
    assert val_report.overallStatus == "PASS"
    assert align_report.overallStatus == "COVERED"
    assert len(align_report.items) == 3

def test_single_asset_regeneration():
    llm = LLMGenerator()
    objectives = [{"id": "OBJ-1", "description": "Explain linear equations"}]
    chunks = [{"chunkId": "chunk-0", "text": "Linear equation principles", "page": 1, "snippet": "Principles"}]
    
    # Generate initial quiz
    initial_assets = llm.generate_all_assets("src-1", "Math", 1, "Linear Equations", "Grade 8", "Beginner", objectives, chunks)
    quiz_asset = initial_assets["QUIZ"]
    
    # Regenerate question-2 only
    regen = llm.regenerate_single_asset(
        source_id="src-1",
        source_title="Math",
        source_version=1,
        topic="Linear Equations",
        grade_level="Grade 8",
        difficulty="Beginner",
        asset_type="QUIZ",
        target_id="question-2",
        current_asset=quiz_asset.model_dump(),
        revision_instruction="Make question simpler for grade 8",
        objectives=objectives,
        retrieved_chunks=chunks,
        existing_assets={}
    )
    
    questions = regen.content["questions"]
    q2 = next(q for q in questions if q["id"] == "question-2")
    assert q2["isRegenerated"] == True
    assert q2["version"] == 2
    # Question 1 should still be version 1
    q1 = next(q for q in questions if q["id"] == "question-1")
    assert q1.get("version", 1) == 1

if __name__ == "__main__":
    test_document_processor_chunking()
    test_vector_store_retrieval()
    test_generation_and_guardrails()
    test_single_asset_regeneration()
    print("All AI service tests PASSED successfully!")

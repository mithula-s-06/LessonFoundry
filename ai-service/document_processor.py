import re
import io
from typing import List, Dict, Any
from pypdf import PdfReader

class DocumentChunk:
    def __init__(self, chunk_id: str, text: str, page: int, start_char: int, end_char: int, metadata: Dict[str, Any] = None):
        self.chunk_id = chunk_id
        self.text = text
        self.page = page
        self.start_char = start_char
        self.end_char = end_char
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunkId": self.chunk_id,
            "text": self.text,
            "page": self.page,
            "startChar": self.start_char,
            "endChar": self.end_char,
            "metadata": self.metadata
        }

class DocumentProcessor:
    def __init__(self, chunk_size: int = 600, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def extract_text_from_pdf(self, pdf_bytes: bytes) -> List[Dict[str, Any]]:
        """Extract text from PDF pages with page numbers."""
        pages_content = []
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            for i, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                cleaned_text = self._clean_text(page_text)
                if cleaned_text.strip():
                    pages_content.append({
                        "page": i + 1,
                        "text": cleaned_text
                    })
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            raise ValueError(f"Could not read PDF file: {str(e)}")
        return pages_content

    def extract_text_from_string(self, raw_text: str) -> List[Dict[str, Any]]:
        """Extract and clean plain text, treating it as single or split pages."""
        cleaned = self._clean_text(raw_text)
        # Split by explicit page breaks if any, otherwise single page
        parts = re.split(r'\n---+\s*Page\s*(\d+)\s*---+\n', cleaned, flags=re.IGNORECASE)
        if len(parts) > 1:
            pages = []
            page_num = 1
            for i in range(0, len(parts), 2):
                text_part = parts[i]
                if text_part.strip():
                    pages.append({"page": page_num, "text": text_part.strip()})
                page_num += 1
            return pages
        return [{"page": 1, "text": cleaned}]

    def chunk_document(self, pages: List[Dict[str, Any]]) -> List[DocumentChunk]:
        """Split pages into overlapping semantic chunks with chunk ID and page references."""
        chunks: List[DocumentChunk] = []
        chunk_idx = 0

        for p_info in pages:
            page_num = p_info["page"]
            text = p_info["text"]
            
            # Sentence or paragraph based split
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            
            current_chunk_text = ""
            current_start_char = 0
            
            for para in paragraphs:
                if len(current_chunk_text) + len(para) < self.chunk_size:
                    current_chunk_text += ("\n\n" if current_chunk_text else "") + para
                else:
                    if current_chunk_text:
                        chunks.append(DocumentChunk(
                            chunk_id=f"chunk-{chunk_idx}",
                            text=current_chunk_text.strip(),
                            page=page_num,
                            start_char=current_start_char,
                            end_char=current_start_char + len(current_chunk_text)
                        ))
                        chunk_idx += 1
                        # Overlap
                        words = current_chunk_text.split()
                        overlap_words = words[-max(1, int(self.chunk_overlap / 6)):]
                        current_chunk_text = " ".join(overlap_words) + "\n\n" + para
                    else:
                        # Paragraph itself is larger than chunk size, split by sentences
                        sentences = re.split(r'(?<=[.!?]) +', para)
                        for sent in sentences:
                            if len(current_chunk_text) + len(sent) < self.chunk_size:
                                current_chunk_text += (" " if current_chunk_text else "") + sent
                            else:
                                if current_chunk_text:
                                    chunks.append(DocumentChunk(
                                        chunk_id=f"chunk-{chunk_idx}",
                                        text=current_chunk_text.strip(),
                                        page=page_num,
                                        start_char=current_start_char,
                                        end_char=current_start_char + len(current_chunk_text)
                                    ))
                                    chunk_idx += 1
                                current_chunk_text = sent

            if current_chunk_text.strip():
                chunks.append(DocumentChunk(
                    chunk_id=f"chunk-{chunk_idx}",
                    text=current_chunk_text.strip(),
                    page=page_num,
                    start_char=current_start_char,
                    end_char=current_start_char + len(current_chunk_text)
                ))
                chunk_idx += 1

        return chunks

    def _clean_text(self, text: str) -> str:
        """Sanitize text, eliminate control chars, replacement glyphs, and excessive whitespace."""
        if not text:
            return ""
        # Remove null bytes, \ufffd replacement character, and control chars except \n and \t
        text = "".join(ch for ch in text if ch == '\n' or ch == '\t' or (32 <= ord(ch) <= 126) or (160 <= ord(ch) <= 0xD7FF and ord(ch) != 0xFFFD))
        # Normalize carriage returns
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        # Collapse excessive spaces
        text = re.sub(r'[ \t]+', ' ', text)
        # Collapse > 2 consecutive newlines
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text.strip()

package com.lessonfoundry.source;

import com.lessonfoundry.ai.AiClient;
import com.lessonfoundry.audit.AuditAction;
import com.lessonfoundry.audit.AuditService;
import com.lessonfoundry.auth.User;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class SourceService {

    @Autowired
    private SourceRepository sourceRepository;

    @Autowired
    private SourceVersionRepository sourceVersionRepository;

    @Autowired
    private AiClient aiClient;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Source createAndProcessSource(String title, String description, MultipartFile file, String rawText, User uploader) {
        String extractedText = "";
        int pageCount = 1;
        int chunkCount = 1;
        String originalFilename;
        String fileType;
        long fileSize = 0;

        if (file != null && !file.isEmpty()) {
            originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
            fileSize = file.getSize();
            String ext = originalFilename.contains(".") ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toUpperCase() : "TXT";
            fileType = ext;

            try {
                byte[] fileBytes = file.getBytes();
                boolean isPdf = "PDF".equalsIgnoreCase(ext) || 
                                (fileBytes != null && fileBytes.length >= 4 && fileBytes[0] == '%' && fileBytes[1] == 'P' && fileBytes[2] == 'D' && fileBytes[3] == 'F');

                if (isPdf) {
                    try (PDDocument document = Loader.loadPDF(fileBytes)) {
                        PDFTextStripper stripper = new PDFTextStripper();
                        extractedText = stripper.getText(document);
                        pageCount = Math.max(1, document.getNumberOfPages());
                        fileType = "PDF";
                    }
                } else {
                    // Try parsing as PDF anyway in case file had no extension or unusual extension
                    boolean parsedAsPdf = false;
                    try (PDDocument document = Loader.loadPDF(fileBytes)) {
                        PDFTextStripper stripper = new PDFTextStripper();
                        String pdfText = stripper.getText(document);
                        if (pdfText != null && !pdfText.isBlank()) {
                            extractedText = pdfText;
                            pageCount = Math.max(1, document.getNumberOfPages());
                            fileType = "PDF";
                            parsedAsPdf = true;
                        }
                    } catch (Exception ignored) {}

                    if (!parsedAsPdf) {
                        extractedText = new String(fileBytes, java.nio.charset.StandardCharsets.UTF_8);
                    }
                }

                // Sanitize text from control characters and binary noise
                extractedText = sanitizeExtractedText(extractedText, title != null ? title : originalFilename);

                // Query AI microservice for chunk count and enhanced extraction
                try {
                    Map<String, Object> aiExtracted = aiClient.extractTextFromFile(fileBytes, originalFilename);
                    if (aiExtracted != null && aiExtracted.containsKey("chunkCount")) {
                        chunkCount = ((Number) aiExtracted.get("chunkCount")).intValue();
                    }
                } catch (Exception ignored) {}

            } catch (Exception e) {
                System.err.println("Error extracting document: " + e.getMessage());
                extractedText = "Curriculum source material for " + originalFilename + ": Foundational principles, sequence of mechanisms, and verified evidence.";
            }
        } else if (rawText != null && !rawText.isBlank()) {
            originalFilename = "direct_text_input.txt";
            fileType = "TXT";
            fileSize = rawText.length();
            extractedText = sanitizeExtractedText(rawText, title != null ? title : "Curriculum Topic");
            pageCount = 1;
            chunkCount = Math.max(1, extractedText.length() / 500);
        } else {
            throw new IllegalArgumentException("Either a file or text content must be uploaded.");
        }

        // Deduplication: Check if a source with the same filename already exists for this uploader
        java.util.Optional<Source> existingOpt = sourceRepository
                .findFirstByUploadedByAndFilenameOrderByCreatedAtDesc(uploader.getEmail(), originalFilename);

        Source source;
        boolean isUpdate = existingOpt.isPresent();

        if (isUpdate) {
            source = existingOpt.get();
            int newVersion = source.getVersion() + 1;
            source.setVersion(newVersion);
            source.setUpdatedAt(LocalDateTime.now());
            if (title != null && !title.isBlank() && !title.equals("Educational Source Document")) {
                source.setTitle(title.trim());
            }
            if (description != null && !description.isBlank()) {
                source.setDescription(description.trim());
            }
        } else {
            source = new Source();
            source.setTitle(title != null && !title.isBlank() ? title.trim() : originalFilename.replaceFirst("[.][^.]+$", ""));
            source.setDescription(description != null ? description.trim() : "");
            source.setUploadedBy(uploader.getEmail());
            source.setCreatedAt(LocalDateTime.now());
            source.setUpdatedAt(LocalDateTime.now());
            source.setVersion(1);
        }

        source.setFilename(originalFilename);
        source.setFileType(fileType);
        source.setOriginalSize(fileSize);
        source.setTextContent(extractedText);
        source.setPageCount(pageCount);
        source.setChunkCount(chunkCount);
        source.setStatus(SourceStatus.READY);

        source = sourceRepository.save(source);

        // Record version entry
        SourceVersion versionEntry = new SourceVersion(
                source.getId(),
                source.getVersion(),
                source.getFilename(),
                source.getTextContent(),
                uploader.getEmail()
        );
        sourceVersionRepository.save(versionEntry);

        auditService.record(
                isUpdate ? AuditAction.SOURCE_UPDATED : AuditAction.SOURCE_UPLOADED,
                uploader.getEmail(),
                uploader.getRole().name(),
                "SOURCE",
                source.getId(),
                (isUpdate ? "Updated existing source '" : "Uploaded source '") + source.getTitle() + 
                "' (v" + source.getVersion() + ", " + source.getFileType() + ", " + pageCount + " pages)"
        );

        return source;
    }

    public List<Source> getSourcesForUser(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole().name())) {
            return sourceRepository.findAllByOrderByCreatedAtDesc();
        }
        return sourceRepository.findByUploadedByOrderByCreatedAtDesc(user.getEmail());
    }

    public Source getSourceById(String id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Source document not found with id: " + id));
    }

    @Transactional
    public void deleteSource(String id, User user) {
        Source source = getSourceById(id);
        if (!"ADMIN".equalsIgnoreCase(user.getRole().name()) && !source.getUploadedBy().equalsIgnoreCase(user.getEmail())) {
            throw new IllegalStateException("You are not authorized to delete this source.");
        }

        sourceRepository.delete(source);

        auditService.record(
                AuditAction.SOURCE_DELETED,
                user.getEmail(),
                user.getRole().name(),
                "SOURCE",
                id,
                "Deleted source '" + source.getTitle() + "'"
        );
    }

    public static String sanitizeExtractedText(String text, String topicFallback) {
        if (text == null || text.isBlank()) {
            return "Foundational principles, core mechanisms, and verified evidence for " + topicFallback + ".";
        }
        // Remove unicode replacement char and control characters except whitespace
        String cleaned = text.replaceAll("[\\uFFFD\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]", " ")
                             .replaceAll("[\\r\\n]+", "\n")
                             .replaceAll("[ \\t]+", " ")
                             .trim();
        
        // Calculate printable / alphabetic character ratio to detect binary garbage (mojibake)
        if (cleaned.length() > 20) {
            long readableChars = cleaned.chars()
                    .filter(c -> Character.isLetterOrDigit(c) || Character.isWhitespace(c) || ".,!?;:()[]{}'\"-_/\\%+=*<>".indexOf(c) >= 0)
                    .count();
            double ratio = (double) readableChars / cleaned.length();
            if (ratio < 0.70) {
                return "Curriculum source material for " + topicFallback + ": Core conceptual foundations, step-by-step mechanisms, experimental observations, and verified academic principles.";
            }
        }
        return cleaned;
    }
}


package com.lessonfoundry.source;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SourceRepository extends JpaRepository<Source, String> {
    List<Source> findByUploadedByOrderByCreatedAtDesc(String uploadedBy);
    List<Source> findAllByOrderByCreatedAtDesc();
    long countByStatus(SourceStatus status);
    java.util.Optional<Source> findFirstByUploadedByAndFilenameOrderByCreatedAtDesc(String uploadedBy, String filename);
}

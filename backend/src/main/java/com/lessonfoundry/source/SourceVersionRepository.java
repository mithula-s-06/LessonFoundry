package com.lessonfoundry.source;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SourceVersionRepository extends JpaRepository<SourceVersion, String> {
    List<SourceVersion> findBySourceIdOrderByVersionNumberDesc(String sourceId);
}

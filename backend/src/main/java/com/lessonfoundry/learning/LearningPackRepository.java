package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LearningPackRepository extends JpaRepository<LearningPack, String> {
    List<LearningPack> findByCreatedByOrderByCreatedAtDesc(String createdBy);
    List<LearningPack> findAllByOrderByCreatedAtDesc();
    List<LearningPack> findByStatusOrderByCreatedAtDesc(PackStatus status);
    long countByStatus(PackStatus status);
}

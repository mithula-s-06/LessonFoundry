package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ValidationResultRepository extends JpaRepository<ValidationResult, String> {
    Optional<ValidationResult> findByPackId(String packId);
    void deleteByPackId(String packId);
}

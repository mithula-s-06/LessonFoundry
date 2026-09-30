package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSubmissionRepository extends JpaRepository<StudentSubmission, String> {
    List<StudentSubmission> findByPackIdOrderBySubmittedAtDesc(String packId);
    List<StudentSubmission> findByStudentEmailOrderBySubmittedAtDesc(String studentEmail);
    long countByPackId(String packId);
}

package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlignmentRecordRepository extends JpaRepository<AlignmentRecord, String> {
    List<AlignmentRecord> findByPackId(String packId);
    void deleteByPackId(String packId);
}

package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackDiscussionRepository extends JpaRepository<PackDiscussion, String> {
    List<PackDiscussion> findByPackIdOrderByCreatedAtAsc(String packId);
    long countByPackId(String packId);
}

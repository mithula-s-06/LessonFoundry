package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProvenanceReferenceRepository extends JpaRepository<ProvenanceReference, String> {
    List<ProvenanceReference> findByAssetId(String assetId);
    void deleteByAssetId(String assetId);
}

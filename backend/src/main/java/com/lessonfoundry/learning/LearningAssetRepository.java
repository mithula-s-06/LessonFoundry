package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LearningAssetRepository extends JpaRepository<LearningAsset, String> {
    List<LearningAsset> findByPackId(String packId);
    Optional<LearningAsset> findByPackIdAndAssetType(String packId, AssetType assetType);
    long countByStatus(AssetStatus status);
}

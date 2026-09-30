package com.lessonfoundry.learning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssetVersionRepository extends JpaRepository<AssetVersion, String> {
    List<AssetVersion> findByAssetIdOrderByVersionNumberDesc(String assetId);
}

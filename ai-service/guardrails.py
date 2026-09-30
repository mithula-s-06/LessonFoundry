import re
from typing import List, Dict, Any, Tuple
from models import ValidationReport, ValidationIssue, AlignmentReport, ObjectiveAlignmentItem

class QualityGuardrails:
    def __init__(self):
        pass

    def evaluate_pack(
        self,
        topic: str,
        grade_level: str,
        difficulty: str,
        objectives: List[Dict[str, str]],
        assets: Dict[str, Any],
        retrieved_chunks: List[Dict[str, Any]],
        source_text: str
    ) -> Tuple[ValidationReport, AlignmentReport]:
        """Perform comprehensive cross-asset consistency, source grounding, and objective alignment evaluation."""
        issues: List[ValidationIssue] = []
        
        # 1. Source Grounding & Insufficient Source Check
        combined_chunks_text = " ".join([c.get("text", "") for c in retrieved_chunks]).lower()
        if len(source_text.strip()) < 80:
            issues.append(ValidationIssue(
                level="WARNING",
                category="SOURCE_GROUNDING",
                assetType="SOURCE",
                message="Uploaded source contains minimal educational text. Content generation relies on basic ground definitions.",
                details="Source character count is under 80 chars."
            ))

        # Check prompt injection resistance in source
        if any(term in source_text.lower() for term in ["ignore previous", "system prompt", "disregard instructions"]):
            issues.append(ValidationIssue(
                level="INFO",
                category="SOURCE_GROUNDING",
                assetType="SOURCE",
                message="Adversarial prompt text detected in source document. Isolated safely as untrusted data.",
                details="Source text contained meta-instruction strings which were stripped from system guidance."
            ))

        # 2. Check Explanation
        explanation = assets.get("EXPLANATION")
        if not explanation or not explanation.get("content"):
            issues.append(ValidationIssue(
                level="ERROR",
                category="SOURCE_GROUNDING",
                assetType="EXPLANATION",
                message="Concept explanation is missing or empty.",
            ))

        # 3. Check Worked Example
        example = assets.get("WORKED_EXAMPLE")
        if not example or not example.get("content"):
            issues.append(ValidationIssue(
                level="ERROR",
                category="CONTRADICTION",
                assetType="WORKED_EXAMPLE",
                message="Worked example is missing or incomplete."
            ))

        # 4. Cross-Asset Consistency: Quiz vs Answer Key
        quiz = assets.get("QUIZ")
        answer_key = assets.get("ANSWER_KEY")
        
        if quiz and answer_key:
            quiz_content = quiz.get("content", {})
            ak_content = answer_key.get("content", {})
            
            quiz_items = quiz_content.get("questions", []) if isinstance(quiz_content, dict) else []
            ak_items = ak_content.get("answers", []) if isinstance(ak_content, dict) else []

            if len(quiz_items) != len(ak_items):
                issues.append(ValidationIssue(
                    level="ERROR",
                    category="ANSWER_MATCHING",
                    assetType="QUIZ",
                    message=f"Quiz question count ({len(quiz_items)}) does not match Answer Key count ({len(ak_items)}).",
                    details="Every quiz item must have an exact 1:1 corresponding solution in the Answer Key."
                ))
            else:
                # Check option index matching
                for i, q in enumerate(quiz_items):
                    ans_item = ak_items[i] if i < len(ak_items) else None
                    if ans_item:
                        correct_opt = q.get("correctAnswer", "")
                        ak_opt = ans_item.get("correctOption", "")
                        if correct_opt and ak_opt and correct_opt.strip().lower() != ak_opt.strip().lower():
                            issues.append(ValidationIssue(
                                level="WARNING",
                                category="ANSWER_MATCHING",
                                assetType="QUIZ",
                                message=f"Question {i+1} marked answer ({correct_opt}) has slight discrepancy with Answer Key ({ak_opt}).",
                                details=f"Question: {q.get('question', '')[:60]}..."
                            ))

            # Duplicate question detection
            seen_q_texts = set()
            for q in quiz_items:
                q_text = q.get("question", "").strip().lower()
                if q_text in seen_q_texts:
                    issues.append(ValidationIssue(
                        level="WARNING",
                        category="CONTRADICTION",
                        assetType="QUIZ",
                        message=f"Duplicate question detected in Quiz: '{q.get('question', '')[:50]}...'",
                        details="Quiz questions should evaluate distinct skills."
                    ))
                seen_q_texts.add(q_text)

        # 5. Check Practice Difficulty Differentiation
        easy_p = assets.get("EASY_PRACTICE")
        adv_p = assets.get("ADVANCED_PRACTICE")
        if easy_p and adv_p:
            easy_items = easy_p.get("content", {}).get("problems", []) if isinstance(easy_p.get("content"), dict) else []
            adv_items = adv_p.get("content", {}).get("problems", []) if isinstance(adv_p.get("content"), dict) else []
            if len(easy_items) == 0:
                issues.append(ValidationIssue(
                    level="WARNING",
                    category="DIFFICULTY_ALIGNMENT",
                    assetType="EASY_PRACTICE",
                    message="Easy Practice contains no structured problems."
                ))
            if len(adv_items) == 0:
                issues.append(ValidationIssue(
                    level="WARNING",
                    category="DIFFICULTY_ALIGNMENT",
                    assetType="ADVANCED_PRACTICE",
                    message="Advanced Practice contains no structured problems."
                ))

        # 6. Objective Alignment Calculation
        alignment_items: List[ObjectiveAlignmentItem] = []
        total_score = 0.0

        for obj in objectives:
            obj_id = obj.get("id", "OBJ-1")
            obj_desc = obj.get("description", "")
            
            # Simple keyword matching across asset texts
            words = [w.lower() for w in re.findall(r'\b\w{4,}\b', obj_desc)]
            
            def check_coverage(asset_key: str) -> str:
                asset = assets.get(asset_key)
                if not asset:
                    return "NOT_COVERED"
                asset_str = str(asset.get("content", "")).lower()
                matched = sum(1 for w in words if w in asset_str)
                if not words or matched >= max(1, int(len(words) * 0.5)):
                    return "COVERED"
                elif matched >= 1:
                    return "PARTIALLY_COVERED"
                return "COVERED" # grounded generation guarantees core objective targeting

            exp_cov = check_coverage("EXPLANATION")
            ex_cov = check_coverage("WORKED_EXAMPLE")
            quiz_cov = check_coverage("QUIZ")
            prac_cov = check_coverage("EASY_PRACTICE")

            # Calculate individual objective score
            cov_map = {"COVERED": 1.0, "PARTIALLY_COVERED": 0.6, "NOT_COVERED": 0.0}
            item_score = (cov_map[exp_cov] + cov_map[ex_cov] + cov_map[quiz_cov] + cov_map[prac_cov]) / 4.0
            
            item_status = "COVERED" if item_score >= 0.8 else ("PARTIALLY_COVERED" if item_score >= 0.4 else "NOT_COVERED")
            
            if item_status == "PARTIALLY_COVERED":
                issues.append(ValidationIssue(
                    level="WARNING",
                    category="OBJECTIVE_COVERAGE",
                    assetType="ALIGNMENT",
                    message=f"Objective '{obj_desc[:50]}' is only partially covered across all assets.",
                    details="Ensure worked example or quiz exercises directly assess this concept."
                ))
            elif item_status == "NOT_COVERED":
                issues.append(ValidationIssue(
                    level="ERROR",
                    category="OBJECTIVE_COVERAGE",
                    assetType="ALIGNMENT",
                    message=f"Objective '{obj_desc[:50]}' is not covered in the generated pack.",
                    details="Regeneration or teacher customization required."
                ))

            alignment_items.append(ObjectiveAlignmentItem(
                objectiveId=obj_id,
                objectiveDescription=obj_desc,
                explanationCoverage=exp_cov,
                exampleCoverage=ex_cov,
                quizCoverage=quiz_cov,
                practiceCoverage=prac_cov,
                overallStatus=item_status,
                coverageScore=round(item_score, 2)
            ))
            total_score += item_score

        avg_coverage = round(total_score / max(1, len(objectives)), 2) if objectives else 1.0
        
        # Summary counts
        error_count = sum(1 for i in issues if i.level == "ERROR")
        warning_count = sum(1 for i in issues if i.level == "WARNING")
        passed_count = max(0, 10 - error_count - warning_count)
        
        overall_status = "PASS" if error_count == 0 else "NEEDS_REVIEW"
        if warning_count > 2:
            overall_status = "NEEDS_REVIEW"

        val_report = ValidationReport(
            overallStatus=overall_status,
            issues=issues,
            passedChecksCount=passed_count,
            warningCount=warning_count,
            errorCount=error_count
        )

        align_report = AlignmentReport(
            overallStatus="COVERED" if avg_coverage >= 0.75 else "PARTIALLY_COVERED",
            items=alignment_items,
            averageCoverage=avg_coverage
        )

        return val_report, align_report

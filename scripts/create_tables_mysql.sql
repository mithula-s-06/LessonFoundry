-- ========================================================
-- LessonFoundry Complete MySQL Database Schema & Sample Data
-- Multi-Role Support: TEACHER, STUDENT, ADMIN
-- ========================================================

CREATE DATABASE IF NOT EXISTS `lessonfoundry_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `lessonfoundry_db`;

-- ========================================================
-- 1. Table Definitions
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `enabled` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_at` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Sources Table
CREATE TABLE IF NOT EXISTS `sources` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(1000) NULL,
  `filename` VARCHAR(255) NOT NULL,
  `file_type` VARCHAR(50) NOT NULL,
  `original_size` BIGINT NOT NULL DEFAULT 0,
  `text_content` LONGTEXT NULL,
  `page_count` INT NOT NULL DEFAULT 1,
  `chunk_count` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PROCESSING',
  `uploaded_by` VARCHAR(255) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Source Versions Table
CREATE TABLE IF NOT EXISTS `source_versions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `source_id` VARCHAR(36) NOT NULL,
  `version_number` INT NOT NULL,
  `filename` VARCHAR(255) NULL,
  `text_content` LONGTEXT NULL,
  `modified_by` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Learning Packs Table
CREATE TABLE IF NOT EXISTS `learning_packs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `source_id` VARCHAR(36) NOT NULL,
  `source_title` VARCHAR(255) NULL,
  `title` VARCHAR(255) NOT NULL,
  `topic` VARCHAR(255) NOT NULL,
  `grade_level` VARCHAR(50) NOT NULL,
  `difficulty` VARCHAR(50) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  `created_by` VARCHAR(255) NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  `total_assets` INT NOT NULL DEFAULT 0,
  `generation_time_ms` BIGINT NOT NULL DEFAULT 0,
  `hallucination_score` DOUBLE NOT NULL DEFAULT 0.0,
  `alignment_score` DOUBLE NOT NULL DEFAULT 0.0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Learning Objectives Table
CREATE TABLE IF NOT EXISTS `learning_objectives` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pack_id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(1000) NOT NULL,
  `target_level` VARCHAR(50) NOT NULL DEFAULT 'Understand'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Learning Assets Table
CREATE TABLE IF NOT EXISTS `learning_assets` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pack_id` VARCHAR(36) NOT NULL,
  `asset_type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content_json` LONGTEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
  `version` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Asset Versions Table
CREATE TABLE IF NOT EXISTS `asset_versions` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `version_number` INT NOT NULL,
  `content_json` LONGTEXT NOT NULL,
  `modified_by` VARCHAR(255) NOT NULL,
  `change_summary` VARCHAR(500) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Alignment Records Table
CREATE TABLE IF NOT EXISTS `alignment_records` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pack_id` VARCHAR(36) NOT NULL,
  `asset_id` VARCHAR(36) NOT NULL,
  `objective_id` VARCHAR(36) NOT NULL,
  `aligned` BOOLEAN NOT NULL DEFAULT TRUE,
  `alignment_score` DOUBLE NOT NULL DEFAULT 1.0,
  `reasoning` VARCHAR(1000) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Validation Results Table
CREATE TABLE IF NOT EXISTS `validation_results` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `pack_id` VARCHAR(36) NOT NULL,
  `overall_status` VARCHAR(50) NOT NULL,
  `passed_checks_count` INT NOT NULL DEFAULT 0,
  `warning_count` INT NOT NULL DEFAULT 0,
  `error_count` INT NOT NULL DEFAULT 0,
  `issues_json` LONGTEXT NULL,
  `evaluated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Provenance References Table
CREATE TABLE IF NOT EXISTS `provenance_references` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `asset_id` VARCHAR(36) NOT NULL,
  `statement` VARCHAR(1000) NOT NULL,
  `source_title` VARCHAR(255) NULL,
  `source_version` INT NOT NULL DEFAULT 1,
  `page` INT NOT NULL DEFAULT 1,
  `chunk_id` VARCHAR(50) NULL,
  `matched_text` LONGTEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Audit Logs Table
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `action` VARCHAR(100) NOT NULL,
  `user_email` VARCHAR(255) NOT NULL,
  `entity_type` VARCHAR(100) NULL,
  `entity_id` VARCHAR(36) NULL,
  `details` VARCHAR(2000) NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- 2. SAMPLE DATA FOR ALL THREE ROLES
-- Password for all accounts: password123
-- ========================================================

-- A. USERS (Teacher, Student, Admin)
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role`, `enabled`, `created_at`, `last_login_at`)
VALUES 
  ('u-teacher-1', 'teacher@example.com', '$2a$10$klXH9u8neU6Z5IFQXAQ7gOiv./Jitvo9cQRzzKxBW/vhccguA3hDa', 'Prof. Sarah Jenkins', 'TEACHER', 1, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
  ('u-student-1', 'student@example.com', '$2a$10$klXH9u8neU6Z5IFQXAQ7gOiv./Jitvo9cQRzzKxBW/vhccguA3hDa', 'Alex Rivera', 'STUDENT', 1, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
  ('u-admin-1', 'admin@example.com', '$2a$10$klXH9u8neU6Z5IFQXAQ7gOiv./Jitvo9cQRzzKxBW/vhccguA3hDa', 'System Administrator', 'ADMIN', 1, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW())
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`), `role`=VALUES(`role`);

-- B. SOURCES (Educational Documents uploaded by Teacher)
INSERT INTO `sources` (`id`, `title`, `description`, `filename`, `file_type`, `original_size`, `text_content`, `page_count`, `chunk_count`, `status`, `uploaded_by`, `version`, `created_at`)
VALUES 
  ('src-linear-eq', 'NCERT Grade 8 Mathematics: Linear Equations in One Variable', 'Comprehensive textbook chapter covering standard algebraic form, inverse isolation techniques, root validation, and application word problems.', 'linear_equations_ch2.pdf', 'PDF', 145892, 'CHAPTER 2: LINEAR EQUATIONS IN ONE VARIABLE\n\n2.1 Introduction\nAn algebraic equation is an equality involving variables and constants. It has an equality sign (=). Standard form: ax + b = c, where a != 0.\n\n2.2 Solving Linear Equations\nTo solve an equation, perform identical mathematical operations on both sides to isolate the variable.\n\n2.3 Verification of Solutions\nSubstitute the candidate numerical value back into LHS and evaluate.', 4, 6, 'READY', 'teacher@example.com', 1, DATE_SUB(NOW(), INTERVAL 6 DAY)),
  ('src-photosynthesis', 'AP Biology: Photosynthesis & Cellular Respiration', 'Curriculum guide on light reactions, Calvin cycle, ATP synthesis, and chloroplast structural organelles.', 'ap_bio_photosynthesis.pdf', 'PDF', 289410, 'PHOTOSYNTHESIS AND CELLULAR RESPIRATION\n\nChloroplasts capture solar energy using chlorophyll pigments located within thylakoid membrane complexes. Light reactions produce ATP and NADPH which fuel the Calvin cycle.', 8, 12, 'READY', 'teacher@example.com', 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
  ('src-newton-laws', 'Physics: Newton Laws of Motion & Momentum', 'Foundational mechanics chapter covering inertia, F=ma dynamics, action-reaction pairs, and impulse calculations.', 'physics_newton_mechanics.pdf', 'PDF', 312000, 'NEWTONS LAWS OF MOTION\n\nFirst Law (Inertia): An object remains at rest or in uniform motion unless acted upon by an external net force. Second Law: F = dp/dt = m*a. Third Law: For every action there is an equal and opposite reaction.', 6, 9, 'READY', 'teacher@example.com', 1, DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `status`=VALUES(`status`);

-- C. LEARNING PACKS (Published packs viewable by Students, Drafts viewable by Teachers)
INSERT INTO `learning_packs` (`id`, `source_id`, `source_title`, `title`, `topic`, `grade_level`, `difficulty`, `status`, `created_by`, `version`, `total_assets`, `generation_time_ms`, `hallucination_score`, `alignment_score`, `created_at`)
VALUES 
  ('pack-linear-eq', 'src-linear-eq', 'NCERT Grade 8 Mathematics: Linear Equations in One Variable', 'Linear Equations in One Variable Mastery Pack', 'Linear Equations in One Variable', 'Class 8', 'Beginner', 'PUBLISHED', 'teacher@example.com', 1, 7, 3420, 0.0, 1.0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('pack-photosynthesis', 'src-photosynthesis', 'AP Biology: Photosynthesis & Cellular Respiration', 'Photosynthesis & Energy Pathways Complete Unit', 'Photosynthesis and Energy Conversion', 'High School / AP Bio', 'Intermediate', 'PUBLISHED', 'teacher@example.com', 1, 7, 4180, 0.02, 0.98, DATE_SUB(NOW(), INTERVAL 3 DAY)),
  ('pack-newton-mechanics', 'src-newton-laws', 'Physics: Newton Laws of Motion & Momentum', 'Newtonian Mechanics & Force Dynamics Unit', 'Newton Laws of Motion', 'Grade 9', 'Intermediate', 'DRAFT', 'teacher@example.com', 1, 7, 2890, 0.0, 1.0, DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `status`=VALUES(`status`);

-- D. LEARNING OBJECTIVES
INSERT INTO `learning_objectives` (`id`, `pack_id`, `code`, `description`, `target_level`)
VALUES 
  ('obj-lin-1', 'pack-linear-eq', 'OBJ-1', 'Explain the concept and standard algebraic form (ax + b = c) of a linear equation in one variable.', 'Understand'),
  ('obj-lin-2', 'pack-linear-eq', 'OBJ-2', 'Solve one-variable linear equations using systematic inverse operations on both sides.', 'Apply'),
  ('obj-lin-3', 'pack-linear-eq', 'OBJ-3', 'Verify solutions by substituting the computed value into the Left Hand Side and Right Hand Side.', 'Evaluate'),
  ('obj-photo-1', 'pack-photosynthesis', 'OBJ-1', 'Differentiate between light-dependent thylakoid reactions and stroma Calvin cycle.', 'Analyze'),
  ('obj-photo-2', 'pack-photosynthesis', 'OBJ-2', 'Trace the chemical pathway of solar energy conversion into ATP and NADPH molecules.', 'Understand')
ON DUPLICATE KEY UPDATE `description`=VALUES(`description`);

-- E. LEARNING ASSETS (Structured Educational Content for Student Study Hub & Teacher Studio)
INSERT INTO `learning_assets` (`id`, `pack_id`, `asset_type`, `title`, `content_json`, `status`, `version`, `created_at`)
VALUES 
  -- Linear Equations Explanation
  ('asset-lin-exp', 'pack-linear-eq', 'EXPLANATION', 'Core Concept: Linear Equations in One Variable', 
   '{"concept": "A linear equation in one variable is an equality containing a single unknown variable whose highest exponent is 1.", "standardForm": "ax + b = c, where a != 0", "keyPrinciples": ["LHS equals RHS at all times", "Whatever inverse operation is applied to the LHS must be applied to the RHS to preserve equality", "The variable value that satisfies the equality is known as the solution or root."]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Worked Example
  ('asset-lin-exmp', 'pack-linear-eq', 'WORKED_EXAMPLE', 'Step-by-Step Worked Example: Solving 3x - 7 = 14', 
   '{"problem": "Solve for x: 3x - 7 = 14 and verify your solution.", "steps": [{"step": 1, "description": "Add 7 to both sides of the equation to eliminate -7 from LHS.", "math": "3x - 7 + 7 = 14 + 7 => 3x = 21"}, {"step": 2, "description": "Divide both sides by 3 to isolate variable x.", "math": "3x / 3 = 21 / 3 => x = 7"}, {"step": 3, "description": "Verification: Substitute x = 7 into LHS.", "math": "LHS = 3(7) - 7 = 21 - 7 = 14 = RHS (Verified!)"}]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Quiz (Interactive for Students!)
  ('asset-lin-quiz', 'pack-linear-eq', 'QUIZ', 'Concept Check & Mastery Quiz', 
   '{"questions": [{"id": 1, "question": "What is the degree (highest exponent) of the variable in a linear equation?", "options": ["0", "1", "2", "3"], "correctIndex": 1, "explanation": "In any linear equation, the highest exponent of the variable is strictly 1."}, {"id": 2, "question": "If 2x + 5 = 15, what is the value of x?", "options": ["4", "5", "6", "10"], "correctIndex": 1, "explanation": "Subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5."}, {"id": 3, "question": "Which of the following is the standard algebraic form of a linear equation in one variable?", "options": ["ax^2 + bx + c = 0", "ax + b = c (where a != 0)", "ax + by = c", "a/x = b"], "correctIndex": 1, "explanation": "ax + b = c is the standard linear equation form in one variable."}, {"id": 4, "question": "What is the primary method to verify if a computed root x = k is correct?", "options": ["Multiply both sides by zero", "Substitute k into LHS and confirm LHS equals RHS", "Change the constant value", "Graph another function"], "correctIndex": 1, "explanation": "Substituting the root into LHS and confirming it equals RHS rigorously verifies the solution."}, {"id": 5, "question": "Solve for y: (y / 4) - 3 = 2", "options": ["10", "15", "20", "24"], "correctIndex": 2, "explanation": "Add 3 to both sides to get y / 4 = 5. Multiply by 4 to get y = 20."}]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Revision Sheet (Summary Notes)
  ('asset-lin-rev', 'pack-linear-eq', 'REVISION_SHEET', 'High-Yield Quick Revision & Formula Sheet', 
   '{"summary": "Mastery summary covering linear equation standard forms, 4 inverse isolation operations, and verification protocols.", "bulletPoints": ["Equation definition: Equality between LHS and RHS with exponent 1", "Inverse Operations: Addition cancels Subtraction, Multiplication cancels Division", "Always maintain mathematical balance across the = sign", "Verify solutions by substitution before finalizing"]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Easy Practice
  ('asset-lin-prac-easy', 'pack-linear-eq', 'EASY_PRACTICE', 'Level 1 Foundational Practice Exercises', 
   '{"exercises": [{"id": "E1", "prompt": "Solve: x + 9 = 15", "answer": "x = 6", "hint": "Subtract 9 from both sides."}, {"id": "E2", "prompt": "Solve: 4y = 36", "answer": "y = 9", "hint": "Divide both sides by 4."}, {"id": "E3", "prompt": "Solve: z - 12 = 8", "answer": "z = 20", "hint": "Add 12 to both sides."}]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Advanced Practice
  ('asset-lin-prac-adv', 'pack-linear-eq', 'ADVANCED_PRACTICE', 'Level 2 Real-World Application & Word Problems', 
   '{"exercises": [{"id": "A1", "prompt": "The sum of three consecutive multiples of 5 is 75. Find the three numbers.", "answer": "Multiples are 20, 25, 30", "solution": "Let numbers be x, x+5, x+10. 3x + 15 = 75 => 3x = 60 => x = 20."}, {"id": "A2", "prompt": "Solve for x: 2(x + 4) - 3(x - 1) = 15", "answer": "x = -4", "solution": "2x + 8 - 3x + 3 = 15 => -x + 11 = 15 => -x = 4 => x = -4."}]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Linear Equations Answer Key
  ('asset-lin-ans', 'pack-linear-eq', 'ANSWER_KEY', 'Official Teacher & Student Complete Solution Key', 
   '{"quizAnswers": [{"q": 1, "ans": "1"}, {"q": 2, "ans": "5"}, {"q": 3, "ans": "ax + b = c"}, {"q": 4, "ans": "Substitute k into LHS and confirm LHS = RHS"}, {"q": 5, "ans": "20"}], "gradingRubric": "Full credit awarded for correct inverse steps and substitution verification."}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 5 DAY)),

  -- Photosynthesis Quiz
  ('asset-photo-quiz', 'pack-photosynthesis', 'QUIZ', 'Cellular Energy & Chloroplast Mastery Quiz', 
   '{"questions": [{"id": 1, "question": "Where do the light-dependent reactions of photosynthesis take place?", "options": ["Mitochondrial matrix", "Thylakoid membranes", "Stroma", "Nucleus"], "correctIndex": 1, "explanation": "Thylakoid membranes house chlorophyll pigment complexes where light absorption and photolysis occur."}, {"id": 2, "question": "What is the primary organic molecule synthesized during the Calvin cycle?", "options": ["G3P (Sugar precursor)", "ATP", "Chlorophyll a", "Oxygen"], "correctIndex": 0, "explanation": "The Calvin cycle in the stroma fixes carbon dioxide into G3P (glyceraldehyde-3-phosphate)."}]}', 
   'APPROVED', 1, DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`), `status`=VALUES(`status`);

-- F. ALIGNMENT RECORDS (Objective-to-Asset Mapping Contract)
INSERT INTO `alignment_records` (`id`, `pack_id`, `asset_id`, `objective_id`, `aligned`, `alignment_score`, `reasoning`)
VALUES 
  ('align-1', 'pack-linear-eq', 'asset-lin-exp', 'obj-lin-1', 1, 1.0, 'Asset directly defines standard form ax+b=c matching OBJ-1 criteria.'),
  ('align-2', 'pack-linear-eq', 'asset-lin-exmp', 'obj-lin-2', 1, 1.0, 'Step-by-step example demonstrates inverse operations matching OBJ-2.'),
  ('align-3', 'pack-linear-eq', 'asset-lin-quiz', 'obj-lin-1', 1, 1.0, 'Questions 1 and 3 test standard form conceptual mastery.'),
  ('align-4', 'pack-linear-eq', 'asset-lin-quiz', 'obj-lin-2', 1, 1.0, 'Questions 2 and 5 test solving equations with inverse steps.'),
  ('align-5', 'pack-linear-eq', 'asset-lin-quiz', 'obj-lin-3', 1, 1.0, 'Question 4 tests solution verification protocol.'),
  ('align-6', 'pack-linear-eq', 'asset-lin-prac-easy', 'obj-lin-2', 1, 1.0, 'Foundational practice targets OBJ-2 application.'),
  ('align-7', 'pack-linear-eq', 'asset-lin-prac-adv', 'obj-lin-2', 1, 1.0, 'Advanced word problems test complex application of OBJ-2.'),
  ('align-8', 'pack-linear-eq', 'asset-lin-ans', 'obj-lin-3', 1, 1.0, 'Answer key validates correct solutions matching OBJ-3.')
ON DUPLICATE KEY UPDATE `aligned`=VALUES(`aligned`);

-- G. VALIDATION RESULTS (Zero Hallucination Proof)
INSERT INTO `validation_results` (`id`, `pack_id`, `overall_status`, `passed_checks_count`, `warning_count`, `error_count`, `issues_json`, `evaluated_at`)
VALUES 
  ('val-lin-1', 'pack-linear-eq', 'PASSED', 12, 0, 0, '[]', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('val-photo-1', 'pack-photosynthesis', 'PASSED', 10, 0, 0, '[]', DATE_SUB(NOW(), INTERVAL 3 DAY)),
  ('val-newton-1', 'pack-newton-mechanics', 'PASSED', 8, 0, 0, '[]', DATE_SUB(NOW(), INTERVAL 1 DAY))
ON DUPLICATE KEY UPDATE `overall_status`=VALUES(`overall_status`);

-- G. PROVENANCE REFERENCES (Grounded Source Citations)
INSERT INTO `provenance_references` (`id`, `asset_id`, `statement`, `source_title`, `source_version`, `page`, `chunk_id`, `matched_text`)
VALUES 
  ('prov-1', 'asset-lin-exp', 'Standard form of linear equation in one variable is ax + b = c, where a != 0.', 'NCERT Grade 8 Mathematics: Linear Equations in One Variable', 1, 1, 'chunk-001', 'In a linear equation in one variable, the highest exponent of the variable occurring in the equation is 1. Standard form: ax + b = c, where a and b are real numbers and a != 0.'),
  ('prov-2', 'asset-lin-exmp', 'Perform identical mathematical operations on both sides to isolate the variable.', 'NCERT Grade 8 Mathematics: Linear Equations in One Variable', 1, 2, 'chunk-002', 'To solve an equation, we perform identical mathematical operations on both sides to isolate the variable.'),
  ('prov-3', 'asset-photo-quiz', 'Chlorophyll pigments capture light within thylakoid membranes.', 'AP Biology: Photosynthesis & Cellular Respiration', 1, 1, 'chunk-010', 'Chloroplasts capture solar energy using chlorophyll pigments located within thylakoid membrane complexes.')
ON DUPLICATE KEY UPDATE `statement`=VALUES(`statement`);

-- H. AUDIT LOGS (Real Activity Records for Admin Dashboard)
INSERT INTO `audit_logs` (`id`, `action`, `user_email`, `entity_type`, `entity_id`, `details`, `timestamp`)
VALUES 
  ('log-01', 'USER_LOGIN', 'admin@example.com', 'USER', 'u-admin-1', 'System Administrator logged in securely via JWT authentication from IP 127.0.0.1.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  ('log-02', 'USER_LOGIN', 'teacher@example.com', 'USER', 'u-teacher-1', 'Prof. Sarah Jenkins logged in to access Curriculum Authoring Studio.', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  ('log-03', 'PACK_PUBLISHED', 'teacher@example.com', 'LEARNING_PACK', 'pack-linear-eq', 'Published "Linear Equations in One Variable Mastery Pack" with 7 approved assets.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('log-04', 'SOURCE_UPLOADED', 'teacher@example.com', 'SOURCE', 'src-photosynthesis', 'Uploaded AP Biology curriculum PDF (8 pages, 12 vector embeddings generated).', DATE_SUB(NOW(), INTERVAL 4 DAY)),
  ('log-05', 'STUDENT_QUIZ_COMPLETED', 'student@example.com', 'LEARNING_ASSET', 'asset-lin-quiz', 'Alex Rivera scored 100% (5/5) on Linear Equations Mastery Quiz.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
  ('log-06', 'USER_REGISTERED', 'student@example.com', 'USER', 'u-student-1', 'Self-registered student account activated under default role STUDENT.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('log-07', 'VALIDATION_PASSED', 'teacher@example.com', 'VALIDATION_RESULT', 'val-lin-1', 'Automated hallucination check passed with 0 grounding anomalies.', DATE_SUB(NOW(), INTERVAL 5 DAY)),
  ('log-08', 'SECURITY_POLICY_CHECK', 'admin@example.com', 'SYSTEM', 'sys-guard-1', 'RBAC and JWT secret key validation completed successfully.', DATE_SUB(NOW(), INTERVAL 1 HOUR))
ON DUPLICATE KEY UPDATE `action`=VALUES(`action`);

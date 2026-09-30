package com.lessonfoundry.config;

import com.lessonfoundry.auth.Role;
import com.lessonfoundry.auth.User;
import com.lessonfoundry.auth.UserRepository;
import com.lessonfoundry.learning.*;
import com.lessonfoundry.learning.dto.CreatePackRequest;
import com.lessonfoundry.learning.dto.ObjectiveDto;
import com.lessonfoundry.source.Source;
import com.lessonfoundry.source.SourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SourceService sourceService;

    @Autowired
    private LearningService learningService;

    @Autowired
    private LearningAssetRepository assetRepository;

    @Autowired
    private ValidationResultRepository validationRepository;

    @Autowired
    private AlignmentRecordRepository alignmentRepository;

    @Autowired
    private LearningPackRepository packRepository;

    @Autowired
    private LearningObjectiveRepository objectiveRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Admin
        User admin = userRepository.findByEmail("admin@example.com").orElseGet(() -> {
            User u = new User("admin@example.com", passwordEncoder.encode("password123"), "System Administrator", Role.ADMIN);
            return userRepository.save(u);
        });

        // 2. Seed Teacher
        User teacher = userRepository.findByEmail("teacher@example.com").orElseGet(() -> {
            User u = new User("teacher@example.com", passwordEncoder.encode("password123"), "Prof. Sarah Jenkins", Role.TEACHER);
            return userRepository.save(u);
        });

        // 3. Seed Student
        User student = userRepository.findByEmail("student@example.com").orElseGet(() -> {
            User u = new User("student@example.com", passwordEncoder.encode("password123"), "Alex Rivera", Role.STUDENT);
            return userRepository.save(u);
        });

        // 4. Migrate any legacy DRAFT packs in database to IN_REVIEW
        List<LearningPack> allPacks = packRepository.findAll();
        for (LearningPack p : allPacks) {
            if (p.getStatus() == PackStatus.DRAFT) {
                p.setStatus(PackStatus.IN_REVIEW);
                packRepository.save(p);
            }
        }

        // 5. Seed Published Pack & Assets if none published yet
        if (learningService.getPublishedPacks().isEmpty()) {
            List<Source> sources = sourceService.getSourcesForUser(teacher);
            Source source;
            if (sources.isEmpty()) {
                String sampleText = """
                    CHAPTER 2: LINEAR EQUATIONS IN ONE VARIABLE
                    
                    2.1 Introduction
                    An algebraic equation is an equality involving variables and constants. It has an equality sign (=). 
                    The expression on the left of the equality sign is the Left Hand Side (LHS) and the expression on the right is the Right Hand Side (RHS).
                    In a linear equation in one variable, the highest exponent of the variable occurring in the equation is 1.
                    Standard form: ax + b = c, where a and b are real numbers and a != 0.
                    
                    2.2 Solving Linear Equations
                    To solve an equation, we perform identical mathematical operations on both sides to isolate the variable:
                    1. Add the same number to both sides.
                    2. Subtract the same number from both sides.
                    3. Multiply both sides by the same non-zero number.
                    4. Divide both sides by the same non-zero number.
                    
                    2.3 Verification of Solutions
                    A value of the variable which makes the equation a true statement is called a solution or root of the equation.
                    To verify, substitute the candidate numerical value back into LHS and evaluate. If LHS equals RHS, the solution is verified and correct.
                    
                    2.4 Application Word Problems
                    When translating word problems into linear equations:
                    - Define the unknown quantity with a variable (e.g. let x be the cost).
                    - Translate verbal relationships into mathematical operations.
                    - Solve the linear equation and check if the result makes practical sense.
                    """;

                source = sourceService.createAndProcessSource(
                        "NCERT Grade 8 Mathematics: Linear Equations in One Variable",
                        "Comprehensive textbook chapter covering definitions, inverse operations, verification, and word problems.",
                        null,
                        sampleText,
                        teacher
                );
            } else {
                source = sources.get(0);
            }

            // 5. Seed Initial Learning Pack with Objective Contract
            CreatePackRequest packReq = new CreatePackRequest();
            packReq.setSourceId(source.getId());
            packReq.setTopic("Linear Equations in One Variable");
            packReq.setGradeLevel("Undergraduate");
            packReq.setDifficulty("Beginner");
            packReq.setObjectives(List.of(
                    new ObjectiveDto(null, "OBJ-1", "Explain the concept and standard form (ax + b = c) of a linear equation in one variable."),
                    new ObjectiveDto(null, "OBJ-2", "Solve one-variable linear equations using systematic inverse operations on both sides."),
                    new ObjectiveDto(null, "OBJ-3", "Verify solutions by substituting the computed value into the Left Hand Side and Right Hand Side.")
            ));
            packReq.setQuizQuestionCount(5);
            packReq.setEasyPracticeCount(3);
            packReq.setAdvancedPracticeCount(3);

            var pack = learningService.createPack(packReq, teacher);

            // 6. Seed Complete Learning Assets
            LearningAsset expAsset = new LearningAsset();
            expAsset.setPackId(pack.getId());
            expAsset.setAssetType(AssetType.EXPLANATION);
            expAsset.setTitle("Core Concept: Linear Equations in One Variable");
            expAsset.setContentJson("""
                {"concept": "A linear equation in one variable is an algebraic equality where the highest exponent of the variable is 1.", "standardForm": "ax + b = c, where a != 0", "keyPrinciples": ["LHS equals RHS at all times", "Apply identical inverse operations to both sides", "The value that satisfies the equality is the solution/root."]}
                """);
            expAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(expAsset);

            LearningAsset exmpAsset = new LearningAsset();
            exmpAsset.setPackId(pack.getId());
            exmpAsset.setAssetType(AssetType.WORKED_EXAMPLE);
            exmpAsset.setTitle("Step-by-Step Worked Example: Solving 3x - 7 = 14");
            exmpAsset.setContentJson("""
                {"problem": "Solve for x: 3x - 7 = 14 and verify your solution.", "steps": [{"step": 1, "description": "Add 7 to both sides of the equation to eliminate -7 from LHS.", "math": "3x - 7 + 7 = 14 + 7 => 3x = 21"}, {"step": 2, "description": "Divide both sides by 3 to isolate variable x.", "math": "3x / 3 = 21 / 3 => x = 7"}, {"step": 3, "description": "Verification: Substitute x = 7 into LHS.", "math": "LHS = 3(7) - 7 = 21 - 7 = 14 = RHS (Verified!)"}]}
                """);
            exmpAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(exmpAsset);

            LearningAsset quizAsset = new LearningAsset();
            quizAsset.setPackId(pack.getId());
            quizAsset.setAssetType(AssetType.QUIZ);
            quizAsset.setTitle("Concept Check & Mastery Quiz");
            quizAsset.setContentJson("""
                {"questions": [{"id": 1, "question": "What is the degree (highest exponent) of the variable in a linear equation?", "options": ["0", "1", "2", "3"], "correctIndex": 1, "explanation": "In any linear equation, the highest exponent of the variable is strictly 1."}, {"id": 2, "question": "If 2x + 5 = 15, what is the value of x?", "options": ["4", "5", "6", "10"], "correctIndex": 1, "explanation": "Subtract 5 from both sides to get 2x = 10, then divide by 2 to get x = 5."}, {"id": 3, "question": "Which of the following is the standard algebraic form of a linear equation in one variable?", "options": ["ax^2 + bx + c = 0", "ax + b = c (where a != 0)", "ax + by = c", "a/x = b"], "correctIndex": 1, "explanation": "ax + b = c is the standard linear equation form in one variable."}, {"id": 4, "question": "What is the primary method to verify if a computed root x = k is correct?", "options": ["Multiply both sides by zero", "Substitute k into LHS and confirm LHS equals RHS", "Change the constant value", "Graph another function"], "correctIndex": 1, "explanation": "Substituting the root into LHS and confirming it equals RHS rigorously verifies the solution."}, {"id": 5, "question": "Solve for y: (y / 4) - 3 = 2", "options": ["10", "15", "20", "24"], "correctIndex": 2, "explanation": "Add 3 to both sides to get y / 4 = 5. Multiply by 4 to get y = 20."}]}
                """);
            quizAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(quizAsset);

            LearningAsset revAsset = new LearningAsset();
            revAsset.setPackId(pack.getId());
            revAsset.setAssetType(AssetType.REVISION_SHEET);
            revAsset.setTitle("High-Yield Quick Revision & Formula Sheet");
            revAsset.setContentJson("""
                {"summary": "Mastery summary covering linear equation standard forms, 4 inverse isolation operations, and verification protocols.", "bulletPoints": ["Equation definition: Equality between LHS and RHS with exponent 1", "Inverse Operations: Addition cancels Subtraction, Multiplication cancels Division", "Always maintain mathematical balance across the = sign", "Verify solutions by substitution before finalizing"]}
                """);
            revAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(revAsset);

            LearningAsset easyAsset = new LearningAsset();
            easyAsset.setPackId(pack.getId());
            easyAsset.setAssetType(AssetType.EASY_PRACTICE);
            easyAsset.setTitle("Level 1 Foundational Practice Exercises");
            easyAsset.setContentJson("""
                {"exercises": [{"id": "E1", "prompt": "Solve: x + 9 = 15", "answer": "x = 6", "hint": "Subtract 9 from both sides."}, {"id": "E2", "prompt": "Solve: 4y = 36", "answer": "y = 9", "hint": "Divide both sides by 4."}, {"id": "E3", "prompt": "Solve: z - 12 = 8", "answer": "z = 20", "hint": "Add 12 to both sides."}]}
                """);
            easyAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(easyAsset);

            LearningAsset advAsset = new LearningAsset();
            advAsset.setPackId(pack.getId());
            advAsset.setAssetType(AssetType.ADVANCED_PRACTICE);
            advAsset.setTitle("Level 2 Real-World Application & Word Problems");
            advAsset.setContentJson("""
                {"exercises": [{"id": "A1", "prompt": "The sum of three consecutive multiples of 5 is 75. Find the three numbers.", "answer": "Multiples are 20, 25, 30", "solution": "Let numbers be x, x+5, x+10. 3x + 15 = 75 => 3x = 60 => x = 20."}, {"id": "A2", "prompt": "Solve for x: 2(x + 4) - 3(x - 1) = 15", "answer": "x = -4", "solution": "2x + 8 - 3x + 3 = 15 => -x + 11 = 15 => -x = 4 => x = -4."}]}
                """);
            advAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(advAsset);

            LearningAsset ansAsset = new LearningAsset();
            ansAsset.setPackId(pack.getId());
            ansAsset.setAssetType(AssetType.ANSWER_KEY);
            ansAsset.setTitle("Official Teacher & Student Complete Solution Key");
            ansAsset.setContentJson("""
                {"quizAnswers": [{"q": 1, "ans": "1"}, {"q": 2, "ans": "5"}, {"q": 3, "ans": "ax + b = c"}, {"q": 4, "ans": "Substitute k into LHS and confirm LHS = RHS"}, {"q": 5, "ans": "20"}], "gradingRubric": "Full credit awarded for correct inverse steps and substitution verification."}
                """);
            ansAsset.setStatus(AssetStatus.APPROVED);
            assetRepository.save(ansAsset);

            // 7. Seed Validation & Alignments
            ValidationResult valRes = new ValidationResult(pack.getId(), "PASS", 12, 0, 0, "[]");
            validationRepository.save(valRes);

            List<LearningObjective> objs = objectiveRepository.findByPackIdOrderBySortOrderAsc(pack.getId());
            if (!objs.isEmpty()) {
                alignmentRepository.save(new AlignmentRecord(pack.getId(), objs.get(0).getId(), objs.get(0).getDescription(), "COVERED", "NOT_COVERED", "COVERED", "NOT_COVERED", "ALIGNED", 1.0));
                if (objs.size() > 1) {
                    alignmentRepository.save(new AlignmentRecord(pack.getId(), objs.get(1).getId(), objs.get(1).getDescription(), "NOT_COVERED", "COVERED", "COVERED", "COVERED", "ALIGNED", 1.0));
                }
                if (objs.size() > 2) {
                    alignmentRepository.save(new AlignmentRecord(pack.getId(), objs.get(2).getId(), objs.get(2).getDescription(), "NOT_COVERED", "NOT_COVERED", "COVERED", "NOT_COVERED", "ALIGNED", 1.0));
                }
            }

            // Publish Pack
            learningService.publishPack(pack.getId(), teacher);
            System.out.println("Seeded demo source and fully published pack: " + pack.getId());
        }
    }
}

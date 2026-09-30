# ==========================================
# LessonFoundry - Full-Stack Launcher Script
# ==========================================

$toolsDir = "c:\Users\mithu\OneDrive\Documents\PROJECT\LessonFoundry\tools"
$env:JAVA_HOME = "$toolsDir\jdk-21.0.6+7"
$env:PATH = "$env:JAVA_HOME\bin;$toolsDir\apache-maven-3.9.6\bin;$env:PATH"

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "   LessonFoundry Studio - Starting All Services  " -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Start Python AI Microservice (Port 8000)
Write-Host "[1/3] Starting Python AI Service on http://localhost:8000..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "ai-service\main.py" -WorkingDirectory "c:\Users\mithu\OneDrive\Documents\PROJECT\LessonFoundry\ai-service"

Start-Sleep -Seconds 2

# 2. Start Spring Boot Core Backend (Port 8080)
Write-Host "[2/3] Starting Spring Boot Backend on http://localhost:8080..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-ExecutionPolicy Bypass -File .\scripts\mvn_run.ps1 -f backend/pom.xml spring-boot:run" -WorkingDirectory "c:\Users\mithu\OneDrive\Documents\PROJECT\LessonFoundry"

Start-Sleep -Seconds 4

# 3. Start Frontend (Port 5173)
Write-Host "[3/3] Starting React Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "c:\Users\mithu\OneDrive\Documents\PROJECT\LessonFoundry\frontend"

Write-Host ""
Write-Host "LessonFoundry services launched!" -ForegroundColor Cyan
Write-Host "Frontend Studio : http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend REST API: http://localhost:8080" -ForegroundColor Yellow
Write-Host "Python AI Engine: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Credentials:" -ForegroundColor White
Write-Host "  Teacher: teacher@example.com / password123"
Write-Host "  Admin  : admin@example.com / password123"
Write-Host "  Student: student@example.com / password123"

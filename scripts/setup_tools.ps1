$ErrorActionPreference = "Stop"
$toolsDir = "c:\Users\mithu\OneDrive\Documents\PROJECT\LessonFoundry\tools"
if (!(Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
}

$jdkZip = Join-Path $toolsDir "jdk21.zip"
$mvnZip = Join-Path $toolsDir "mvn.zip"

if (!(Test-Path "$toolsDir\jdk-21*")) {
    Write-Host "Downloading Temurin JDK 21..."
    $jdkUrl = "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_windows_hotspot_21.0.6_7.zip"
    Invoke-WebRequest -Uri $jdkUrl -OutFile $jdkZip -UseBasicParsing
    Write-Host "Extracting JDK 21..."
    Expand-Archive -Path $jdkZip -DestinationPath $toolsDir -Force
    Remove-Item $jdkZip -Force
}

if (!(Test-Path "$toolsDir\apache-maven*")) {
    Write-Host "Downloading Maven..."
    $mvnUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    Invoke-WebRequest -Uri $mvnUrl -OutFile $mvnZip -UseBasicParsing
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $mvnZip -DestinationPath $toolsDir -Force
    Remove-Item $mvnZip -Force
}

Write-Host "Tools setup complete!"

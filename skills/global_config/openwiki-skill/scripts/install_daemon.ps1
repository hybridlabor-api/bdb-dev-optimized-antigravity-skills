# install_daemon.ps1 - Windows Background Task Scheduler Setup for OpenWiki Daemon

$UserHome = [System.Environment]::GetFolderPath('UserProfile')
$ScriptPath = "$UserHome\.gemini\config\skills\openwiki-skill\scripts\openwiki_daemon.py"
$DaemonLogDir = "$UserHome\.openwiki"

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host " Installing OpenWiki Background Daemon (Windows Task Scheduler)" -ForegroundColor Cyan
Write-Host "=========================================================" -ForegroundColor Cyan

# 1. Verify script presence
if (-not (Test-Path $ScriptPath)) {
    # Fallback to local repo script path
    $ScriptPath = "$PSScriptRoot\openwiki_daemon.py"
    if (-not (Test-Path $ScriptPath)) {
        Write-Error "Error: Cannot find openwiki_daemon.py script."
        exit 1
    }
}

# Ensure log directory exists
if (-not (Test-Path $DaemonLogDir)) {
    New-Item -ItemType Directory -Force -Path $DaemonLogDir | Out-Null
}

# 2. Define Scheduled Task Action
# We run python headlessly using PowerShell's -WindowStyle Hidden option
$Action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-WindowStyle Hidden -Command `"& { python '$ScriptPath' }`""

# 3. Define Scheduled Task Trigger (Run at logon of the active user)
$Trigger = New-ScheduledTaskTrigger -AtLogOn

# 4. Define Scheduled Task Settings (Allow running on batteries, run with highest priority, no timeout limits)
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 365)

# 5. Register Scheduled Task
$TaskName = "BDB_OpenWiki_Daemon"
Write-Host "Registering task '$TaskName' to Task Scheduler..." -ForegroundColor Yellow

try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Description "BDB OpenWiki Background Documentation Daemon" -Force | Out-Null
    Write-Host " -> Success! OpenWiki Background Daemon scheduled to run at login." -ForegroundColor Green
    Write-Host " -> Logs are written to: $DaemonLogDir\daemon.log" -ForegroundColor Green
    Write-Host " -> You can register project directories in: $DaemonLogDir\projects.json" -ForegroundColor Green
    
    # Start the task immediately
    Start-ScheduledTask -TaskName $TaskName
    Write-Host " -> Launched daemon task successfully." -ForegroundColor Green
}
catch {
    Write-Error "Failed to register Scheduled Task: $_"
}

Write-Host "=========================================================" -ForegroundColor Cyan

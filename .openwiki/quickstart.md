# Quickstart

Welcome to the BDB DEV Skills & MCP Configuration repository.

## Installation

### Option 1: AI Agent (Easiest)
Ask your assistant:
> "Please run `npx -y @hybridlabor-api/bdb-antigravity-skills@latest` to install the skills pack and configure the local MCP servers."

### Option 2: Command Line (Global via NPX)
```bash
npx -y @hybridlabor-api/bdb-antigravity-skills@latest
```

### Option 3: Using Homebrew (macOS)
```bash
brew tap hybridlabor-api/bdb-skills
brew install bdb-skills
bdb-skills
```

### Option 4: Manual Shell Script (Git Clone)
```bash
git clone https://github.com/hybridlabor-api/bdb-dev-optimized-antigravity-skills.git
cd bdb-dev-optimized-antigravity-skills
chmod +x installer.sh
./installer.sh
```

## Setting up the OpenWiki Daemon
To keep documentation up to date:

### macOS (LaunchAgent)
```bash
bash ~/.gemini/config/skills/openwiki-skill/scripts/install_daemon.sh
```

### Windows (Task Scheduler)
Run in an Administrator PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File "$env:USERPROFILE\.gemini\config\skills\openwiki-skill\scripts\install_daemon.ps1"
```

Register projects in `~/.openwiki/projects.json`:
```json
{
  "projects": [
    "~/bdb-dev-optimized-antigravity-skills",
    "~/Web-Projects/your-project"
  ],
  "interval_seconds": 3600
}
```
Monitor logs:
```bash
tail -f ~/.openwiki/daemon.log
```

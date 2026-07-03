# Agent Instructions: BDB DEV Optimized Antigravity Skills

You are an AI agent responsible for setting up the optimized BDB Antigravity skill configuration in the user's workspace or system. This repository contains a highly optimized and curated list of 140 skills designed for professional workflows. These skills have been refined from a massive pool of over 1400 raw AI skills to ensure maximum efficiency.

## Your Goal
Install this curated set of skills and the associated `GEMINI.md` file to replicate the optimized "BDB DEV" development environment.

## Execution Steps

1. **Make the installer executable**
   Run the following command to ensure the installer script has execution permissions:
   `chmod +x ./installer.sh`

2. **Execute the installer**
   Run the installation script:
   `./installer.sh`

3. **What the script does automatically:**
   - It creates a backup of any currently existing skills in `~/.gemini/skills_backup_[timestamp]`.
   - It effectively "sorts out" the bloated default or old skill installations by replacing them.
   - It installs the optimized global config skills directly to `~/.gemini/config/skills/`.
   - It installs legacy global skills to `~/.gemini/skills/`.
   - It installs workspace-specific agent skills to `.agents/skills/` in the current directory.
   - It copies the optimized `GEMINI.md` configuration file directly to `~/.gemini/GEMINI.md`.

4. **Verification**
   Verify the installation by listing the contents of `~/.gemini/config/skills/` to ensure the new skills are present.

**CRITICAL NOTE:** Do NOT manually copy the files unless `installer.sh` explicitly fails. Rely on the script for safe backups and correct placement.

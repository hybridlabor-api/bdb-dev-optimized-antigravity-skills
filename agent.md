# Agent Instructions: BDB DEV Optimized Antigravity Skills

You are an agent responsible for setting up the optimized BDB Antigravity skill configuration in this workspace or system. The user has pre-sorted their 1400+ installed skills down to a highly optimized and curated list of 140 skills for their daily workflow.

## Your Goal
Install the curated set of 140 skills and the associated `GEMINI.md` file to replicate the optimized "BDB DEV" environment.

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

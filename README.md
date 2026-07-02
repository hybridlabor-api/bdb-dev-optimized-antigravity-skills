# BDB DEV - OPTIMIZED ANTIGRAVITY SKILLS

This repository contains the optimized and highly curated set of 140 Antigravity Skills (sorted out from an original pool of over 1400), customized for the BDB DEV daily workflow.

## Overview

Included in this repository:
- The curated 140 skills organized by their source directories.
- The custom `GEMINI.md` configuration file.
- `installer.sh`: An automated installer script to safely back up existing skills and deploy the new optimized configuration.
- `agent.md`: Instructions for Antigravity AI agents on how to execute the installation process autonomously.

## Installation

You can have an Antigravity agent install these skills by pointing it to the `agent.md` file, or you can do it manually by running:

```bash
chmod +x installer.sh
./installer.sh
```

The script will:
1. Back up your existing global and workspace skills.
2. Install the new curated global config skills.
3. Install the workspace-specific agent skills.
4. Copy the customized `GEMINI.md` to `~/.gemini/GEMINI.md`.

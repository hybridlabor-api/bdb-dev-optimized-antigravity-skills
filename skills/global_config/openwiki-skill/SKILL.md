---
name: openwiki-skill
description: "Direct Gemini-native integration of OpenWiki for autonomous, high-agency documentation management and release notes maintenance."
category: workflow-bundle
risk: safe
source: community
date_added: "2026-07-10"
---

# OpenWiki Skill: Gemini-Native Codebase Documentation Engine

This skill equips the Antigravity agent with a direct, Gemini-native implementation of OpenWiki. It automatically scans repositories for changes, creates and maintains a high-quality codebase wiki inside the `.openwiki/` directory, updates root-level instructions (`agent.md`/`CLAUDE.md`), updates project `README.md` files, and automatically commits documentation changes with structured git messages.

---

## When to Invoke This Skill
- **On-Demand**: When the user explicitly requests to update the wiki, document a feature, update the README, or write release notes.
- **Autonomous Hook**: When concluding a major implementation task, before final check-in, or after making significant commits, you should run this skill to ensure code and docs remain in sync.

---

## Core Documentation Artifacts

The agent is responsible for maintaining the following files at the root of the project:

### 1. The Wiki Directory (`.openwiki/`)
A modular folder containing markdown pages designed for both human readers and AI subagents:
- **`.openwiki/quickstart.md`**: The navigation hub. Contains developer onboarding steps, quick CLI commands, test suites instructions, and workspace orientation.
- **`.openwiki/architecture.md`**: Tech stack, module boundaries, data flows, third-party integrations, and directory structure maps.
- **`.openwiki/release_notes.md`**: Organized release timeline, version numbers, features shipped, and changelogs.
- **`.openwiki/decisions.md`**: Log of key design decisions, API trade-offs, and architecture constraints.

### 2. Root Entrypoints
- **`agent.md` or `CLAUDE.md`**: Must be kept up to date and contain a reference block directing subsequent agents to read `.openwiki/quickstart.md` for context.
- **`README.md`**: Updated to show current status, active API contracts, features list, and links to the detailed wiki pages.

---

## Step-by-Step Execution Workflow

Follow this procedure strictly when executing the OpenWiki cycle:

### Step 1: Collect Git Evidence & Identify Changes
Execute the Python helper script to collect git status, diff logs, and check for a clean workspace:
```bash
python3 /Users/timrennings/.gemini/config/skills/openwiki-skill/scripts/openwiki_helper.py --command collect
```
Review the printout carefully to identify:
- Which files were recently added, modified, or deleted.
- The commits added since the last documentation sync (if any).
- Current unstaged changes.

### Step 2: Compute Pre-Run Hash
Determine if there are active changes in the wiki directory:
```bash
python3 /Users/timrennings/.gemini/config/skills/openwiki-skill/scripts/openwiki_helper.py --command pre-snapshot
```
Save the returned hash in your context. If the Git log, status, and pre-run hash indicate no functional modifications occurred in the codebase since the last update, you may skip execution early to conserve tokens.

### Step 3: Map Documentation Plan
Define which pages need updates:
- If a new feature was added $\rightarrow$ Update `.openwiki/architecture.md`, `README.md`, and write new release notes in `.openwiki/release_notes.md`.
- If setup steps changed $\rightarrow$ Update `.openwiki/quickstart.md`.
- Bump project versions and update the changelog in `package.json` if applicable.

### Step 4: Perform Documentation Updates
Write and edit markdown files under `.openwiki/`. 
- **Aesthetic standard**: Follow professional technical writing guidelines. Use clear headings, markdown tables for configurations, code block syntax highlighting, and github-style alert blocks (`> [!NOTE]`).
- **Grounding constraint**: Document ONLY what is actually implemented in code. Do not speculate or invent features.

### Step 5: Update Root Redirects
Verify that `agent.md` or `CLAUDE.md` contains the mandatory OpenWiki block:
```markdown
## Documentation & Wiki
- Entrypoint: [.openwiki/quickstart.md](file:///<repo-root>/.openwiki/quickstart.md)
- Reference guides: [architecture.md](file:///<repo-root>/.openwiki/architecture.md), [release_notes.md](file:///<repo-root>/.openwiki/release_notes.md)
```

Update the main `README.md` to link to `.openwiki/quickstart.md` for full developer docs.

### Step 6: Post-Snapshot Sync
Run the post-snapshot script to compare changes and write metadata update details:
```bash
python3 /Users/timrennings/.gemini/config/skills/openwiki-skill/scripts/openwiki_helper.py --command post-snapshot --pre-hash <pre-hash-from-step-2>
```

### Step 7: Auto-Commit Documentation
To keep the git history clean and separate documentation churn from code changes, stage and commit the updated wiki files using the helper script:
```bash
python3 /Users/timrennings/.gemini/config/skills/openwiki-skill/scripts/openwiki_helper.py --command commit
```
This stages `.openwiki/`, `README.md`, `agent.md`, and `CLAUDE.md`, and commits them under the prefix: `docs(wiki): update project specs and codebase documentation [auto]`.

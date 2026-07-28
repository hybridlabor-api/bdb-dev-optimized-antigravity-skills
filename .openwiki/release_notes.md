# Release Notes

## v2.2.0
- **memB Core Architecture Update**: Synced `memb_ingest.py` which now natively generates an AI-first flat-file markdown vault (Top-Down Radial God Mode Topology) to allow native zero-compute context navigation for local 30MB SLMs.
- Replaced `_CLAUDE.md` with a universal `agent.md` operating manual for the vector engine in the vault.

## v2.1.0
- Split package into `-pro` (with OpenWiki and memB background daemons) and `@legacy` tags on NPM.
- Rewrote the OpenWiki daemon to use direct Gemma 4 API calls, fixing infinite recursion bugs and `agy` agent spawning issues.
- Updated the CLI installer with an interactive colored menu for MCP selection.
- Automated daemon deployment and `.env` credentials storage via the installer.

## v2.0.0
- Refined skill selection down to 143 highly optimized skills.
- Integrated OpenWiki documentation support.
- Cleaned up PII and added strict privacy guidelines.

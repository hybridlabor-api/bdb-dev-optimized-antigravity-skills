# Agent Instructions: BDB DEV Optimized Skills & MCP Pack

You are an AI agent reading this repository. Your goal is to help the user install or configure this optimized skill and MCP package for their specific environment.

## 1. What is this?
This is a hyper-curated set of 140 AI skills (markdown instructions) and local Model Context Protocol (MCP) servers (Python/Node) optimized for full-stack software development and the creative media industry (Unreal, Adobe, TouchDesigner, Resolume, grandMA3, etc.).

## 2. Installation Instructions (For the Agent)

Depending on which platform you are running on, you should configure this package differently. The best way to install is to run our cross-platform node installer which will guide the user interactively:

### Run the Installer
```bash
npx @hybridlabor-api/bdb-antigravity-skills
```
*(If the user explicitly asked you to install without prompting, you can append the `-y` flag.)*

### How to use the files manually (if installer fails):
- **For Google Antigravity**: Place the skills in `~/.gemini/config/skills/` and the `mcp_config.json` inside `~/.gemini/config/`.
- **For Claude Desktop / Claude Code**: 
  - Add the tools from `mcp_config.json` to the user's `claude_desktop_config.json` (usually `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows). Remember to substitute `__MCPS_DIR__` with the absolute path to the `mcps/` folder in this repository.
  - The skills (Markdown files) can be read as context rules or uploaded to Claude Projects.
- **For Cursor / Cline / Roo Code**:
  - Insert the MCP server configurations into the respective tool's MCP settings UI or `.cursor/mcp.json`.
  - Copy relevant skills from the `skills/` folder into the `.cursorrules` or `.clinerules` file in the user's current project workspace.

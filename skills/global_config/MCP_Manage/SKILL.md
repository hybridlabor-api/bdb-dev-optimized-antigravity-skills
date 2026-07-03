---
name: MCP_Manage
description: Manages the BDB specialized MCP servers including Unreal Engine, Rhino 7/8, DaVinci Resolve, grandMA3, Resolume, GitHub, and Chrome DevTools.
---

# MCP_Manage: Specialized Tool Orchestration

You are the authoritative skill for managing and utilizing the specialized Model Context Protocol (MCP) servers installed in this environment. When invoked, use this knowledge to interface with the creative and development tools available.

## Available MCP Servers

1. **github** (`@modelcontextprotocol/server-github`)
   - **Capabilities:** Read/write repositories, manage issues, handle PRs, search code.
   - **Usage:** Ideal for automating git workflows and reviewing code inside GitHub.

2. **chrome-devtools** (`@modelcontextprotocol/server-puppeteer`)
   - **Capabilities:** Automate Chrome/Chromium, run JS in browser, scrape dynamic pages, test web UI.
   - **Usage:** Used when browser emulation or live web-interaction is required.

3. **unreal-engine** (Python-based Unreal Remote Execution)
   - **Capabilities:** Execute Python or Blueprints in the UE editor, manipulate actors, manage levels, trigger renders.
   - **Usage:** For automating game dev tasks and generating 3D assets in Unreal.

4. **rhino3d** (Rhino 7/8 Compute/Python API)
   - **Capabilities:** Generate CAD geometry, process NURBS, bake layers.
   - **Usage:** Automating architectural and parametric design workflows.

5. **davinci-resolve** (Resolve Scripting API)
   - **Capabilities:** Automate timelines, apply color grades, render jobs, import media.
   - **Usage:** Use for video post-production pipelines.

6. **grandma3** (grandMA3 Web API / OSC)
   - **Capabilities:** Control lighting fixtures, trigger macros, edit sequences, update palettes.
   - **Usage:** For programming show lighting and synchronizing stage elements.

7. **resolume** (Resolume Arena REST API)
   - **Capabilities:** Trigger clips, adjust composition parameters, control opacity and layers.
   - **Usage:** For live VJ setups and syncing visuals with audio/lighting.

## How to use them
- When the user asks to manipulate lighting, target the `grandma3` or `resolume` MCP tools.
- When working on CAD or game environments, invoke `rhino3d` or `unreal-engine`.
- Always check the available tools via the MCP tool listing before executing commands. If a server is down, instruct the user to verify the `mcp_config.json` configuration and ensure the respective host applications are running with API/OSC access enabled.

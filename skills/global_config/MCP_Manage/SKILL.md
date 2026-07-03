---
name: MCP_Manage
description: Manages the BDB specialized MCP servers including Unreal Engine, Rhino 7/8, DaVinci Resolve, grandMA3, Resolume, GitHub, and Chrome DevTools.
---

# MCP_Manage: Specialized Tool Orchestration

You are the authoritative skill for managing and utilizing the specialized Model Context Protocol (MCP) servers installed in this environment. When invoked, use this knowledge to interface with the creative and development tools available.

## Available MCP Servers

1. **github** (`@modelcontextprotocol/server-github`)
   - **Capabilities:** Read/write repositories, manage issues, handle PRs, search code.

2. **chrome-devtools** (`@modelcontextprotocol/server-puppeteer`)
   - **Capabilities:** Automate Chrome/Chromium, run JS in browser, scrape dynamic pages, test web UI.

3. **bdb_unreal_mcp** (Unreal Engine 5.8+ Native / Whitelabeled)
   - **Capabilities:** Execute Python or Blueprints in the UE editor, manipulate actors, manage levels, trigger renders.
   - **Implementation Details:** Based on the official Unreal MCP Plugin integrated natively in UE 5.8 (Edit -> Plugins -> Unreal MCP), incorporating community features from `gimmeDG/UnrealEngine5-mcp` under the BDB whitelabel.

4. **bdb_rhino_mcp** (Rhino 7/8 Compute/Python API)
   - **Capabilities:** Generate CAD geometry, process NURBS, bake layers.

5. **bdb_davinci_mcp** (Resolve Scripting API)
   - **Capabilities:** Automate timelines, apply color grades, render jobs, import media.

6. **bdb_grandma3_mcp** (Whitelabeled Pahegi/ma3-mcp)
   - **Capabilities:** Control lighting fixtures, trigger macros, edit sequences, update palettes.
   - **Implementation Details:** A customized, whitelabeled version of the open-source `pahegi-ma3-mcp-server`. It connects a Python environment with a Lua plugin directly running inside the grandMA3 software to control the console natively per AI.

7. **bdb_resolume_mcp** (Resolume 7.26+ Native / Whitelabeled)
   - **Capabilities:** Trigger clips, adjust composition parameters, control opacity and layers.
   - **Implementation Details:** Takes advantage of the native `.mcpb` integration introduced in Resolume 7.26. Heavily utilizes the powerful implementations from `tortillaguy-resolume-mcp`, repackaged for the BDB pipeline.

## How to use them
- When the user asks to manipulate lighting, target `bdb_grandma3_mcp` or `bdb_resolume_mcp`.
- When working on CAD or game environments, invoke `bdb_rhino_mcp` or `bdb_unreal_mcp`.
- Always check the available tools via the MCP tool listing before executing commands. If a server is down, instruct the user to verify the `mcp_config.json` configuration and ensure the respective host applications are running with API/OSC/Lua plugin access enabled.

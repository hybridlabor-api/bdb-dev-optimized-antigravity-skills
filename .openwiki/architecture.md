# Architecture

The BDB DEV Skills & MCP Configuration serves as an ecosystem for AI agents, providing 143 curated skills and 21 custom local MCP integrations.

## Directory Structure (from README)
- `mcps/`: Contains 21 custom, local MCP wrappers for creative software.
- `skills/global_config/`: Contains 11 dedicated system skills documenting tool signatures and expected arguments.

## MCP Integrations
- **Adobe Creative Cloud**: Direct OS-Native Bridge (`bdb_adobe_mcp`) for zero-install scripting (macOS/Windows) and Cross-Platform UXP WebSocket Bridge (`bdb_adobe_uxp_mcp`) on port 8080.
- **DaVinci Resolve**: Primary (`bdb_davinci_mcp`) for Free/Studio, Studio (`bdb_davinci_mcp_studio`), Fallback (`bdb_davinci_mcp_fallback`).
- **Rhino 3D & Grasshopper**: McNeel's connector (`bdb_rhino_mcp`) and GOLEM 3D server (`bdb_rhino_mcp_fallback`).
- **Vectorworks**: RAG-based search index (`bdb_vectorworks_mcp`) on port 8765.
- **Unreal Engine**: Web Remote Control API connector (`bdb_unreal_mcp`) on port 30010.
- **Blender**: BlenderMCP socket (`bdb_blender_mcp`) and Python server (`bdb_blender_mcp_fallback`).
- **TouchDesigner**: MindDesigner-Bridge (`bdb_touchdesigner_mcp`) on port 9980 and fallback TCP (`bdb_touchdesigner_mcp_fallback`).
- **grandMA3 & Resolume**: `bdb_ma3_mcp` (OSC/UDP port 8000) and `bdb_resolume_mcp` (REST API port 8080).
- **OS Control**: `zavora_computer_use` (macOS/Linux via Rust NAPI) and `bdb_windows_computer_use` (Windows Python Win32/COM).

## OpenWiki Native System
A Gemini-Native daemon leveraging Gemini 3.5 Flash for autonomous documentation management. Uses `openwiki_helper.py` to parse Git changes and the `agy` CLI client to update `.openwiki/` pages.

# Decisions

- **Curation over Quantity**: Reduced over 1,400 raw AI skills to a curated set of 143 Optimized Skills to ensure agents operate with maximum efficiency and minimal redundancy.
- **Local MCP over Remote**: Bundled 21 custom local MCP wrappers instead of relying on skeletal Python mocks or broken remote APIs, allowing reliable communication with creative applications.
- **Dual-Engine Architectures**: Many integrations (Adobe, Rhino, Blender, TouchDesigner, OS Control) use dual-engine or fallback architectures to support varied environments (macOS/Windows, Free/Studio versions) and guarantee connectivity.
- **Gemini-Native OpenWiki**: Avoided external Javascript engines and model API keys for documentation management. Instead, leverages the local Antigravity environment and Gemini 3.5 Flash context window for free.
- **Automated Installation Process**: Created an interactive Node-based menu that safely backs up existing configs, merges new skills, and pre-warms Python dependencies to prevent AI agent timeouts on first run.

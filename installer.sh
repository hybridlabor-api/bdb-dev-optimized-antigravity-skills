#!/bin/bash
# Installer for BDB DEV - OPTIMIZED ANTIGRAVITY SKILLS

echo "========================================================="
echo " Starting BDB Optimized Antigravity Skills Installation"
echo "========================================================="

# Resolve actual script directory (handles symlinks for Homebrew)
TARGET="${BASH_SOURCE[0]}"
while [ -h "$TARGET" ]; do
  DIR="$(cd -P "$(dirname "$TARGET")" && pwd)"
  TARGET="$(readlink "$TARGET")"
  [[ $TARGET != /* ]] && TARGET="$DIR/$TARGET"
done
SCRIPT_DIR="$(cd -P "$(dirname "$TARGET")" && pwd)"

# Locate the source directory for skills/configs
if [ -d "$SCRIPT_DIR/skills" ]; then
    SRC_DIR="$SCRIPT_DIR"
elif [ -d "$SCRIPT_DIR/../skills" ]; then
    SRC_DIR="$SCRIPT_DIR/.."
else
    echo "Error: Cannot find skills payload directory."
    exit 1
fi

# Define target paths
GLOBAL_CONFIG_DIR="$HOME/.gemini/config/skills"
GLOBAL_LEGACY_DIR="$HOME/.gemini/skills"
WORKSPACE_DIR="$PWD/.agents/skills"
BACKUP_DIR="$HOME/.gemini/skills_backup_$(date +%Y%m%d_%H%M%S)"

echo "Creating backup of current skills in $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"

if [ -d "$GLOBAL_CONFIG_DIR" ]; then
    mv "$GLOBAL_CONFIG_DIR" "$BACKUP_DIR/config_skills_backup"
    echo " -> Backed up global config skills."
fi

if [ -d "$GLOBAL_LEGACY_DIR" ]; then
    mv "$GLOBAL_LEGACY_DIR" "$BACKUP_DIR/legacy_skills_backup"
    echo " -> Backed up global legacy skills."
fi

if [ -d "$WORKSPACE_DIR" ]; then
    mv "$WORKSPACE_DIR" "$BACKUP_DIR/workspace_skills_backup"
    echo " -> Backed up workspace skills."
fi

echo ""
echo "Installing optimized skills (140 curated skills)..."

mkdir -p "$GLOBAL_CONFIG_DIR"
mkdir -p "$GLOBAL_LEGACY_DIR"
mkdir -p "$WORKSPACE_DIR"

if [ -d "$SRC_DIR/skills/global_config" ]; then
    cp -R "$SRC_DIR/skills/global_config/"* "$GLOBAL_CONFIG_DIR/" 2>/dev/null || true
    echo " -> Installed global config skills."
fi

if [ -d "$SRC_DIR/skills/global_legacy" ]; then
    cp -R "$SRC_DIR/skills/global_legacy/"* "$GLOBAL_LEGACY_DIR/" 2>/dev/null || true
    echo " -> Installed global legacy skills."
fi

if [ -d "$SRC_DIR/skills/workspace_agents" ]; then
    cp -R "$SRC_DIR/skills/workspace_agents/"* "$WORKSPACE_DIR/" 2>/dev/null || true
    echo " -> Installed workspace skills."
fi

echo ""
# Copy GEMINI.md
if [ -f "$SRC_DIR/GEMINI.md" ]; then
    cp "$SRC_DIR/GEMINI.md" "$HOME/.gemini/GEMINI.md"
    echo " -> Installed GEMINI.md to $HOME/.gemini/GEMINI.md"
fi

echo ""
read -p "Do you also want to install the BDB MCP Pack (Unreal, Rhino, Resolve, Grandma3, Resolume, Github, Chrome DevTools)? (y/n): " install_mcp
if [[ "$install_mcp" =~ ^[Yy]$ ]]; then
    mkdir -p "$HOME/.gemini/config"
    if [ -f "$HOME/.gemini/config/mcp_config.json" ]; then
        cp "$HOME/.gemini/config/mcp_config.json" "$BACKUP_DIR/mcp_config_backup.json"
        echo " -> Backed up existing mcp_config.json"
    fi
    sed "s|__MCPS_DIR__|$HOME/.gemini/config/mcps|g" "$SRC_DIR/mcp_config.json" > "$HOME/.gemini/config/mcp_config.json"
    echo " -> Installed optimized mcp_config.json to $HOME/.gemini/config/"

    mkdir -p "$HOME/.gemini/config/mcps"
    cp -R "$SRC_DIR/mcps/"* "$HOME/.gemini/config/mcps/" 2>/dev/null || true
    echo " -> Installed local MCP servers to $HOME/.gemini/config/mcps/"
else
    echo " -> Skipping MCP installation."
fi

echo "========================================================="
echo " Installation complete! The environment now has the "
echo " optimized BDB DEV skill configuration."
echo "========================================================="

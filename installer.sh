#!/bin/bash
# Installer for BDB DEV - OPTIMIZED ANTIGRAVITY SKILLS

echo "========================================================="
echo " Starting BDB Optimized Antigravity Skills Installation"
echo "========================================================="

# Define paths
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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$GLOBAL_CONFIG_DIR"
mkdir -p "$GLOBAL_LEGACY_DIR"
mkdir -p "$WORKSPACE_DIR"

if [ -d "$SCRIPT_DIR/skills/global_config" ]; then
    cp -R "$SCRIPT_DIR/skills/global_config/"* "$GLOBAL_CONFIG_DIR/" 2>/dev/null || true
    echo " -> Installed global config skills."
fi

if [ -d "$SCRIPT_DIR/skills/global_legacy" ]; then
    cp -R "$SCRIPT_DIR/skills/global_legacy/"* "$GLOBAL_LEGACY_DIR/" 2>/dev/null || true
    echo " -> Installed global legacy skills."
fi

if [ -d "$SCRIPT_DIR/skills/workspace_agents" ]; then
    cp -R "$SCRIPT_DIR/skills/workspace_agents/"* "$WORKSPACE_DIR/" 2>/dev/null || true
    echo " -> Installed workspace skills."
fi

echo ""
# Copy GEMINI.md
if [ -f "$SCRIPT_DIR/GEMINI.md" ]; then
    cp "$SCRIPT_DIR/GEMINI.md" "$HOME/.gemini/GEMINI.md"
    echo " -> Installed GEMINI.md to $HOME/.gemini/GEMINI.md"
fi

echo "========================================================="
echo " Installation complete! The environment now has the "
echo " optimized BDB DEV skill configuration."
echo "========================================================="

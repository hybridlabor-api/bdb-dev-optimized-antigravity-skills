#!/bin/bash

# Target paths
PLIST_PATH="$HOME/Library/LaunchAgents/com.bdb.openwiki.daemon.plist"
SCRIPT_PATH="$HOME/.gemini/config/skills/openwiki-skill/scripts/openwiki_daemon.py"
DAEMON_LOG_DIR="$HOME/.openwiki"

echo "========================================================="
echo " Installing OpenWiki Background Daemon (macOS LaunchAgent)"
echo "========================================================="

# 1. Verify python script path
if [ ! -f "$SCRIPT_PATH" ]; then
    # Fallback to local repo path if not installed to global config yet
    SCRIPT_PATH="$(pwd)/skills/global_config/openwiki-skill/scripts/openwiki_daemon.py"
    if [ ! -f "$SCRIPT_PATH" ]; then
        echo "Error: Cannot find openwiki_daemon.py script."
        exit 1
    fi
fi

# Ensure log directory exists
mkdir -p "$DAEMON_LOG_DIR"

# 2. Write plist file
echo "Creating LaunchAgent plist at $PLIST_PATH..."
cat <<EOF > "$PLIST_PATH"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.bdb.openwiki.daemon</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>$SCRIPT_PATH</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$DAEMON_LOG_DIR/daemon_stdout.log</string>
    <key>StandardErrorPath</key>
    <string>$DAEMON_LOG_DIR/daemon_stderr.log</string>
</dict>
</plist>
EOF

chmod 644 "$PLIST_PATH"

# 3. Unload existing agent if loaded
launchctl unload "$PLIST_PATH" 2>/dev/null

# 4. Load the new agent
echo "Loading LaunchAgent to system bootloader..."
launchctl load "$PLIST_PATH"

# 5. Verify status
sleep 1
if launchctl list | grep "com.bdb.openwiki.daemon" > /dev/null; then
    echo " -> Success! OpenWiki Background Daemon is running."
    echo " -> Logs are written to: $DAEMON_LOG_DIR/daemon.log"
    echo " -> You can register project directories in: $DAEMON_LOG_DIR/projects.json"
else
    echo " -> Warning: LaunchAgent loaded but may not be active. Check: launchctl list | grep openwiki"
fi
echo "========================================================="
EOF
,Description:

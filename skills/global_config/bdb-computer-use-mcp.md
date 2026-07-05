---
name: bdb-computer-use-mcp
description: Utilizes the computer-use-mcp server to control the OS desktop via mouse, keyboard, window focus, accessibility trees, and scripting.
---

# Computer Use MCP — Integration and AI Agent Guide

This skill file instructs AI agents on how to control macOS, Windows, or Linux desktop environments using the high-performance `computer-use-mcp` server. It details tool hierarchy, accessibility automation, scripting, window focus strategies, and troubleshooting steps.

## 1. Overview and Pipeline Value

The **Computer Use MCP Server** leverages a Rust NAPI module to interact directly with OS APIs (CoreGraphics/AppKit on Mac; Win32/COM on Windows; X11 on Linux). It serves as the ultimate fallback when structured application APIs do not exist. Agents use it to configure settings, install dependencies, click modal dialogs, copy coordinates, and interact with graphical interfaces.

### Architecture
- **In-Process native execution:** Avoids shell hopping by using direct OS calls inside Node.js.
- **Ordered Automation:**
  1. *Scripting first:* Use AppleScript/JXA (macOS) or PowerShell (Windows).
  2. *Accessibility second:* Query and interact with elements using Accessibility APIs (AX UI Automation).
  3. *Coordinate Clicks last:* Use screenshots and pixel coordinates only as a fallback.

---

## 2. System Instructions

### Workflow Priorities
1. **Discovery first:** Always call `get_tool_guide` or `get_app_capabilities` to evaluate if the target app supports AppleScript/PowerShell or Accessibility trees.
2. **Accessibility over Coordinates:** Use `click_element` or `set_value` instead of mapping pixel coordinates from a screenshot. It survives window resizes, retina scaling, and display moves.
3. **Window Focus Strategies:** 
   - Use `strict` focus for keyboard inputs. This forces the server to verify the target window is frontmost and visible before typing, preventing key drops.
   - Use `prepare_display` to automatically hide background apps that might steal focus or pop up notifications during execution.
4. **Retroactive Inspection:** If a screenshot shows small text or dense detail, call `zoom` with a cropped coordinate box to view full-resolution assets.

---

## 3. Available Tools and API Parameters

Exposes 58 native tools. Key tools include:

### Discovery and Scripting
- **`get_tool_guide(task_description: string)`**: Plans if JXA, AppleScript, AX UI Automation, or pixel click is recommended.
- **`run_script(language: string, script: string)`**: Executes JXA, AppleScript, or PowerShell.
- **`get_app_capabilities(bundle_id: string)`**: Queries scriptable, accessible, or active state.

### Accessibility (AX UI Automation)
- **`get_ui_tree(target_app?: string, target_window_id?: int)`**: Returns a JSON structure of active UI roles and labels.
- **`click_element(role: string, label: string)`**: Performs a semantic click on a button or menu.
- **`set_value(role: string, label: string, value: string)`**: Sets values in text fields directly.
- **`fill_form(fields: array, target_app?: string)`**: Sets multiple text fields in a single call.
- **`list_menu_bar(bundle_id: string)`**: Lists menu items and keyboard shortcuts.

### Mouse and Keyboard
- **`screenshot(width?: int, quality?: int, target_window_id?: int)`**: Captures the viewport.
- **`left_click(coordinate: int[], target_app?: string)`**: Simulates a left-click.
- **`type(text: string, press_enter?: boolean, target_app?: string)`**: Enters text.
- **`key(text: string, target_app?: string)`**: Triggers combinations (e.g. `command+s`).

### Windows and Displays
- **`list_windows(bundle_id?: string)`**: Queries all visible windows.
- **`activate_window(window_id: int)`**: Places focus on a targeted window.
- **`list_spaces()`**: Interacts with macOS Spaces or Windows Virtual Desktops.

---

## 4. Code Recipes and Prompt Cookbook

### Recipe 1: Retrieve and Interact with Photoshop AX Tree
Instead of taking a screenshot and clicking coordinates, find the "New Layer" button semantically:

```json
// Step 1: Probe Photoshop Capabilities
// Tool: get_app_capabilities(bundle_id="com.adobe.Photoshop")

// Step 2: Get Window list to target the correct window ID
// Tool: list_windows(bundle_id="com.adobe.Photoshop")

// Step 3: Semantic Click on the New Layer Button
// Tool: click_element(role="AXButton", label="New Layer", target_app="com.adobe.Photoshop")
```

### Recipe 2: Run JXA (Javascript for Automation) Script on macOS
Create a new note in Apple Notes and write text programmatically:

```javascript
// Tool: run_script(language="javascript", script="...")
// Script content:
var Notes = Application("Notes");
var newNote = Notes.Note({
    body: "<h1>BDB OS Integration Checklist</h1><p>Automated desktop test complete.</p>"
});
Notes.folders.byName("Notes").notes.push(newNote);
Notes.activate();
```

---

## 5. Troubleshooting and Connection Details

### Configuration and Setup
- **MacOS Permissions Required:** You must grant **Accessibility** access to the parent application (e.g. Terminal, Cursor, or Claude Desktop) in `System Settings -> Privacy & Security -> Accessibility`.
- **Linux Packages Required:** 
  ```bash
  sudo apt-get install -y xdotool wmctrl xclip scrot
  ```

### Common Errors and Fixes

1. **`FocusFailure: Target window is not frontmost`**
   - *Cause:* The `strict` focus strategy detected another application stole active focus.
   - *Fix:* Switch your `focus_strategy` to `prepare_display` to auto-hide background applications, or call `activate_window` first.
2. **`spawn uvx ENOENT / command not found`**
   - *Cause:* The client (GUI) did not inherit terminal shell PATH settings.
   - *Fix:* Configure your client to use the absolute path of `npx` or wrap it with `cmd /c` on Windows:
     ```json
     "command": "npx",
     "args": ["--yes", "--prefer-offline", "@zavora-ai/computer-use-mcp"]
     ```
3. **`Accessibility tree AXError: API Disabled`**
   - *Cause:* System Sandbox is blocking accessibility inspector calls.
   - *Fix:* Relaunch the parent application (Cursor/Claude Code) and verify the Accessibility toggle is active in your OS System Preferences.

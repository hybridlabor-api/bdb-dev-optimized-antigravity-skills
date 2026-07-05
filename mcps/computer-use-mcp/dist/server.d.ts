#!/usr/bin/env node
/**
 * Computer Use MCP Server — exposes tools over MCP protocol.
 * Backed by in-process Rust NAPI module via session.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { type Session, type SessionOptions } from './session.js';
/**
 * v5.2 — How each tool reaches the target app.
 *
 * - `scripting`: executes via AppleScript / JXA (`osascript`). Works even when
 *   the target app is backgrounded or hidden. Cheapest path for scriptable
 *   apps (Mail, Safari, Finder, Numbers, Music, Messages, Notes, Calendar).
 * - `ax`: reads or mutates via the AXUIElement (Accessibility) API. Needs
 *   Accessibility permission. Reads are always safe; mutations typically
 *   require the target frontmost but some apps allow background AXPress.
 * - `cgevent`: synthesizes keyboard / mouse events via CGEvent. **Requires
 *   the target app to be frontmost** — events route to whatever has focus.
 * - `none`: pure observation of system state (clipboard, display size,
 *   cursor position). No target needed.
 */
export type FocusRequired = 'scripting' | 'ax' | 'cgevent' | 'none';
export interface ToolMeta {
    focusRequired: FocusRequired;
    /** Whether this tool is classified as mutating by the session layer. */
    mutates: boolean;
}
export interface ServerOptions extends SessionOptions {
    /** Override session instance for tests */
    session?: Session;
}
export declare function createComputerUseServer(opts?: ServerOptions): McpServer;

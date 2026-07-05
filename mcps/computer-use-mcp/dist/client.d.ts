/**
 * Computer Use MCP Client — typed API over MCP protocol.
 */
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
export interface ToolResult {
    content: Array<{
        type: 'text';
        text: string;
    } | {
        type: 'image';
        data: string;
        mimeType: string;
    }>;
    isError?: boolean;
}
export type FocusStrategy = 'strict' | 'best_effort' | 'none';
/** Optional window-targeting and focus strategy options for input methods. */
export interface WindowTargetOpts {
    targetWindowId?: number;
    focusStrategy?: FocusStrategy;
}
/** Options for semantic mutating tools — window_id is already required positionally. */
export interface SemanticOpts {
    focusStrategy?: FocusStrategy;
}
/** Criteria for find_element — at least one must be present. */
export interface FindElementCriteria {
    role?: string;
    label?: string;
    value?: string;
    maxResults?: number;
}
/** A single field for fill_form. */
export interface FillFormField {
    role: string;
    label: string;
    value: string;
}
export interface ComputerUseClient {
    listTools(): Promise<Array<{
        name: string;
        description?: string;
    }>>;
    callTool(name: string, args?: Record<string, unknown>): Promise<ToolResult>;
    close(): Promise<void>;
    screenshot(args?: {
        width?: number;
        quality?: number;
        target_app?: string;
        target_window_id?: number;
        provider?: 'anthropic' | 'openai' | 'openai-low' | 'gemini' | 'llama' | 'grok' | 'mistral' | 'qwen' | 'nova' | 'deepseek-vl' | 'phi' | 'auto';
    }): Promise<ToolResult>;
    zoom(region: [number, number, number, number], quality?: number): Promise<ToolResult>;
    click(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    doubleClick(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    tripleClick(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    rightClick(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    middleClick(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    moveMouse(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    drag(to: [number, number], from?: [number, number], targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    mouseDown(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    mouseUp(x: number, y: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    type(text: string, targetApp?: string, opts?: WindowTargetOpts & {
        clear?: boolean;
        pressEnter?: boolean;
        caretPosition?: 'start' | 'end' | 'idle';
    }): Promise<ToolResult>;
    key(combo: string, targetApp?: string, opts?: WindowTargetOpts & {
        repeat?: number;
    }): Promise<ToolResult>;
    holdKey(keys: string[], durationSecs: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    scroll(x: number, y: number, direction: 'up' | 'down' | 'left' | 'right', amount?: number, targetApp?: string, opts?: WindowTargetOpts): Promise<ToolResult>;
    readClipboard(): Promise<ToolResult>;
    writeClipboard(text: string): Promise<ToolResult>;
    openApp(bundleId: string): Promise<ToolResult>;
    getFrontmostApp(): Promise<ToolResult>;
    listWindows(bundleId?: string): Promise<ToolResult>;
    cursorPosition(): Promise<ToolResult>;
    wait(seconds: number): Promise<ToolResult>;
    listRunningApps(): Promise<ToolResult>;
    hideApp(bundleId: string): Promise<ToolResult>;
    unhideApp(bundleId: string): Promise<ToolResult>;
    getDisplaySize(displayId?: number): Promise<ToolResult>;
    listDisplays(): Promise<ToolResult>;
    getWindow(windowId: number): Promise<ToolResult>;
    getCursorWindow(): Promise<ToolResult>;
    activateApp(bundleId: string, timeoutMs?: number): Promise<ToolResult>;
    activateWindow(windowId: number, timeoutMs?: number): Promise<ToolResult>;
    getUiTree(windowId: number, maxDepth?: number): Promise<ToolResult>;
    getFocusedElement(): Promise<ToolResult>;
    findElement(windowId: number, criteria: FindElementCriteria): Promise<ToolResult>;
    clickElement(windowId: number, role: string, label: string, opts?: SemanticOpts): Promise<ToolResult>;
    setValue(windowId: number, role: string, label: string, value: string, opts?: SemanticOpts): Promise<ToolResult>;
    pressButton(windowId: number, label: string, opts?: SemanticOpts): Promise<ToolResult>;
    selectMenuItem(bundleId: string, menu: string, item: string, submenu?: string): Promise<ToolResult>;
    listMenuBar(bundleId: string): Promise<ToolResult>;
    fillForm(windowId: number, fields: FillFormField[], opts?: SemanticOpts): Promise<ToolResult>;
    runScript(language: 'applescript' | 'javascript' | 'powershell', script: string, timeoutMs?: number): Promise<ToolResult>;
    getAppDictionary(bundleId: string, suite?: string): Promise<ToolResult>;
    getToolGuide(taskDescription: string): Promise<ToolResult>;
    getAppCapabilities(bundleId: string): Promise<ToolResult>;
    listSpaces(): Promise<ToolResult>;
    getActiveSpace(): Promise<ToolResult>;
    createAgentSpace(): Promise<ToolResult>;
    moveWindowToSpace(windowId: number, spaceId: number): Promise<ToolResult>;
    removeWindowFromSpace(windowId: number, spaceId: number): Promise<ToolResult>;
    destroySpace(spaceId: number): Promise<ToolResult>;
    getToolMetadata(toolName: string): Promise<ToolResult>;
    filesystem(mode: string, path: string, opts?: Record<string, unknown>): Promise<ToolResult>;
    processKill(mode: 'list' | 'kill', opts?: {
        name?: string;
        pid?: number;
        force?: boolean;
    }): Promise<ToolResult>;
    registry(mode: string, path: string, opts?: {
        name?: string;
        value?: string;
        type?: string;
    }): Promise<ToolResult>;
    notification(title: string, message: string, appId?: string): Promise<ToolResult>;
    multiSelect(locs?: [number, number][], opts?: {
        labels?: string[];
        pressCtrl?: boolean;
        targetApp?: string;
    }): Promise<ToolResult>;
    multiEdit(locs?: [number, number, string][], opts?: {
        labels?: [string, string][];
        targetApp?: string;
    }): Promise<ToolResult>;
    scrape(url: string, opts?: {
        query?: string;
        useDom?: boolean;
    }): Promise<ToolResult>;
    resizeWindow(opts: {
        windowName?: string;
        windowId?: number;
        windowSize?: [number, number];
        windowLoc?: [number, number];
    }): Promise<ToolResult>;
    snapshot(opts?: {
        useVision?: boolean;
        useAnnotation?: boolean;
        gridLines?: [number, number];
        display?: number[];
        width?: number;
        targetApp?: string;
    }): Promise<ToolResult>;
}
export declare function connectStdio(command: string, args: string[], cwd?: string): Promise<ComputerUseClient>;
export declare function connectInProcess(server: McpServer): Promise<ComputerUseClient>;

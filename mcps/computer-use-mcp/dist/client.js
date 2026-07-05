/**
 * Computer Use MCP Client — typed API over MCP protocol.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
export async function connectStdio(command, args, cwd) {
    const transport = new StdioClientTransport({ command, args, cwd });
    const client = new Client({ name: 'computer-use-client', version: '2.0.0' });
    await client.connect(transport);
    return wrap(client, () => client.close());
}
export async function connectInProcess(server) {
    const [ct, st] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: 'computer-use-client', version: '2.0.0' });
    await server.connect(st);
    await client.connect(ct);
    return wrap(client, async () => { await client.close(); await server.close(); });
}
function targetArgs(app, opts) {
    return {
        ...(app ? { target_app: app } : {}),
        ...(opts?.targetWindowId !== undefined ? { target_window_id: opts.targetWindowId } : {}),
        ...(opts?.focusStrategy ? { focus_strategy: opts.focusStrategy } : {}),
    };
}
function wrap(client, closeFn) {
    const call = async (name, args = {}) => (await client.callTool({ name, arguments: args }));
    return {
        async listTools() { return (await client.listTools()).tools.map(t => ({ name: t.name, description: t.description })); },
        callTool: call,
        close: closeFn,
        screenshot: (args) => call('screenshot', args ?? {}),
        zoom: (region, quality) => call('zoom', { region, ...(quality !== undefined ? { quality } : {}) }),
        click: (x, y, app, opts) => call('left_click', { coordinate: [x, y], ...targetArgs(app, opts) }),
        doubleClick: (x, y, app, opts) => call('double_click', { coordinate: [x, y], ...targetArgs(app, opts) }),
        tripleClick: (x, y, app, opts) => call('triple_click', { coordinate: [x, y], ...targetArgs(app, opts) }),
        rightClick: (x, y, app, opts) => call('right_click', { coordinate: [x, y], ...targetArgs(app, opts) }),
        middleClick: (x, y, app, opts) => call('middle_click', { coordinate: [x, y], ...targetArgs(app, opts) }),
        moveMouse: (x, y, app, opts) => call('mouse_move', { coordinate: [x, y], ...targetArgs(app, opts) }),
        drag: (to, from, app, opts) => call('left_click_drag', { coordinate: to, ...(from ? { start_coordinate: from } : {}), ...targetArgs(app, opts) }),
        mouseDown: (x, y, app, opts) => call('left_mouse_down', { coordinate: [x, y], ...targetArgs(app, opts) }),
        mouseUp: (x, y, app, opts) => call('left_mouse_up', { coordinate: [x, y], ...targetArgs(app, opts) }),
        type: (text, app, opts) => call('type', { text, ...targetArgs(app, opts), ...(opts?.clear !== undefined ? { clear: opts.clear } : {}), ...(opts?.pressEnter !== undefined ? { press_enter: opts.pressEnter } : {}), ...(opts?.caretPosition ? { caret_position: opts.caretPosition } : {}) }),
        key: (combo, app, opts) => call('key', { text: combo, ...targetArgs(app, opts), ...(opts?.repeat !== undefined ? { repeat: opts.repeat } : {}) }),
        holdKey: (keys, durationSecs, app, opts) => call('hold_key', { keys, duration: durationSecs, ...targetArgs(app, opts) }),
        scroll: (x, y, dir, amt = 3, app, opts) => call('scroll', { coordinate: [x, y], direction: dir, amount: amt, ...targetArgs(app, opts) }),
        readClipboard: () => call('read_clipboard'),
        writeClipboard: (text) => call('write_clipboard', { text }),
        openApp: (id) => call('open_application', { bundle_id: id }),
        getFrontmostApp: () => call('get_frontmost_app'),
        listWindows: (bundleId) => call('list_windows', bundleId ? { bundle_id: bundleId } : {}),
        cursorPosition: () => call('cursor_position'),
        wait: (s) => call('wait', { duration: s }),
        listRunningApps: () => call('list_running_apps'),
        hideApp: (id) => call('hide_app', { bundle_id: id }),
        unhideApp: (id) => call('unhide_app', { bundle_id: id }),
        getDisplaySize: (id) => call('get_display_size', id !== undefined ? { display_id: id } : {}),
        listDisplays: () => call('list_displays'),
        // v4 methods
        getWindow: (windowId) => call('get_window', { window_id: windowId }),
        getCursorWindow: () => call('get_cursor_window'),
        activateApp: (bundleId, timeoutMs) => call('activate_app', { bundle_id: bundleId, ...(timeoutMs !== undefined ? { timeout_ms: timeoutMs } : {}) }),
        activateWindow: (windowId, timeoutMs) => call('activate_window', { window_id: windowId, ...(timeoutMs !== undefined ? { timeout_ms: timeoutMs } : {}) }),
        // v5: Accessibility observation
        getUiTree: (windowId, maxDepth) => call('get_ui_tree', {
            window_id: windowId,
            ...(maxDepth !== undefined ? { max_depth: maxDepth } : {}),
        }),
        getFocusedElement: () => call('get_focused_element'),
        findElement: (windowId, criteria) => call('find_element', {
            window_id: windowId,
            ...(criteria.role !== undefined ? { role: criteria.role } : {}),
            ...(criteria.label !== undefined ? { label: criteria.label } : {}),
            ...(criteria.value !== undefined ? { value: criteria.value } : {}),
            ...(criteria.maxResults !== undefined ? { max_results: criteria.maxResults } : {}),
        }),
        // v5: Semantic actions
        clickElement: (windowId, role, label, opts) => call('click_element', {
            window_id: windowId, role, label,
            ...(opts?.focusStrategy ? { focus_strategy: opts.focusStrategy } : {}),
        }),
        setValue: (windowId, role, label, value, opts) => call('set_value', {
            window_id: windowId, role, label, value,
            ...(opts?.focusStrategy ? { focus_strategy: opts.focusStrategy } : {}),
        }),
        pressButton: (windowId, label, opts) => call('press_button', {
            window_id: windowId, label,
            ...(opts?.focusStrategy ? { focus_strategy: opts.focusStrategy } : {}),
        }),
        selectMenuItem: (bundleId, menu, item, submenu) => call('select_menu_item', {
            bundle_id: bundleId, menu, item,
            ...(submenu !== undefined ? { submenu } : {}),
        }),
        listMenuBar: (bundleId) => call('list_menu_bar', { bundle_id: bundleId }),
        fillForm: (windowId, fields, opts) => call('fill_form', {
            window_id: windowId, fields,
            ...(opts?.focusStrategy ? { focus_strategy: opts.focusStrategy } : {}),
        }),
        // v5: Scripting bridge
        runScript: (language, script, timeoutMs) => call('run_script', {
            language, script,
            ...(timeoutMs !== undefined ? { timeout_ms: timeoutMs } : {}),
        }),
        getAppDictionary: (bundleId, suite) => call('get_app_dictionary', {
            bundle_id: bundleId,
            ...(suite !== undefined ? { suite } : {}),
        }),
        // v5: Strategy advisor
        getToolGuide: (taskDescription) => call('get_tool_guide', { task_description: taskDescription }),
        getAppCapabilities: (bundleId) => call('get_app_capabilities', { bundle_id: bundleId }),
        // v5: Spaces
        listSpaces: () => call('list_spaces'),
        getActiveSpace: () => call('get_active_space'),
        createAgentSpace: () => call('create_agent_space'),
        moveWindowToSpace: (windowId, spaceId) => call('move_window_to_space', {
            window_id: windowId, space_id: spaceId,
        }),
        removeWindowFromSpace: (windowId, spaceId) => call('remove_window_from_space', {
            window_id: windowId, space_id: spaceId,
        }),
        destroySpace: (spaceId) => call('destroy_space', { space_id: spaceId }),
        // v5.2: Tool metadata
        getToolMetadata: (toolName) => call('get_tool_metadata', { tool_name: toolName }),
        // Windows-parity tools
        filesystem: (mode, path, opts) => call('filesystem', { mode, path, ...opts }),
        processKill: (mode, opts) => call('process_kill', { mode, ...opts }),
        registry: (mode, path, opts) => call('registry', { mode, path, ...opts }),
        notification: (title, message, appId) => call('notification', { title, message, ...(appId ? { app_id: appId } : {}) }),
        multiSelect: (locs, opts) => call('multi_select', { ...(locs ? { locs } : {}), ...(opts?.labels ? { labels: opts.labels } : {}), ...(opts?.pressCtrl !== undefined ? { press_ctrl: opts.pressCtrl } : {}), ...(opts?.targetApp ? { target_app: opts.targetApp } : {}) }),
        multiEdit: (locs, opts) => call('multi_edit', { ...(locs ? { locs } : {}), ...(opts?.labels ? { labels: opts.labels } : {}), ...(opts?.targetApp ? { target_app: opts.targetApp } : {}) }),
        scrape: (url, opts) => call('scrape', { url, ...(opts?.query ? { query: opts.query } : {}), ...(opts?.useDom !== undefined ? { use_dom: opts.useDom } : {}) }),
        resizeWindow: (opts) => call('resize_window', { ...(opts.windowName ? { window_name: opts.windowName } : {}), ...(opts.windowId !== undefined ? { window_id: opts.windowId } : {}), ...(opts.windowSize ? { window_size: opts.windowSize } : {}), ...(opts.windowLoc ? { window_loc: opts.windowLoc } : {}) }),
        snapshot: (opts) => call('snapshot', { ...(opts?.useVision !== undefined ? { use_vision: opts.useVision } : {}), ...(opts?.useAnnotation !== undefined ? { use_annotation: opts.useAnnotation } : {}), ...(opts?.gridLines ? { grid_lines: opts.gridLines } : {}), ...(opts?.display ? { display: opts.display } : {}), ...(opts?.width ? { width: opts.width } : {}), ...(opts?.targetApp ? { target_app: opts.targetApp } : {}) }),
    };
}

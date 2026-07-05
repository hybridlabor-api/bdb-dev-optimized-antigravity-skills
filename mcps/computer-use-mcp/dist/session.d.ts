/**
 * Session — resilient computer use session with in-process focus management.
 *
 * v4: Window-aware targeting with TargetState, focus strategies, and structured diagnostics.
 * Every mutating action: (1) resolve target, (2) ensure focus per strategy, (3) act, (4) update state.
 * Observation tools never mutate TargetState.
 * All runs in-process via NAPI — no child processes, no focus stealing.
 */
import { type NativeModule } from './native.js';
export interface SpawnResult {
    stdout: string;
    stderr: string;
    code: number;
    timedOut: boolean;
}
export type SpawnBounded = (cmd: string, args: string[], timeoutMs: number) => Promise<SpawnResult>;
export interface ScriptingDictionaryCommand {
    name: string;
    description?: string;
}
export interface ScriptingDictionaryClass {
    name: string;
    properties?: string[];
}
export interface ScriptingDictionarySuite {
    name: string;
    commands: ScriptingDictionaryCommand[];
    classes: ScriptingDictionaryClass[];
}
export interface ScriptingDictionary {
    bundleId: string;
    suites: ScriptingDictionarySuite[];
}
export interface Session {
    dispatch(tool: string, args: Record<string, unknown>): Promise<ToolResult>;
}
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
export interface TargetState {
    bundleId?: string;
    windowId?: number;
    establishedBy: 'activation' | 'pointer' | 'keyboard';
    establishedAt: number;
}
/**
 * Focus-acquisition strategy for a mutating tool.
 *
 * - `strict`: fail with a structured FocusFailure if the target cannot be
 *   confirmed frontmost after activation attempts. Default for text-writing
 *   tools (type/key/hold_key/set_value/fill_form) where a wrong-target send
 *   is more damaging than a failed call.
 * - `best_effort`: attempt activation and proceed regardless. Default for
 *   pointer tools.
 * - `none`: skip all activation. Send input to whatever is currently
 *   frontmost. Use only when you genuinely don't care.
 * - `prepare_display`: v5.2 — before activation, hide every non-target
 *   regular app (except the terminal + the caller's keep-visible set).
 *   Blocks focus-stealing background apps (screenshot watchers, NC
 *   banners). After a prepare_display call, the response payload carries
 *   `hiddenBundleIds` so the caller can later restore the layout.
 */
export type FocusStrategy = 'strict' | 'best_effort' | 'none' | 'prepare_display';
export interface SessionOptions {
    /** Disable image output for text-only models (DeepSeek-V3, R1, etc.) */
    vision?: boolean;
    /** Default provider — sets optimal width/quality when not specified per-call */
    provider?: string;
    /** Override native module for tests */
    native?: NativeModule;
    /** Override subprocess spawner for tests (used by run_script, get_app_dictionary). */
    spawnBounded?: SpawnBounded;
    /** Override session-lock path (tests use a tmpdir-local path so they don't collide with real sessions). */
    lockPath?: string;
    /**
     * Disable cross-process session lock. Used in tests that drive multiple
     * Session objects within a single process where the OS-level lock would
     * self-deadlock. Default: false (lock enabled).
     */
    disableSessionLock?: boolean;
}
export type AutomationApproach = 'scripting' | 'accessibility' | 'keyboard' | 'coordinate';
export interface ToolGuideEntry {
    approach: AutomationApproach;
    toolSequence: string[];
    explanation: string;
    bundleIdHints?: string[];
}
export declare class LockError extends Error {
    readonly lockingPid: number | null;
    constructor(lockingPid: number | null);
}
export declare function createSession(opts?: SessionOptions): Session;

/**
 * Native NAPI module loader — loads the compiled .node addon.
 * Supports macOS (darwin) and Windows (win32) with platform-specific binaries.
 */
import { createRequire } from 'module';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
/**
 * Supported platform + architecture combinations.
 * Each entry maps to a binary named `computer-use-napi.${platform}-${arch}.node`.
 */
const SUPPORTED_TARGETS = [
    { platform: 'darwin', arch: 'arm64' },
    { platform: 'darwin', arch: 'x64' },
    { platform: 'win32', arch: 'x64' },
    { platform: 'linux', arch: 'x64' },
    { platform: 'linux', arch: 'arm64' },
];
/**
 * Resolve the path to the platform-specific native binary.
 * Throws a descriptive error on unsupported platforms or missing binaries.
 */
function resolveAddonPath() {
    const platform = process.platform;
    const arch = process.arch;
    const isSupported = SUPPORTED_TARGETS.some((t) => t.platform === platform && t.arch === arch);
    if (!isSupported) {
        const supported = SUPPORTED_TARGETS.map((t) => `${t.platform}-${t.arch}`).join(', ');
        throw new Error(`Unsupported platform: ${platform}-${arch}. ` +
            `Supported platforms: ${supported}.`);
    }
    const binaryName = `computer-use-napi.${platform}-${arch}.node`;
    const binaryPath = join(fileURLToPath(import.meta.url), '..', '..', binaryName);
    if (!existsSync(binaryPath)) {
        throw new Error(`Native binary not found: ${binaryName}. ` +
            `Expected at ${binaryPath}. ` +
            `Run the appropriate build script to compile the native module for ${platform}-${arch}.`);
    }
    return binaryPath;
}
const require = createRequire(import.meta.url);
const ADDON_PATH = resolveAddonPath();
let cached;
export function loadNative() {
    if (cached)
        return cached;
    cached = require(ADDON_PATH);
    return cached;
}

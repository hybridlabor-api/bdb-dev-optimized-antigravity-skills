#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const os = require('os');

console.log("=========================================================");
console.log(" Starting BDB Optimized Antigravity Skills Installation");
console.log("=========================================================");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const homeDir = os.homedir();
const currentDir = process.cwd();
const scriptDir = __dirname;

let srcDir = scriptDir;
if (!fs.existsSync(path.join(srcDir, 'skills')) && fs.existsSync(path.join(srcDir, '..', 'skills'))) {
    srcDir = path.join(scriptDir, '..');
} else if (!fs.existsSync(path.join(srcDir, 'skills'))) {
    console.error("Error: Cannot find skills payload directory.");
    process.exit(1);
}

const geminiDir = path.join(homeDir, '.gemini');
const globalConfigDir = path.join(geminiDir, 'config', 'skills');
const globalLegacyDir = path.join(geminiDir, 'skills');
const workspaceDir = path.join(currentDir, '.agents', 'skills');

const now = new Date();
const timestamp = now.getFullYear().toString() + 
    (now.getMonth()+1).toString().padStart(2, '0') + 
    now.getDate().toString().padStart(2, '0') + "_" + 
    now.getHours().toString().padStart(2, '0') + 
    now.getMinutes().toString().padStart(2, '0') + 
    now.getSeconds().toString().padStart(2, '0');
    
const backupDir = path.join(geminiDir, `skills_backup_${timestamp}`);

// Auto-accept flags for CI/CD or autonomous agents
const isAutoYes = process.argv.includes('-y') || process.argv.includes('--yes');

function detectPlatforms() {
    const detections = [];
    
    // Antigravity
    if (fs.existsSync(geminiDir)) {
        detections.push("Google Antigravity (detected at " + geminiDir + ")");
    }
    
    // Claude Desktop
    const claudePath = process.platform === 'win32' 
        ? path.join(process.env.APPDATA || homeDir, 'Claude')
        : path.join(homeDir, 'Library', 'Application Support', 'Claude');
    if (fs.existsSync(claudePath)) {
        detections.push("Claude Desktop (detected at " + claudePath + ")");
    }
    
    // Cursor
    const cursorPath = process.platform === 'win32' 
        ? path.join(process.env.APPDATA || homeDir, 'Cursor')
        : path.join(homeDir, 'Library', 'Application Support', 'Cursor');
    if (fs.existsSync(cursorPath)) {
        detections.push("Cursor IDE (detected at " + cursorPath + ")");
    }

    // VS Code (for Cline/Roo Code)
    const vscodePath = process.platform === 'win32' 
        ? path.join(process.env.APPDATA || homeDir, 'Code')
        : path.join(homeDir, 'Library', 'Application Support', 'Code');
    if (fs.existsSync(vscodePath)) {
        detections.push("VS Code / Cline / Roo Code (detected at " + vscodePath + ")");
    }

    // Windsurf
    const windsurfPath = process.platform === 'win32' 
        ? path.join(process.env.APPDATA || homeDir, 'Windsurf')
        : path.join(homeDir, 'Library', 'Application Support', 'Windsurf');
    if (fs.existsSync(windsurfPath)) {
        detections.push("Windsurf IDE (detected at " + windsurfPath + ")");
    }

    return detections;
}

function promptMode(callback) {
    if (isAutoYes) {
        return callback({ mode: '1', platform: '1' });
    }

    const detections = detectPlatforms();
    if (detections.length > 0) {
        console.log("\nDetected Agent Environments on this system:");
        detections.forEach(d => console.log("  * " + d));
    } else {
        console.log("\nNo active agent config directories auto-detected in standard locations.");
    }

    console.log("\nTarget AI Platform:");
    console.log(" (1) Google Antigravity (Default)");
    console.log(" (2) Claude Desktop / Claude Code");
    console.log(" (3) Cursor / Generic IDE (Project-local)");
    console.log(" (4) Custom Installation (Specify custom paths manually)");
    
    rl.question("\nSelect platform [1/2/3/4]: ", (platformAns) => {
        const platform = platformAns.trim() || '1';
        
        console.log("\nInstallation Mode:");
        console.log(" (1) Merge: Keep your existing skills/MCPs and add/update BDB tools.");
        console.log(" (2) Replace: Backup and wipe your existing skills/MCPs, installing ONLY BDB tools.");
        rl.question("\nSelect mode [1/2]: ", (modeAns) => {
            const mode = modeAns.trim() === '2' ? '2' : '1';
            
            if (platform === '4') {
                // Prompt for custom paths
                console.log("\n--- Custom Path Configuration ---");
                rl.question("Target directory for global skills [default: " + path.join(homeDir, '.bdb-skills') + "]: ", (skillDir) => {
                    const customSkillDir = skillDir.trim() || path.join(homeDir, '.bdb-skills');
                    rl.question("Target directory for legacy skills [default: " + path.join(customSkillDir, 'legacy') + "]: ", (legacyDir) => {
                        const customLegacyDir = legacyDir.trim() || path.join(customSkillDir, 'legacy');
                        rl.question("Target directory for workspace skills [default: " + workspaceDir + "]: ", (workDir) => {
                            const customWorkspaceDir = workDir.trim() || workspaceDir;
                            rl.question("Target path for MCP Config JSON file [default: " + path.join(homeDir, 'mcp_config.json') + "]: ", (mcpConf) => {
                                const customMcpConfigPath = mcpConf.trim() || path.join(homeDir, 'mcp_config.json');
                                callback({
                                    mode,
                                    platform,
                                    customPaths: {
                                        skillDir: customSkillDir,
                                        legacyDir: customLegacyDir,
                                        workspaceDir: customWorkspaceDir,
                                        mcpConfigPath: customMcpConfigPath,
                                        mcpDir: path.dirname(customMcpConfigPath)
                                    }
                                });
                            });
                        });
                    });
                });
            } else {
                callback({ mode, platform });
            }
        });
    });
}

function promptMCP(callback) {
    if (isAutoYes) {
        return callback('y');
    }
    console.log("");
    rl.question("Do you also want to install the MCP Pack (Unreal, Adobe, Resolve, Grandma3, Resolume, Github, etc)? (y/n): ", (answer) => {
        callback(answer);
    });
}

function moveIfExists(src, dest, label) {
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
        console.log(` -> Backed up ${label}.`);
    }
}

function copyDirRecursiveSync(source, target) {
    if (!fs.existsSync(source)) return;
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });

    const files = fs.readdirSync(source);
    files.forEach(file => {
        const curSource = path.join(source, file);
        const curTarget = path.join(target, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyDirRecursiveSync(curSource, curTarget);
        } else {
            fs.copyFileSync(curSource, curTarget);
        }
    });
}

promptMode(({ mode, platform, customPaths }) => {
    fs.mkdirSync(backupDir, { recursive: true });
    
    let targetSkillDir = globalConfigDir;
    let targetLegacyDir = globalLegacyDir;
    let targetWorkspaceDir = workspaceDir;
    let targetMcpDir = path.join(geminiDir, 'config');
    let mcpConfigPath = path.join(targetMcpDir, 'mcp_config.json');
    
    if (platform === '2') {
        // Claude Desktop
        console.log("\n[Platform: Claude Desktop] Adapting installation paths...");
        targetSkillDir = path.join(homeDir, '.bdb-skills');
        targetLegacyDir = path.join(homeDir, '.bdb-skills', 'legacy');
        
        let claudeAppSupport = process.platform === 'win32' 
            ? path.join(process.env.APPDATA || homeDir, 'Claude')
            : path.join(homeDir, 'Library', 'Application Support', 'Claude');
            
        targetMcpDir = claudeAppSupport;
        mcpConfigPath = path.join(claudeAppSupport, 'claude_desktop_config.json');
    } else if (platform === '3') {
        // Cursor / Generic
        console.log("\n[Platform: Cursor / Generic IDE] Adapting installation paths...");
        targetSkillDir = path.join(currentDir, '.cursor', 'bdb-skills');
        targetLegacyDir = path.join(currentDir, '.cursor', 'bdb-skills', 'legacy');
        targetWorkspaceDir = path.join(currentDir, '.cursor', 'workspace_skills');
        targetMcpDir = path.join(currentDir, '.cursor');
        mcpConfigPath = path.join(targetMcpDir, 'mcp.json');
    } else if (platform === '4' && customPaths) {
        // Custom paths
        console.log("\n[Platform: Custom Path] Applying custom paths...");
        targetSkillDir = customPaths.skillDir;
        targetLegacyDir = customPaths.legacyDir;
        targetWorkspaceDir = customPaths.workspaceDir;
        targetMcpDir = customPaths.mcpDir;
        mcpConfigPath = customPaths.mcpConfigPath;
    }

    if (mode === '2') {
        console.log(`\n[Replace Mode] Creating backup of current skills in ${backupDir}...`);
        moveIfExists(targetSkillDir, path.join(backupDir, 'config_skills_backup'), 'global config skills');
        moveIfExists(targetLegacyDir, path.join(backupDir, 'legacy_skills_backup'), 'global legacy skills');
        moveIfExists(targetWorkspaceDir, path.join(backupDir, 'workspace_skills_backup'), 'workspace skills');
    } else {
        console.log(`\n[Merge Mode] Installing over existing directories. Existing skills will not be deleted.`);
    }

    console.log("\nInstalling optimized skills (140 curated skills)...");
    fs.mkdirSync(targetSkillDir, { recursive: true });
    fs.mkdirSync(targetLegacyDir, { recursive: true });
    fs.mkdirSync(targetWorkspaceDir, { recursive: true });

    copyDirRecursiveSync(path.join(srcDir, 'skills', 'global_config'), targetSkillDir);
    console.log(" -> Installed global config skills.");

    copyDirRecursiveSync(path.join(srcDir, 'skills', 'global_legacy'), targetLegacyDir);
    console.log(" -> Installed global legacy skills.");

    copyDirRecursiveSync(path.join(srcDir, 'skills', 'workspace_agents'), targetWorkspaceDir);
    console.log(" -> Installed workspace skills.");

    const geminiMdSrc = path.join(srcDir, 'GEMINI.md');
    if (platform === '1' && fs.existsSync(geminiMdSrc)) {
        fs.copyFileSync(geminiMdSrc, path.join(geminiDir, 'GEMINI.md'));
        console.log(` -> Installed GEMINI.md to ${path.join(geminiDir, 'GEMINI.md')}`);
    }

    promptMCP((answer) => {
        if (answer.toLowerCase().startsWith('y')) {
            fs.mkdirSync(targetMcpDir, { recursive: true });
            
            const mcpCodeTarget = path.join(targetMcpDir, 'mcps');
            copyDirRecursiveSync(path.join(srcDir, 'mcps'), mcpCodeTarget);
            console.log(` -> Installed local MCP servers to ${mcpCodeTarget}`);
            
            // Build / Setup Node-based MCPs
            const nodeMcps = ['adobe_uxp_mcp', 'unreal_mcp', 'tdmcp', 'touchdesigner-mcp', 'davinci-resolve-mcp', 'after-effects-mcp', 'computer-use-mcp'];
            const execSync = require('child_process').execSync;
            nodeMcps.forEach(mcpFolder => {
                const targetFolder = path.join(mcpCodeTarget, mcpFolder);
                if (fs.existsSync(path.join(targetFolder, 'package.json'))) {
                    console.log(` -> Setting up Node dependencies for ${mcpFolder}...`);
                    try {
                        execSync('npm install --no-audit --no-fund', { cwd: targetFolder, stdio: 'ignore' });
                        if (fs.existsSync(path.join(targetFolder, 'tsconfig.json')) || fs.existsSync(path.join(targetFolder, 'tsconfig.build.json'))) {
                            console.log(` -> Compiling TypeScript for ${mcpFolder}...`);
                            execSync('npm run build', { cwd: targetFolder, stdio: 'ignore' });
                        }
                    } catch (e) {
                        console.warn(`Warning: Failed to set up ${mcpFolder}: ${e.message}`);
                    }
                }
            });

            // Pre-warm Python dependencies via uv to prevent agent timeouts on first run
            const pythonMcps = [
                { folder: 'golem-rhino-mcp', cmd: 'uv run -m mcp_server --help' },
                { folder: 'davinci-mcp-professional', cmd: 'uv run main.py --help' },
                { folder: 'blender-mcp', cmd: 'uv run -m blender_mcp.server --help' },
                { folder: 'blender-mcp-server', cmd: 'uv run -m blender_mcp_server --help' },
                { folder: 'vectorworks-mcp', cmd: 'uv run -r requirements.txt app/mcp_server.py --help' }
            ];
            pythonMcps.forEach(mcp => {
                const targetFolder = path.join(mcpCodeTarget, mcp.folder);
                if (fs.existsSync(targetFolder)) {
                    console.log(` -> Pre-warming Python dependencies for ${mcp.folder}...`);
                    try {
                        execSync(mcp.cmd, { cwd: targetFolder, stdio: 'ignore' });
                    } catch (e) {
                        // ignore pre-warm warnings
                    }
                }
            });

            if (fs.existsSync(mcpConfigPath)) {
                fs.copyFileSync(mcpConfigPath, path.join(backupDir, 'mcp_config_backup.json'));
                console.log(` -> Backed up existing ${path.basename(mcpConfigPath)}`);
            }
            
            let mcpConfigStr = fs.readFileSync(path.join(srcDir, 'mcp_config.json'), 'utf8');
            mcpConfigStr = mcpConfigStr.replace(/__MCPS_DIR__/g, mcpCodeTarget);
            mcpConfigStr = mcpConfigStr.replace(/\{\{HOME\}\}/g, homeDir);
            
            if (mode === '1' && fs.existsSync(mcpConfigPath)) {
                try {
                    const oldConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
                    const newConfig = JSON.parse(mcpConfigStr);
                    oldConfig.mcpServers = Object.assign({}, oldConfig.mcpServers || {}, newConfig.mcpServers || {});
                    fs.writeFileSync(mcpConfigPath, JSON.stringify(oldConfig, null, 2));
                    console.log(` -> Merged BDB MCPs into existing ${path.basename(mcpConfigPath)}`);
                } catch (e) {
                    console.log(` -> Failed to parse existing JSON, overwriting ${path.basename(mcpConfigPath)}`);
                    fs.writeFileSync(mcpConfigPath, mcpConfigStr);
                }
            } else {
                if ((platform === '2' || platform === '4') && !fs.existsSync(mcpConfigPath)) {
                     const wrapper = { mcpServers: JSON.parse(mcpConfigStr).mcpServers };
                     fs.writeFileSync(mcpConfigPath, JSON.stringify(wrapper, null, 2));
                } else {
                     fs.writeFileSync(mcpConfigPath, mcpConfigStr);
                }
                console.log(` -> Installed optimized MCP config to ${targetMcpDir}`);
            }
        } else {
            console.log(" -> Skipping MCP installation.");
        }
        
        console.log("=========================================================");
        console.log(" Installation complete! The environment now has the ");
        console.log(" optimized skill configuration.");
        console.log("=========================================================");
        rl.close();
    });
});

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

function promptMode(callback) {
    if (isAutoYes) {
        return callback({ mode: '1', platform: '1' });
    }
    console.log("\nTarget AI Platform:");
    console.log(" (1) Google Antigravity (Default)");
    console.log(" (2) Claude Desktop / Claude Code");
    console.log(" (3) Cursor / Generic IDE");
    
    rl.question("\nSelect platform [1/2/3]: ", (platformAns) => {
        const platform = platformAns.trim() || '1';
        
        console.log("\nInstallation Mode:");
        console.log(" (1) Merge: Keep your existing skills/MCPs and add/update BDB tools.");
        console.log(" (2) Replace: Backup and wipe your existing skills/MCPs, installing ONLY BDB tools.");
        rl.question("\nSelect mode [1/2]: ", (modeAns) => {
            const mode = modeAns.trim() === '2' ? '2' : '1';
            callback({ mode, platform });
        });
    });
}

function promptMCP(callback) {
    if (isAutoYes) {
        return callback('y');
    }
    console.log("");
    rl.question("Do you also want to install the MCP Pack (Unreal, Rhino, Resolve, Grandma3, Resolume, Github, etc)? (y/n): ", (answer) => {
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

promptMode(({ mode, platform }) => {
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
                if (platform === '2' && !fs.existsSync(mcpConfigPath)) {
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

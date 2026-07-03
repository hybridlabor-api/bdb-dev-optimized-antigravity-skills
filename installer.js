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

// Format timestamp like YYYYMMDD_HHMMSS
const now = new Date();
const timestamp = now.getFullYear().toString() + 
    (now.getMonth()+1).toString().padStart(2, '0') + 
    now.getDate().toString().padStart(2, '0') + "_" + 
    now.getHours().toString().padStart(2, '0') + 
    now.getMinutes().toString().padStart(2, '0') + 
    now.getSeconds().toString().padStart(2, '0');
    
const backupDir = path.join(geminiDir, `skills_backup_${timestamp}`);

console.log(`Creating backup of current skills in ${backupDir}...`);
fs.mkdirSync(backupDir, { recursive: true });

function moveIfExists(src, dest, label) {
    if (fs.existsSync(src)) {
        fs.renameSync(src, dest);
        console.log(` -> Backed up ${label}.`);
    }
}

moveIfExists(globalConfigDir, path.join(backupDir, 'config_skills_backup'), 'global config skills');
moveIfExists(globalLegacyDir, path.join(backupDir, 'legacy_skills_backup'), 'global legacy skills');
moveIfExists(workspaceDir, path.join(backupDir, 'workspace_skills_backup'), 'workspace skills');

console.log("\nInstalling optimized skills (140 curated skills)...");

fs.mkdirSync(globalConfigDir, { recursive: true });
fs.mkdirSync(globalLegacyDir, { recursive: true });
fs.mkdirSync(workspaceDir, { recursive: true });

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

copyDirRecursiveSync(path.join(srcDir, 'skills', 'global_config'), globalConfigDir);
console.log(" -> Installed global config skills.");

copyDirRecursiveSync(path.join(srcDir, 'skills', 'global_legacy'), globalLegacyDir);
console.log(" -> Installed global legacy skills.");

copyDirRecursiveSync(path.join(srcDir, 'skills', 'workspace_agents'), workspaceDir);
console.log(" -> Installed workspace skills.");

console.log("");
const geminiMdSrc = path.join(srcDir, 'GEMINI.md');
if (fs.existsSync(geminiMdSrc)) {
    fs.copyFileSync(geminiMdSrc, path.join(geminiDir, 'GEMINI.md'));
    console.log(` -> Installed GEMINI.md to ${path.join(geminiDir, 'GEMINI.md')}`);
}

console.log("");
rl.question("Do you also want to install the MCP Pack (Unreal, Rhino, Resolve, Grandma3, Resolume, Github, Chrome DevTools)? (y/n): ", function(answer) {
    if (answer.toLowerCase().startsWith('y')) {
        const configDir = path.join(geminiDir, 'config');
        fs.mkdirSync(configDir, { recursive: true });
        
        const mcpTarget = path.join(configDir, 'mcp_config.json');
        if (fs.existsSync(mcpTarget)) {
            fs.copyFileSync(mcpTarget, path.join(backupDir, 'mcp_config_backup.json'));
            console.log(" -> Backed up existing mcp_config.json");
        }
        fs.copyFileSync(path.join(srcDir, 'mcp_config.json'), mcpTarget);
        console.log(` -> Installed optimized mcp_config.json to ${configDir}`);
    } else {
        console.log(" -> Skipping MCP installation.");
    }
    
    console.log("=========================================================");
    console.log(" Installation complete! The environment now has the ");
    console.log(" optimized skill configuration.");
    console.log("=========================================================");
    rl.close();
});

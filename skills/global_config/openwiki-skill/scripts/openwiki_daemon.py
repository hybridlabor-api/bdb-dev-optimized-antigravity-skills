#!/usr/bin/env python3
import os
import sys
import json
import time
import argparse
import subprocess
from datetime import datetime

def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    print(formatted)
    
    # Write to ~/.openwiki/daemon.log
    home = os.path.expanduser("~")
    log_dir = os.path.join(home, ".openwiki")
    os.makedirs(log_dir, exist_ok=True)
    log_file = os.path.join(log_dir, "daemon.log")
    try:
        with open(log_file, "a") as f:
            f.write(formatted + "\n")
    except Exception as e:
        print(f"Error writing to log file: {e}")

def get_projects():
    home = os.path.expanduser("~")
    config_dir = os.path.join(home, ".openwiki")
    os.makedirs(config_dir, exist_ok=True)
    config_file = os.path.join(config_dir, "projects.json")
    
    if not os.path.exists(config_file):
        # Create a default configuration with the current workspace
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
        default_data = {
            "projects": [
                repo_root
            ],
            "interval_seconds": 3600
        }
        try:
            with open(config_file, "w") as f:
                json.dump(default_data, f, indent=2)
            log(f"Created default config file at {config_file}")
        except Exception as e:
            log(f"Error writing default config: {e}")
            return [os.getcwd()], 3600
            
    try:
        with open(config_file, "r") as f:
            data = json.load(f)
            return data.get("projects", []), data.get("interval_seconds", 3600)
    except Exception as e:
        log(f"Error reading projects config: {e}")
        return [], 3600

def check_and_update_project(project_dir):
    if not os.path.exists(project_dir):
        log(f"Project directory does not exist: {project_dir}")
        return False
        
    git_dir = os.path.join(project_dir, ".git")
    if not os.path.exists(git_dir):
        log(f"Not a git repository: {project_dir}")
        return False
        
    log(f"Checking project: {project_dir}")
    
    # Run the openwiki_helper script to collect Git change evidence
    helper_path = os.path.expanduser("~/.gemini/config/skills/openwiki-skill/scripts/openwiki_helper.py")
    if not os.path.exists(helper_path):
        # Fallback to local repo path if helper isn't installed globally yet
        helper_path = os.path.join(os.path.dirname(__file__), "openwiki_helper.py")
        
    try:
        res = subprocess.run(
            ["python3", helper_path, "--command", "collect", "--cwd", project_dir],
            capture_output=True,
            text=True,
            check=True
        )
        evidence = res.stdout
    except Exception as e:
        log(f"Error running helper collect in {project_dir}: {e}")
        return False
        
    # Check if there are meaningful changes to document
    has_changes = False
    
    # If the wiki folder doesn't exist yet, we must run the initial build
    if not os.path.exists(os.path.join(project_dir, ".openwiki")):
        has_changes = True
        log(f"No .openwiki folder found. Triggering initial documentation build for {project_dir}")
    
    # Look for changes since last wiki run or unstaged changes
    if "### Git Changes since last Wiki Update" in evidence:
        section = evidence.split("### Git Changes since last Wiki Update")[1].split("###")[0].strip()
        if section and section != "(no output)" and section != "(no changes in commits)":
            has_changes = True
            log(f"Found new commits since last update in {project_dir}")
            
    if "### Unstaged File Diffs" in evidence:
        section = evidence.split("### Unstaged File Diffs")[1].strip()
        if section and section != "(no unstaged changes)" and section != "(clean working directory)":
            has_changes = True
            log(f"Found unstaged changes in {project_dir}")
            
    if "Not a git repository" in evidence:
        log(f"Git is not initialized in {project_dir}")
        return False

    if not has_changes:
        log(f"No changes detected for {project_dir}. Skipping documentation update.")
        return False
        
    # Run agy in non-interactive print mode to run the openwiki-skill
    log(f"Triggering autonomous documentation rebuild for {project_dir} via Antigravity...")
    agy_path = "/opt/homebrew/bin/agy"
    if not os.path.exists(agy_path):
        agy_path = "agy" # fallback to path search
        
    try:
        # Prompt the agent to run the openwiki-skill. It will run in the background
        # and auto-commit the files separately using --dangerously-skip-permissions.
        cmd = [
            agy_path, 
            "--prompt", 
            "Run the openwiki-skill to synchronize my documentation and commit changes.", 
            "--dangerously-skip-permissions"
        ]
        log(f"Running command: {' '.join(cmd)}")
        run_res = subprocess.run(
            cmd,
            cwd=project_dir,
            capture_output=True,
            text=True
        )
        if run_res.returncode == 0:
            log(f"Successfully completed documentation update for {project_dir}")
            return True
        else:
            log(f"Failed to update documentation for {project_dir}: {run_res.stderr}")
            return False
    except Exception as e:
        log(f"Exception running agy for {project_dir}: {e}")
        return False

def run_daemon_loop():
    log("Starting OpenWiki Daemon background monitoring loop...")
    while True:
        projects, interval = get_projects()
        log(f"Scanning {len(projects)} registered projects...")
        for project in projects:
            check_and_update_project(project)
        log(f"Scan complete. Sleeping for {interval} seconds...")
        time.sleep(interval)

def main():
    parser = argparse.ArgumentParser(description="OpenWiki Daemon Controller")
    parser.add_argument("--one-shot", action="store_true", help="Run once and exit instead of loop")
    args = parser.parse_args()
    
    if args.one_shot:
        log("Running OpenWiki check in one-shot mode...")
        projects, _ = get_projects()
        for project in projects:
            check_and_update_project(project)
    else:
        run_daemon_loop()

if __name__ == "__main__":
    main()

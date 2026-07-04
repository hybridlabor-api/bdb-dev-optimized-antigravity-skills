from typing import List, Optional
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB DaVinci MCP")

def get_resolve():
    try:
        import DaVinciResolveScript as dvr_script
        return dvr_script.scriptapp("Resolve")
    except ImportError:
        return None

@mcp.tool()
def davinci_ping() -> str:
    """Check if DaVinci Resolve is running and accessible."""
    resolve = get_resolve()
    if resolve:
        return "DaVinci Resolve is active and API is accessible."
    return "DaVinci Resolve API not found. Please ensure DaVinciResolveScript is in PYTHONPATH."

@mcp.tool()
def get_current_timeline() -> str:
    """Get the name of the current timeline in DaVinci Resolve."""
    resolve = get_resolve()
    if not resolve:
        return "Error: DaVinci Resolve API not accessible."
    
    project_manager = resolve.GetProjectManager()
    project = project_manager.GetCurrentProject()
    if not project:
        return "No project is currently open."
    
    timeline = project.GetCurrentTimeline()
    if not timeline:
        return "No timeline is currently open."
    
    return f"Current Timeline: {timeline.GetName()}"

@mcp.tool()
def add_media_to_pool(file_paths: List[str]) -> str:
    """Add a list of media file paths to the DaVinci Resolve media pool."""
    resolve = get_resolve()
    if not resolve:
        return "Error: DaVinci Resolve API not accessible."
    
    project_manager = resolve.GetProjectManager()
    project = project_manager.GetCurrentProject()
    if not project:
        return "No project is currently open."
    
    media_pool = project.GetMediaPool()
    
    items = media_pool.ImportMedia(file_paths)
    if not items:
        return "Failed to import media or no items were returned."
    
    return f"Successfully imported {len(items)} items to the Media Pool."

@mcp.tool()
def render_current_timeline(preset_name: Optional[str] = None) -> str:
    """Start rendering the current timeline, optionally using a preset name."""
    resolve = get_resolve()
    if not resolve:
        return "Error: DaVinci Resolve API not accessible."
    
    project_manager = resolve.GetProjectManager()
    project = project_manager.GetCurrentProject()
    if not project:
        return "No project is currently open."
    
    if preset_name:
        if not project.LoadRenderPreset(preset_name):
            return f"Failed to load render preset '{preset_name}'."
    
    project.StartRendering()
    return "Rendering started."

if __name__ == "__main__":
    mcp.run()

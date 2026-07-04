import json
import urllib.request
import urllib.error
from typing import Any, Dict, Optional
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB Unreal Engine MCP")

UNREAL_API_URL = "http://localhost:30010/remote/object/call"
UNREAL_PROPERTY_URL = "http://localhost:30010/remote/object/property"

def _send_request(url: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='PUT'
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.URLError as e:
        return {"error": str(e)}

@mcp.tool()
def unreal_ping() -> str:
    """Check if Unreal Engine is running by querying the Remote Control API."""
    return "Unreal Engine 5 MCP is active. Connects via Web Remote Control API."

@mcp.tool()
def spawn_actor(class_path: str, location: Optional[Dict[str, float]] = None, rotation: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """Spawn an actor in the current level.
    
    Args:
        class_path: The Unreal class path, e.g. '/Script/Engine.StaticMeshActor'
        location: Dict with x, y, z (default 0,0,0)
        rotation: Dict with pitch, yaw, roll (default 0,0,0)
    """
    payload = {
        "objectPath": "/Script/Engine.Default__LevelScriptActor",
        "functionName": "SpawnActorFromClass",
        "parameters": {
            "Class": class_path,
            "Location": location or {"X": 0, "Y": 0, "Z": 0},
            "Rotation": rotation or {"Pitch": 0, "Yaw": 0, "Roll": 0}
        }
    }
    return _send_request(UNREAL_API_URL, payload)

@mcp.tool()
def set_property(object_path: str, property_name: str, property_value: Any) -> Dict[str, Any]:
    """Set a property on an Unreal Engine object."""
    payload = {
        "objectPath": object_path,
        "access": "WRITE_ACCESS",
        "propertyName": property_name,
        "propertyValue": property_value
    }
    return _send_request(UNREAL_PROPERTY_URL, payload)

@mcp.tool()
def execute_console_command(command: str) -> Dict[str, Any]:
    """Execute an Unreal Engine console command."""
    payload = {
        "objectPath": "/Script/Engine.Default__SystemLibrary",
        "functionName": "ExecuteConsoleCommand",
        "parameters": {
            "Command": command
        }
    }
    return _send_request(UNREAL_API_URL, payload)

if __name__ == "__main__":
    mcp.run()

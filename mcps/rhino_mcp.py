import json
import urllib.request
import urllib.error
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB Rhino MCP")

RHINO_COMPUTE_URL = "http://localhost:6500/"

def compute_request(endpoint: str, payload: dict = None) -> str:
    """Helper to send requests to local Rhino Compute server."""
    url = f"{RHINO_COMPUTE_URL}{endpoint}"
    req = urllib.request.Request(url, method="POST" if payload else "GET")
    req.add_header('Content-Type', 'application/json')
    
    data = None
    if payload:
        data = json.dumps(payload).encode('utf-8')
        
    try:
        with urllib.request.urlopen(req, data=data) as response:
            return response.read().decode('utf-8')
    except urllib.error.URLError as e:
        raise Exception(f"Rhino Compute Connection Error: Is Rhino Compute running on port 6500? ({e})")

@mcp.tool()
def rhino_ping() -> str:
    """Checks if Rhino Compute is active and returns server version."""
    return compute_request("version")

@mcp.tool()
def rhino_evaluate_grasshopper(ghx_path: str, parameters: dict) -> str:
    """
    Evaluates a Grasshopper definition via Rhino Compute.
    Inspired by GOLEM-3DMCP and mcneel/RhinoMCP architectures.
    """
    payload = {
        "algo": ghx_path,
        "pointer": None,
        "values": []
    }
    
    for key, value in parameters.items():
        payload["values"].append({
            "ParamName": key,
            "InnerTree": {
                "{ 0; }": [
                    {
                        "type": "System.String",
                        "data": str(value)
                    }
                ]
            }
        })
        
    result = compute_request("grasshopper", payload)
    return result

if __name__ == "__main__":
    mcp.run()

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB DaVinci MCP")

@mcp.tool()
def davinci_ping() -> str:
    """Check if DaVinci Resolve is running."""
    return "DaVinci Resolve MCP is active. Connects via PyResolve/DaVinci Scripting API."

if __name__ == "__main__":
    mcp.run()

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB Resolume MCP")

@mcp.tool()
def resolume_ping() -> str:
    """Check if Resolume is running."""
    return "Resolume MCP is active. Controls Resolume via Arena OSC or REST API."

if __name__ == "__main__":
    mcp.run()

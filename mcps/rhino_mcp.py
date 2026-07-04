from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB Rhino MCP")

@mcp.tool()
def rhino_ping() -> str:
    """Check if Rhino is running."""
    return "Rhino MCP is active. Custom commands can be implemented here via Rhino.Inside or Rhino Compute."

if __name__ == "__main__":
    mcp.run()

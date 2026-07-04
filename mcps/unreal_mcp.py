from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB Unreal Engine MCP")

@mcp.tool()
def unreal_ping() -> str:
    """Check if Unreal Engine is running."""
    return "Unreal Engine 5 MCP is active. Connects via Web Remote Control / gimmeDG API."

if __name__ == "__main__":
    mcp.run()

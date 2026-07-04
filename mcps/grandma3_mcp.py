from mcp.server.fastmcp import FastMCP

mcp = FastMCP("BDB grandMA3 MCP")

@mcp.tool()
def grandma3_ping() -> str:
    """Check if grandMA3 is running."""
    return "grandMA3 MCP is active. Use Telnet or Lua OSC to execute commands."

if __name__ == "__main__":
    mcp.run()

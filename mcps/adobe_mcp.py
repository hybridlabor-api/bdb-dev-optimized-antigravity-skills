from mcp.server.fastmcp import FastMCP
import subprocess

mcp = FastMCP("Adobe Suite MCP")

def execute_adobe_jsx(app_name: str, jsx_code: str) -> str:
    escaped_jsx = jsx_code.replace('"', '\\"')
    command = "do javascript"
    if "After Effects" in app_name:
        command = "DoScript"
        
    apple_script = f'''
    tell application "{app_name}"
        {command} "{escaped_jsx}"
    end tell
    '''
    
    result = subprocess.run(["osascript", "-e", apple_script], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Adobe Script Error: {result.stderr}")
        
    return result.stdout.strip()

@mcp.tool()
def ps_add_text_layer(text: str, font_size: int = 24) -> str:
    """Adds a text layer to the active Photoshop document."""
    jsx = f"""
    if (app.documents.length > 0) {{
        var doc = app.activeDocument;
        var artLayer = doc.artLayers.add();
        artLayer.kind = LayerKind.TEXT;
        var textItem = artLayer.textItem;
        textItem.contents = "{text}";
        textItem.size = {font_size};
        "Success";
    }} else {{
        "Error: No active document";
    }}
    """
    return execute_adobe_jsx("Adobe Photoshop", jsx)

@mcp.tool()
def ae_render_active_comp() -> str:
    """Adds active composition to render queue and renders it in After Effects."""
    jsx = """
    var comp = app.project.activeItem;
    if (comp != null && comp instanceof CompItem) {
        app.project.renderQueue.items.add(comp);
        app.project.renderQueue.render();
        "Render Complete";
    } else {
        "Error: No active comp";
    }
    """
    return execute_adobe_jsx("Adobe After Effects", jsx)

@mcp.tool()
def pr_get_sequences() -> str:
    """Gets the names of all sequences in Premiere Pro."""
    jsx = """
    var seqs = app.project.sequences;
    var names = [];
    if (seqs) {
        for (var i = 0; i < seqs.numSequences; i++) {
            names.push(seqs[i].name);
        }
    }
    names.join(", ");
    """
    return execute_adobe_jsx("Adobe Premiere Pro", jsx)

@mcp.tool()
def ai_create_document() -> str:
    """Creates a new default document in Illustrator."""
    jsx = """
    var doc = app.documents.add();
    "Created new Illustrator document";
    """
    return execute_adobe_jsx("Adobe Illustrator", jsx)

if __name__ == "__main__":
    mcp.run()

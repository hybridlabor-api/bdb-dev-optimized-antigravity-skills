import sys, json
def main():
    while True:
        line = sys.stdin.readline()
        if not line: break
        line = line.strip()
        if not line: continue
        try:
            req = json.loads(line)
            if req.get("method") == "initialize":
                res = {"jsonrpc": "2.0", "id": req.get("id"), "result": {"protocolVersion": "2024-11-05", "capabilities": {"tools": {}}, "serverInfo": {"name": "bdb_ma3_mcp", "version": "1.0.0"}}}
                sys.stdout.write(json.dumps(res) + "\n")
                sys.stdout.flush()
            elif req.get("method") == "tools/list":
                res = {"jsonrpc": "2.0", "id": req.get("id"), "result": {"tools": []}}
                sys.stdout.write(json.dumps(res) + "\n")
                sys.stdout.flush()
        except Exception:
            pass
if __name__ == "__main__":
    main()

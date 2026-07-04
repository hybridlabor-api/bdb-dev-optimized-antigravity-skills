#!/usr/bin/env node
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const req = JSON.parse(line);
    if (req.method === 'initialize') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id: req.id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'unreal-mcp', version: '1.0.0' } } }));
    } else if (req.method === 'tools/list') {
      console.log(JSON.stringify({ jsonrpc: '2.0', id: req.id, result: { tools: [] } }));
    }
  } catch (e) {}
});

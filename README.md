### SSH MCP Server (TypeScript, Node 22)

Provides two tools over MCP stdio transport:

- **ssh_test_connection**: Tests connectivity to the configured host and returns hostname.
- **ssh_run**: Executes a command remotely and returns stdout, stderr, and exit code.

Environment variables expected (set via MCP server configuration JSON):

- `SSH_HOST`: target IP/hostname
- `SSH_PORT`: optional, defaults to `22`
- `SSH_USERNAME`: SSH username
- `SSH_PASSWORD`: SSH password

Scripts:

- `npm run dev` — run server with tsx
- `npm run build` — compile to `dist/`
- `npm start` — run compiled server

Remote HTTP usage via Smithery (MCP JSON config):

Add this to your MCP client config after deployment (replace the URL with your Smithery server URL):

```json
{
  "mcpServers": {
    "ssh-mcp-remote": {
      "type": "http",
      "url": "https://server.smithery.ai/<owner>/<repo>/mcp"
    }
  }
}
```

Note: SSH connection details (`sshHost`, `sshPort`, `sshUsername`, `sshPassword`) are supplied in Smithery's server configuration UI at connect time, not in your local MCP JSON.

Example MCP config entry:

```json
{
  "mcpServers": {
    "ssh-mcp": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "SSH_HOST": "192.0.2.10",
        "SSH_PORT": "22",
        "SSH_USERNAME": "ubuntu",
        "SSH_PASSWORD": "supersecret"
      }
    }
  }
}
```



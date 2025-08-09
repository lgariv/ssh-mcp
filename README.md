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

Add this to your MCP client config to use the remote server deployed at `@lgariv/ssh-mcp`:

```json
{
  "mcpServers": {
    "ssh-mcp-remote": {
      "type": "http",
      "url": "https://server.smithery.ai/lgariv/ssh-mcp/mcp"
    }
  }
}
```

Note: SSH connection details (`sshHost`, `sshPort`, `sshUsername`, `sshPassword`) are supplied in Smithery's server configuration UI at connect time, not in your local MCP JSON.

### Local stdio usage (SSH runs from your machine)

1) Install locally

```bash
git clone https://github.com/lgariv/ssh-mcp
cd ssh-mcp
npm install
npm run build
```

2) Add to your MCP client config

```json
{
  "mcpServers": {
    "ssh-mcp-local": {
      "command": "node",
      "args": ["./dist/index.js"],
      "env": {
        "SSH_HOST": "1.2.3.4",
        "SSH_PORT": "22",
        "SSH_USERNAME": "ubuntu",
        "SSH_PASSWORD": "your-password"
      }
    }
  }
}
```

### Local stdio without cloning (via Smithery CLI)

Keeps execution local but avoids cloning the repo:

```json
{
  "mcpServers": {
    "ssh-mcp-local": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@smithery/cli@latest", "run", "@lgariv/ssh-mcp"],
      "env": {
        "SSH_HOST": "1.2.3.4",
        "SSH_PORT": "22",
        "SSH_USERNAME": "ubuntu",
        "SSH_PASSWORD": "your-password"
      }
    }
  }
}
```

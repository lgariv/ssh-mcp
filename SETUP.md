# SSH MCP Setup Guide

## Quick Start

Choose the method that best fits your needs:

### For Local Network Access (LAN, Private IPs)
Use **Method 2** (NPM Package) - Runs on your machine, can access local resources.

### For Public Servers Only
Use **Method 3** (Smithery) - Runs on cloud infrastructure, cannot access private networks.

### For Development
Use **Method 1** (Source) - Clone and modify the code locally.

## Detailed Setup Instructions

### Method 1: From Source (Development)

```bash
# Clone repository
git clone https://github.com/lgariv/ssh-mcp
cd ssh-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Configure in your MCP client
# Use absolute path to the dist/index.js file
```

### Method 2: NPM Package (Local Networks)

Simply add to your MCP client configuration:

```json
{
  "mcpServers": {
    "ssh-mcp": {
      "command": "npx",
      "args": ["-y", "@lgariv/ssh-mcp@latest"],
      "env": {
        "SSH_HOST": "192.168.1.100",
        "SSH_PORT": "22",
        "SSH_USERNAME": "your-username",
        "SSH_PASSWORD": "your-password"
      }
    }
  }
}
```

### Method 3: Smithery (Public Servers)

For publicly accessible servers only:

```json
{
  "mcpServers": {
    "ssh-mcp": {
      "type": "http",
      "url": "https://server.smithery.ai/lgariv/ssh-mcp/mcp",
      "config": {
        "sshHost": "public.example.com",
        "sshPort": 22,
        "sshUsername": "ubuntu",
        "sshPassword": "your-password"
      }
    }
  }
}
```

## Troubleshooting

### Tools not appearing in Cursor
1. Restart Cursor after adding the configuration
2. Check the MCP output panel for errors
3. Verify your SSH credentials are correct

### Connection timeouts
- For local networks: Use Method 2 (NPM)
- For public servers: Ensure the server is accessible from the internet
- Check firewall settings on the target server

### Testing the connection
After configuration, you can test with the `ssh_test_connection` tool which will return the hostname if successful.

## Security Considerations

- **Methods 1 & 2**: Credentials stay on your local machine
- **Method 3**: Credentials are sent to Smithery's servers
- Always use strong passwords
- Consider SSH keys for production environments
- Protect your MCP configuration file

## Need Help?

Check the examples in `examples/mcp-config-examples.json` for complete configuration samples.

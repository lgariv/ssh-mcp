# SSH MCP Server

A Model Context Protocol (MCP) server that enables SSH connectivity and remote command execution. This server can run locally to access private networks or via Smithery for public servers.

## Features

- **ssh_test_connection**: Tests connectivity to the configured host and returns hostname
- **ssh_run**: Executes commands remotely and returns stdout, stderr, and exit code

## Installation Methods

### Method 1: From Source (For Development)

Best for developers who want to modify the code or contribute to the project.

1. Clone and build:
```bash
git clone https://github.com/lgariv/ssh-mcp
cd ssh-mcp
npm install
npm run build
```

2. Add to your MCP client config:
```json
{
  "mcpServers": {
    "ssh-mcp": {
      "command": "node",
      "args": ["path/to/ssh-mcp/dist/index.js"],
      "env": {
        "SSH_HOST": "192.168.1.100",
        "SSH_PORT": "22",
        "SSH_USERNAME": "ubuntu",
        "SSH_PASSWORD": "your-password"
      }
    }
  }
}
```

### Method 2: Via NPM Package (Recommended for Local Networks)

Best for accessing servers on your local network (LAN) or private IPs. Runs on your machine.

Add to your MCP client config:
```json
{
  "mcpServers": {
    "ssh-mcp": {
      "command": "npx",
      "args": ["-y", "@lgariv/ssh-mcp@latest"],
      "env": {
        "SSH_HOST": "10.0.0.116",
        "SSH_PORT": "22",
        "SSH_USERNAME": "admin",
        "SSH_PASSWORD": "your-password"
      }
    }
  }
}
```

**Benefits:**
- No installation required
- Always uses the latest version
- Can access local network resources (192.168.x.x, 10.x.x.x, etc.)
- Credentials stay on your machine

### Method 3: Via Smithery (For Public Servers Only)

Best for accessing publicly accessible SSH servers. Runs on Smithery's infrastructure.

⚠️ **Important:** This method only works with publicly accessible servers. It cannot access private IPs or LAN resources.

Add to your MCP client config:
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

## Configuration

All methods require these environment variables or config parameters:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `SSH_HOST` / `sshHost` | Target SSH server IP/hostname | Required |
| `SSH_PORT` / `sshPort` | SSH port number | 22 |
| `SSH_USERNAME` / `sshUsername` | SSH username | Required |
| `SSH_PASSWORD` / `sshPassword` | SSH password | Required |

## Use Cases by Method

| Use Case | Recommended Method |
|----------|-------------------|
| Local home lab servers | Method 2 (NPM) |
| Raspberry Pi on LAN | Method 2 (NPM) |
| Local VMs or containers | Method 2 (NPM) |
| Development and testing | Method 1 (Source) |
| Cloud VPS with public IP | Method 3 (Smithery) |
| Public web servers | Method 3 (Smithery) |

## Security Notes

- **Methods 1 & 2**: Credentials are stored locally in your MCP configuration
- **Method 3**: Credentials are sent to Smithery's servers (use only with public servers)
- Always use strong passwords and consider SSH keys for production use
- Ensure your MCP configuration file has appropriate permissions

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run built version
npm start
```

## License

ISC

## Author

lgariv
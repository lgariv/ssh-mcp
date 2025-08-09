# Contributing to SSH MCP

Thank you for your interest in contributing to SSH MCP!

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Make your changes in the `src/` directory
4. Build the project: `npm run build`
5. Test locally: `npm start`

## Testing Your Changes

### Local Testing
```bash
# Set environment variables
export SSH_HOST="your-test-server"
export SSH_PORT="22"
export SSH_USERNAME="your-username"
export SSH_PASSWORD="your-password"

# Run in development mode
npm run dev
```

### Testing with MCP Client
Update your MCP client config to point to your local build:
```json
{
  "mcpServers": {
    "ssh-mcp-dev": {
      "command": "node",
      "args": ["./path/to/your/fork/dist/index.js"],
      "env": {
        "SSH_HOST": "test-server",
        "SSH_PORT": "22",
        "SSH_USERNAME": "test-user",
        "SSH_PASSWORD": "test-password"
      }
    }
  }
}
```

## Pull Request Process

1. Ensure your code builds without errors
2. Update the README.md if you've added new features
3. Increment the version in package.json following semantic versioning
4. Create a pull request with a clear description of changes

## Code Style

- Use TypeScript for all new code
- Follow the existing code structure
- Add comments for complex logic
- Keep the MCP protocol implementation clean and standard-compliant

## Questions?

Open an issue on GitHub if you have questions or need help.

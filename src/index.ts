import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { Client as SSHClient, ConnectConfig, type ClientChannel } from "ssh2";

type SshEnv = {
  SSH_HOST: string | undefined;
  SSH_PORT: string | undefined;
  SSH_USERNAME: string | undefined;
  SSH_PASSWORD: string | undefined;
};

function getEnv(): Required<SshEnv> {
  const env: SshEnv = {
    SSH_HOST: process.env.SSH_HOST,
    SSH_PORT: process.env.SSH_PORT ?? "22",
    SSH_USERNAME: process.env.SSH_USERNAME,
    SSH_PASSWORD: process.env.SSH_PASSWORD,
  };
  const missing: string[] = [];
  if (!env.SSH_HOST) missing.push("SSH_HOST");
  if (!env.SSH_USERNAME) missing.push("SSH_USERNAME");
  if (!env.SSH_PASSWORD) missing.push("SSH_PASSWORD");
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Configure them in your MCP server config.`
    );
  }
  return env as Required<SshEnv>;
}

async function createSshConnection(): Promise<SSHClient> {
  const env = getEnv();
  const ssh = new SSHClient();
  const config: ConnectConfig = {
    host: env.SSH_HOST,
    port: Number(env.SSH_PORT),
    username: env.SSH_USERNAME,
    password: env.SSH_PASSWORD,
    readyTimeout: 15000,
    tryKeyboard: false,
    algorithms: {
      // Keep defaults; allow host key algo negotiation modern-first
    },
  };
  await new Promise<void>((resolve, reject) => {
    ssh
      .on("ready", () => resolve())
      .on("error", (err: Error) => reject(err))
      .connect(config);
  });
  return ssh;
}

async function runRemoteCommand(ssh: SSHClient, command: string): Promise<{ exitCode: number; stdout: string; stderr: string }>{
  return await new Promise((resolve, reject) => {
    ssh.exec(command, (err: Error | undefined, stream: ClientChannel) => {
      if (err) return reject(err);
      let stdout = "";
      let stderr = "";
      stream
        .on("close", (code: number) => {
          resolve({ exitCode: code ?? 0, stdout, stderr });
        })
        .on("data", (data: Buffer) => {
          stdout += data.toString();
        })
        .stderr.on("data", (data: Buffer) => {
          stderr += data.toString();
        });
    });
  });
}

async function main(): Promise<void> {
  const server = new McpServer({
    name: "ssh-mcp-server",
    version: "1.0.0",
  });

  server.registerTool(
    "ssh_test_connection",
    {
      title: "Test SSH Connection",
      description: "Attempts to connect to the configured SSH host and returns the remote hostname",
      inputSchema: {},
    },
    async () => {
      try {
        const ssh = await createSshConnection();
        try {
          const { stdout, stderr, exitCode } = await runRemoteCommand(ssh, "hostname");
          ssh.end();
          const details = JSON.stringify(
            { exitCode, stderr: stderr.trim(), stdout: stdout.trim() },
            null,
            2
          );
          return { content: [{ type: "text", text: details }] };
        } finally {
          // Ensure connection is closed if not already
          ssh.end();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `SSH connection failed: ${message}` }], isError: true };
      }
    }
  );

  server.registerTool(
    "ssh_run",
    {
      title: "Run Remote Command",
      description: "Runs a non-interactive command remotely over SSH and returns stdout, stderr, and exit code",
      inputSchema: { command: z.string().min(1).describe("Command to run remotely") },
    },
    async ({ command }) => {
      try {
        const ssh = await createSshConnection();
        try {
          const result = await runRemoteCommand(ssh, command);
          ssh.end();
          const text = JSON.stringify(
            { command, ...result, stdout: result.stdout.trim(), stderr: result.stderr.trim() },
            null,
            2
          );
          return { content: [{ type: "text", text }] };
        } finally {
          ssh.end();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `SSH command failed: ${message}` }], isError: true };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});



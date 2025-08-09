import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Client as SSHClient, type ConnectConfig, type ClientChannel } from "ssh2";

export const configSchema = z.object({
  sshHost: z.string().describe("Target SSH IP/hostname"),
  sshPort: z.number().int().positive().default(22).describe("SSH port"),
  sshUsername: z.string().describe("SSH username"),
  sshPassword: z.string().describe("SSH password"),
});

type SshConfig = z.infer<typeof configSchema>;

async function createSshConnection(cfg: SshConfig): Promise<SSHClient> {
  const ssh = new SSHClient();
  const connectConfig: ConnectConfig = {
    host: cfg.sshHost,
    port: cfg.sshPort,
    username: cfg.sshUsername,
    password: cfg.sshPassword,
    readyTimeout: 15000,
    tryKeyboard: false,
  };

  await new Promise<void>((resolve, reject) => {
    ssh
      .on("ready", () => resolve())
      .on("error", (err: Error) => reject(err))
      .connect(connectConfig);
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

export default function ({ config }: { config: SshConfig }) {
  const server = new McpServer({ name: "ssh-mcp-server", version: "1.0.0" });

  server.registerTool(
    "ssh_test_connection",
    {
      title: "Test SSH Connection",
      description: "Attempts to connect and returns the remote hostname",
      inputSchema: {},
    },
    async () => {
      try {
        const ssh = await createSshConnection(config);
        try {
          const { stdout, stderr, exitCode } = await runRemoteCommand(ssh, "hostname");
          ssh.end();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ exitCode, stdout: stdout.trim(), stderr: stderr.trim() }, null, 2),
              },
            ],
          };
        } finally {
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
      description: "Runs a non-interactive command on the remote host",
      inputSchema: { command: z.string().min(1).describe("Command to run remotely") },
    },
    async ({ command }) => {
      try {
        const ssh = await createSshConnection(config);
        try {
          const result = await runRemoteCommand(ssh, command);
          ssh.end();
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { command, ...result, stdout: result.stdout.trim(), stderr: result.stderr.trim() },
                  null,
                  2
                ),
              },
            ],
          };
        } finally {
          ssh.end();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: `SSH command failed: ${message}` }], isError: true };
      }
    }
  );

  return server.server;
}



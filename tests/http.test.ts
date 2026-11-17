import { type ChildProcess, spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { z } from 'zod';

const token = 'ci-auth-token-with-at-least-32-characters';
let server: ChildProcess | undefined;
let baseUrl: string;

beforeAll(async () => {
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const address = socket.address();
  if (address === null || typeof address === 'string') {
    throw new Error('Could not allocate a TCP port');
  }
  const port = address.port;
  await new Promise<void>((resolve, reject) => socket.close((error) => (error ? reject(error) : resolve())));
  baseUrl = `http://127.0.0.1:${port}`;

  const child = spawn(process.execPath, ['dist/index.js'], {
    env: {
      ...process.env,
      NODE_ENV: 'test',
      MCP_HTTP_HOST: '127.0.0.1',
      MCP_HTTP_PORT: String(port),
      MCP_AUTH_TOKENS: token,
      GROWI_DEFAULT_APP_NAME: 'ci',
      GROWI_APP_NAME_1: 'ci',
      GROWI_BASE_URL_1: 'http://127.0.0.1:1',
      GROWI_API_TOKEN_1: 'ci-growi-token',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server = child;
  await new Promise<void>((resolve, reject) => {
    let output = '';
    const signal = AbortSignal.timeout(15_000);
    signal.addEventListener('abort', () => reject(new Error(`Server startup timed out: ${output}`)), { once: true });
    child.on('error', reject);
    child.on('exit', (code) => reject(new Error(`Server exited with ${code}: ${output}`)));
    child.stderr.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });
    child.stdout.on('data', (chunk: Buffer) => {
      output += chunk.toString();
      if (output.includes('GROWI MCP HTTP server started')) resolve();
    });
  });
}, 20_000);

afterAll(async () => {
  if (server !== undefined && server.exitCode === null && server.signalCode === null) {
    const exited = once(server, 'exit');
    server.kill();
    await exited;
  }
});

it('serves the health endpoint from the production bundle', async () => {
  const response = await fetch(`${baseUrl}/health`);

  expect(response.status).toBe(200);
  expect(await response.text()).toBe('ok');
});

it.each([undefined, 'Bearer invalid-token'])('rejects MCP access with authorization %s', async (authorization) => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: authorization === undefined ? {} : { authorization },
  });

  expect(response.status).toBe(401);
});

it('initializes an authenticated MCP session with the production bundle', async () => {
  const response = await fetch(`${baseUrl}/mcp`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'ci', version: '1.0.0' } },
    }),
  });

  expect(response.status).toBe(200);
  const text = await response.text();
  const data =
    text.startsWith('event:') || text.startsWith('data:')
      ? text
          .split('\n')
          .find((line) => line.startsWith('data:'))
          ?.slice(5)
      : text;
  if (data === undefined) throw new Error(`Missing MCP response: ${text}`);
  const result = z.object({ result: z.object({ serverInfo: z.object({ name: z.string() }) }) }).parse(JSON.parse(data));
  expect(result.result.serverInfo.name).toBe('growi-mcp');
});

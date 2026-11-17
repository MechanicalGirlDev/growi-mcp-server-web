#!/usr/bin/env node

import { axiosInstanceManager } from '@growi/sdk-typescript';
import { FastMCP } from 'fastmcp';
import { authenticateBearer } from './auth/bearer-auth.js';
import config from './config/default.js';
import httpConfig from './config/http-config.js';
import type { GrowiAppConfig } from './config/types.js';

const server = new FastMCP({
  name: 'growi-mcp',
  version: '1.0.0',
  authenticate: authenticateBearer,
  health: {
    enabled: true,
    path: '/health',
    message: 'ok',
  },
});

/**
 * Initialize Axios instances for all GROWI apps.
 */
const setupAxiosInstance = async (apps: Map<string, GrowiAppConfig>): Promise<void> => {
  for (const app of apps.values()) {
    axiosInstanceManager.addAxiosInstance({
      appName: app.name,
      baseURL: app.baseUrl,
      token: app.apiToken,
    });
  }
};

async function main(): Promise<void> {
  setupAxiosInstance(config.growi.apps);

  try {
    // Loaders are imported dynamically so that the module will be garbage collected
    const { loadTools } = await import('./tools/index.js');
    const { loadResources } = await import('./resources/index.js');
    const { loadPrompts } = await import('./prompts/index.js');
    await loadTools(server);
    await loadResources(server);
    await loadPrompts(server);

    await server.start({
      transportType: 'httpStream',
      httpStream: {
        port: httpConfig.port,
        host: httpConfig.host,
      },
    });

    console.log(`🚀 GROWI MCP HTTP server started on http://${httpConfig.host}:${httpConfig.port}`);
    console.log(`   - MCP endpoint: http://${httpConfig.host}:${httpConfig.port}/mcp`);
    console.log(`   - Health check: http://${httpConfig.host}:${httpConfig.port}/health`);
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});

import apiv3 from '@growi/sdk-typescript/v3';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { getRecentPagesParamSchema } from './schema.js';

export function registerGetRecentPagesTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'getRecentPages',
    description: 'Get recently updated pages from GROWI with pagination support',
    parameters: getRecentPagesParamSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Get Recent Pages',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName, ...getRecentPagesParams } = getRecentPagesParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Execute operation using SDK
        const result = await apiv3.getRecentForPages(getRecentPagesParams, { appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to get recent pages', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

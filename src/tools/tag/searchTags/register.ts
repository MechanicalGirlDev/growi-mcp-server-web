import apiv1 from '@growi/sdk-typescript/v1';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { searchTagsParamSchema } from './schema.js';

export function registerSearchTagsTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'searchTags',
    description: 'Search for tags in GROWI',
    parameters: searchTagsParamSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Search Tags',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName, ...searchTagsParams } = searchTagsParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Prepare API parameters
        const apiParams = searchTagsParams.q ? { q: searchTagsParams.q } : undefined;

        // Execute operation using SDK
        const result = await apiv1.searchTags(apiParams, { appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to search tags', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

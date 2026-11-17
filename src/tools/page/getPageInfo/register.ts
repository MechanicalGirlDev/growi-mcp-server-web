import apiv3 from '@growi/sdk-typescript/v3';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { getPageInfoParamSchema } from './schema.js';

export function registerGetPageInfoTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'getPageInfo',
    description: 'Get summary information about a specific GROWI page',
    parameters: getPageInfoParamSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Get summary information for a page',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName, ...getPageInfoParams } = getPageInfoParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Execute operation using SDK
        const result = await apiv3.getInfoForPage(getPageInfoParams, { appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to get page information', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

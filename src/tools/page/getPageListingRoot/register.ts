import apiv3 from '@growi/sdk-typescript/v3';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { getPageListingRootParamSchema } from './schema.js';

export function registerGetPageListingRootTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'getPageListingRoot',
    description: 'Get root page listing information from GROWI',
    parameters: getPageListingRootParamSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Get Page Listing Root',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName } = getPageListingRootParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Execute operation using SDK
        const result = await apiv3.getRootForPageListing({ appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to get page listing root', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

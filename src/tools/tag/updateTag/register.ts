import apiv1 from '@growi/sdk-typescript/v1';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { updateTagParamSchema } from './schema.js';

export function registerUpdateTagTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'updateTag',
    description: 'Update tags for a page in GROWI',
    parameters: updateTagParamSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Update Page Tags',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName, ...updateTagParams } = updateTagParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Execute operation using SDK
        const result = await apiv1.updateTag(updateTagParams, { appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to update page tags', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

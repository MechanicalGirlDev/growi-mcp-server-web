import apiv1 from '@growi/sdk-typescript/v1';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { resolveAppName } from '../../../commons/utils/resolve-app-name.js';
import type { AnyFastMCP } from '../../commons/types.js';
import { getTagListParamSchema } from './schema.js';

export function registerGetTagListTool(server: AnyFastMCP): void {
  server.addTool({
    name: 'getTagList',
    description: 'Get list of tags in GROWI with pagination support',
    parameters: getTagListParamSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
      title: 'Get Tag List',
    },
    execute: async (params) => {
      try {
        // Validate parameters
        const { appName, ...getTagListParams } = getTagListParamSchema.parse(params);
        const resolvedAppName = resolveAppName(appName);

        // Execute operation using SDK
        const result = await apiv1.listTags(getTagListParams, { appName: resolvedAppName });

        return JSON.stringify(result);
      } catch (error) {
        // Handle validation errors
        if (error instanceof z.ZodError) {
          throw new UserError('Invalid parameters provided', {
            validationErrors: error.issues,
          });
        }

        // Handle unexpected errors
        throw new UserError('Failed to get tag list', {
          originalError: error instanceof Error ? error.message : String(error),
        });
      }
    },
  });
}

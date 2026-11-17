import type { SearchPagesParams } from '@growi/sdk-typescript/v1';
import { z } from 'zod';
import { appNameSchema } from '../../commons/app-name-schemas.js';

export const searchPagesParamSchema = z.object({
  q: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Search query is required' : 'Search query must be a string'),
    })
    .min(1, 'Search query cannot be empty'),
  path: z.string().optional(),
  offset: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).optional(),

  // Name used to identify the GROWI App registered with the MCP Server
  ...appNameSchema.shape,
}) satisfies z.ZodType<SearchPagesParams>;

export type ValidatedParams = z.infer<typeof searchPagesParamSchema>;

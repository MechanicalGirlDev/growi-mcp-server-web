import type { AnyFastMCP } from '../commons/types.js';
import { registerGetCommentsTool } from './getComments/index.js';

export async function loadCommentsTools(server: AnyFastMCP): Promise<void> {
  registerGetCommentsTool(server);
}

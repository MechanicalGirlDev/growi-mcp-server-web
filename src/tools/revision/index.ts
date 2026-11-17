import type { AnyFastMCP } from '../commons/types.js';
import { registerGetRevisionTool } from './getRevision/index.js';
import { registerListRevisionsTool } from './listRevisions/index.js';

export function loadRevisionTools(server: AnyFastMCP): void {
  registerListRevisionsTool(server);
  registerGetRevisionTool(server);
}

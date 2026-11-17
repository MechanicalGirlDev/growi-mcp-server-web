import { loadCommentsTools } from './comments/index.js';
import type { AnyFastMCP } from './commons/types.js';
import { loadPageTools } from './page/index.js';
import { loadRevisionTools } from './revision/index.js';
import { loadShareLinksTools } from './shareLinks/index.js';
import { loadTagTools } from './tag/index.js';
import { loadUserTools } from './user/index.js';

/**
 * Loads and registers all MCP tools with the server.
 * As new tools are added, their registration functions should be imported
 * and called here.
 */
export async function loadTools(server: AnyFastMCP): Promise<void> {
  loadPageTools(server);
  loadUserTools(server);
  loadRevisionTools(server);
  loadTagTools(server);
  loadShareLinksTools(server);
  loadCommentsTools(server);
}

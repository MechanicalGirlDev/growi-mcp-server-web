import type { AnyFastMCP } from '../commons/types.js';
import { registerCreateShareLinkTool } from './createShareLink/index.js';
import { registerDeleteShareLinkByIdTool } from './deleteShareLinkById/index.js';
import { registerDeleteShareLinksTool } from './deleteShareLinks/index.js';
import { registerGetShareLinksTool } from './getShareLinks/index.js';

export function loadShareLinksTools(server: AnyFastMCP): void {
  registerCreateShareLinkTool(server);
  registerDeleteShareLinksTool(server);
  registerDeleteShareLinkByIdTool(server);
  registerGetShareLinksTool(server);
}

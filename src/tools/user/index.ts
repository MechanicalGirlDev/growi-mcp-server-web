import type { AnyFastMCP } from '../commons/types.js';
import { registerGetUserRecentPagesTool } from './getUserRecentPages/index.js';

export async function loadUserTools(server: AnyFastMCP): Promise<void> {
  registerGetUserRecentPagesTool(server);
}

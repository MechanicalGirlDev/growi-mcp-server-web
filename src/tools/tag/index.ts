import type { AnyFastMCP } from '../commons/types.js';
import { registerGetTagListTool } from './getTagList/index.js';
import { registerSearchTagsTool } from './searchTags/index.js';
import { registerUpdateTagTool } from './updateTag/index.js';

export async function loadTagTools(server: AnyFastMCP): Promise<void> {
  registerUpdateTagTool(server);
  registerGetTagListTool(server);
  registerSearchTagsTool(server);
}

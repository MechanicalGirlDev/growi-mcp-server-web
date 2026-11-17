import type { AnyFastMCP } from '../commons/types.js';
import { registerCreatePageTool } from './createPage/index.js';
import { registerDeletePagesTool } from './deletePages/index.js';
import { registerDuplicatePageTool } from './duplicatePages/index.js';
import { registerGetPageTool } from './getPage/index.js';
import { registerGetPageInfoTool } from './getPageInfo/index.js';
import { registerGetPageListingChildrenTool } from './getPageListingChildren/index.js';
import { registerGetPageListingRootTool } from './getPageListingRoot/index.js';
import { registerGetPageTagTool } from './getPageTag/index.js';
import { registerGetRecentPagesTool } from './getRecentPages/index.js';
import { registerPageListingInfoTool } from './pageListingInfo/index.js';
import { registerPublishPageTool } from './publishPage/index.js';
import { registerRenamePageTool } from './renamePage/index.js';
import { registerSearchPagesTool } from './searchPages/index.js';
import { registerUnpublishPageTool } from './unpublishPage/index.js';
import { registerUpdatePageTool } from './updatePage/index.js';

export async function loadPageTools(server: AnyFastMCP): Promise<void> {
  registerCreatePageTool(server);
  registerUpdatePageTool(server);
  registerRenamePageTool(server);
  registerDeletePagesTool(server);
  registerSearchPagesTool(server);
  registerPublishPageTool(server);
  registerUnpublishPageTool(server);
  registerDuplicatePageTool(server);
  registerPageListingInfoTool(server);
  registerGetPageTool(server);
  registerGetPageInfoTool(server);
  registerGetPageListingChildrenTool(server);
  registerGetPageListingRootTool(server);
  registerGetPageTagTool(server);
  registerGetRecentPagesTool(server);
}

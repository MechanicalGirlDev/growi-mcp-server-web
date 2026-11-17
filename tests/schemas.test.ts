import { expect, it } from 'vitest';
import { deletePagesParamSchema } from '../src/tools/page/deletePages/schema.js';
import { searchPagesParamSchema } from '../src/tools/page/searchPages/schema.js';

it('preserves page and revision IDs when parsing a deletion request', () => {
  const request = { pageIdToRevisionIdMap: { pageA: 'revisionA', pageB: 'revisionB' } };

  const result = deletePagesParamSchema.parse(request);

  expect(result.pageIdToRevisionIdMap).toEqual(request.pageIdToRevisionIdMap);
});

it('rejects non-string revision IDs in deletion requests', () => {
  const result = deletePagesParamSchema.safeParse({ pageIdToRevisionIdMap: { pageA: 123 } });

  expect(result.success).toBe(false);
});

it.each([
  [undefined, 'Search query is required'],
  [123, 'Search query must be a string'],
  ['', 'Search query cannot be empty'],
])('explains invalid search query %s', (q, message) => {
  const result = searchPagesParamSchema.safeParse({ q });

  expect(result.success).toBe(false);
  if (!result.success) {
    expect(result.error.issues).toEqual([expect.objectContaining({ path: ['q'], message })]);
  }
});

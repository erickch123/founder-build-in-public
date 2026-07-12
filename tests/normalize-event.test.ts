import {describe, expect, it} from 'vitest';
import {normalizeCapture} from '../src/domain/normalize-event.js';

describe('normalizeCapture', () => {
  it('normalizes identifiers, whitespace, and tags', () => {
    const event = normalizeCapture({
      id: ' EVT_ABC ', userId: ' Erick ', workspaceId: ' Hackathon ',
      occurredAt: '2026-07-12T14:00:00+08:00', summary: '  Built   the pipeline  ',
      visibility: 'public-review', tags: [' Video ', ''],
    });
    expect(event).toMatchObject({
      id: 'evt_abc', userId: 'erick', workspaceId: 'hackathon',
      summary: 'Built the pipeline', tags: ['video'], confidence: 1,
    });
  });
});

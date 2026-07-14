import {describe, expect, it} from 'vitest';
import {normalizeCapture} from '../src/domain/normalize-event.js';
import {createManualCapture} from '../src/captures/manual-captures.js';

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

  it('forces full-time employment captures to remain confidential', () => {
    const capture = createManualCapture({
      userId: 'erick', workspaceId: 'employment', text: 'Completed registry outreach.',
      publicRequested: false,
    }, new Date('2026-07-14T02:00:00Z'));
    expect(capture).toMatchObject({workspaceId: 'employment', visibility: 'confidential'});
    expect(() => createManualCapture({
      userId: 'erick', workspaceId: 'employment', text: 'Internal work', publicRequested: true,
    })).toThrow('is confidential and cannot use --public');
  });
});

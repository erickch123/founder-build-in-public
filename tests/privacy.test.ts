import {describe, expect, it} from 'vitest';
import {loadDemoFixture} from '../src/fixtures/load-demo-fixture.js';
import {buildPublicManifest, sanitizePublicText} from '../src/privacy/public-manifest.js';

describe('workspace privacy filtering', () => {
  it('denies confidential workspaces from the public manifest', async () => {
    const fixture = await loadDemoFixture();
    const manifest = buildPublicManifest({...fixture, userDisplay: 'Demo Founder'});
    expect(JSON.stringify(manifest)).not.toContain('CONFIDENTIAL_CADT_ALPHA');
    expect(manifest.events).toHaveLength(4);
  });

  it('removes common private identifiers deterministically', () => {
    expect(sanitizePublicText('Email me@private.test at https://private.test token=abc123'))
      .toBe('Email [email removed] at [link removed] [secret removed]');
  });
});

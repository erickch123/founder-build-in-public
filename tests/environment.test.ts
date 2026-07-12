import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {loadProjectEnvironment} from '../src/config/environment.js';

const originalKey = process.env.OPENAI_API_KEY;

afterEach(() => {
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
});

describe('loadProjectEnvironment', () => {
  it('uses the workspace .env value instead of a stale exported shell value', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'founder-env-'));
    const path = join(directory, '.env');
    await writeFile(path, 'OPENAI_API_KEY=workspace-key\n');
    process.env.OPENAI_API_KEY = 'stale-shell-key';

    loadProjectEnvironment(path);

    expect(process.env.OPENAI_API_KEY).toBe('workspace-key');
    await rm(directory, {recursive: true, force: true});
  });
});

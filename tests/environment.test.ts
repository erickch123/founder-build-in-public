import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, describe, expect, it} from 'vitest';
import {loadProjectEnvironment} from '../src/config/environment.js';

const originalKey = process.env.OPENAI_API_KEY;
const originalDataDirectory = process.env.FOUNDER_DATA_DIR;

afterEach(() => {
  if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
  else process.env.OPENAI_API_KEY = originalKey;
  if (originalDataDirectory === undefined) delete process.env.FOUNDER_DATA_DIR;
  else process.env.FOUNDER_DATA_DIR = originalDataDirectory;
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

  it('does not replace an explicit runtime value with a blank .env value', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'founder-env-'));
    const path = join(directory, '.env');
    await writeFile(path, 'FOUNDER_DATA_DIR=\n');
    process.env.FOUNDER_DATA_DIR = '/tmp/explicit-founder-data';

    loadProjectEnvironment(path);

    expect(process.env.FOUNDER_DATA_DIR).toBe('/tmp/explicit-founder-data');
    await rm(directory, {recursive: true, force: true});
  });
});

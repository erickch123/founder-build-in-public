import {readFileSync} from 'node:fs';
import {parse} from 'dotenv';

/**
 * The terminal CLI treats the repository's private .env file as its explicit
 * configuration source. This avoids stale shell exports silently overriding
 * credentials the user has just updated for this workspace.
 */
export const loadProjectEnvironment = (path = '.env'): void => {
  let values: Record<string, string>;
  try {
    values = parse(readFileSync(path));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return;
    throw error;
  }
  Object.entries(values).forEach(([name, value]) => {
    if (value.trim()) process.env[name] = value;
  });
};

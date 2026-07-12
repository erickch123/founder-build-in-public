import {config} from 'dotenv';

/**
 * The terminal CLI treats the repository's private .env file as its explicit
 * configuration source. This avoids stale shell exports silently overriding
 * credentials the user has just updated for this workspace.
 */
export const loadProjectEnvironment = (path = '.env'): void => {
  config({path, override: true, quiet: true});
};

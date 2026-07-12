import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import {resolve} from 'node:path';

export const singaporeDate = (): string => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date());

export const appDataRoot = (): string => process.env.FOUNDER_DATA_DIR || resolve(homedir(), '.founder-build-in-public');

export const dayDirectory = (userId: string, date = singaporeDate()): string => resolve(
  appDataRoot(),
  'users', userId, 'days', date,
);

export const writePrivateJson = async (userId: string, name: string, value: unknown): Promise<string> => {
  const directory = dayDirectory(userId);
  await mkdir(directory, {recursive: true, mode: 0o700});
  const path = resolve(directory, name);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
  return path;
};

export const readPrivateJson = async <T>(userId: string, name: string): Promise<T> =>
  JSON.parse(await readFile(resolve(dayDirectory(userId), name), 'utf8')) as T;

export const writeCredentialJson = async (name: string, value: unknown): Promise<string> => {
  const directory = resolve(appDataRoot(), 'credentials');
  await mkdir(directory, {recursive: true, mode: 0o700});
  const path = resolve(directory, name);
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
  return path;
};

export const readCredentialJson = async <T>(name: string): Promise<T> =>
  JSON.parse(await readFile(resolve(appDataRoot(), 'credentials', name), 'utf8')) as T;

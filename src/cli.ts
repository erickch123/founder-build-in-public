#!/usr/bin/env node
import {runEndDay} from './pipeline/end-day.js';

const args = process.argv.slice(2);
const [userArg, workspaceArg, commandArg] = args;
const fixture = args.includes('--fixture');
const storageIndex = args.indexOf('--storage');
const storage = storageIndex >= 0 ? args[storageIndex + 1] : 'local';

const usage = (): never => {
  console.error('Usage: founder <user> <workspace> end-day --fixture --storage local');
  process.exit(1);
};

if (!userArg || !workspaceArg || !commandArg) usage();
const userId = userArg as string;
const workspaceId = workspaceArg as string;
const command = commandArg as string;
if (command !== 'end-day') throw new Error(`Unsupported command: ${command}`);
if (storage !== 'local') throw new Error('Only local storage is implemented in the golden path.');

console.log('Founder Build in Public — fixture golden path\n');
console.log('… Loading curated synthetic evidence');

try {
  const result = await runEndDay({userId, workspaceId, fixture, storage: 'local'});
  console.log('✓ Loaded curated fixture newsletters');
  console.log(`✓ Excluded ${result.excludedConfidentialEvents} confidential workspace event`);
  console.log(`✓ Selected story: ${result.storyTitle}`);
  console.log('✓ Generated Founder Digest');
  console.log(`✓ Rendered ${result.durationSeconds}-second Founder Reel`);
  console.log(`\nDigest  ${result.digestPath}`);
  console.log(`Video   ${result.videoPath}`);
  console.log(`Mode    fixture · local storage · ${result.narrated ? `narrated (${result.voiceProvider})` : 'caption-led'}`);
} catch (error) {
  console.error(`\nError: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

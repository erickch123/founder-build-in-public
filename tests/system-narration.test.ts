import {describe, expect, it} from 'vitest';
import {speechRateForScene} from '../src/voice/system-narration.js';

describe('system narration timing', () => {
  it('keeps speech rates within an intelligible range', () => {
    expect(speechRateForScene('A short founder lesson.', 6)).toBe(155);
    expect(speechRateForScene('word '.repeat(100), 5)).toBe(210);
  });
});

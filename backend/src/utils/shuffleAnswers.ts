import { VocabOption, ShuffledOption } from '../types';

/** Fisher-Yates shuffle */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Shuffles the A/B/C/D options and returns:
 * - shuffled options with display labels A/B/C/D
 * - a mapping: displayKey -> originalKey (stored server-side for grading)
 */
export function shuffleOptions(options: VocabOption): {
  shuffled: ShuffledOption[];
  mapping: Record<string, string>; // displayKey -> originalKey
} {
  const entries = Object.entries(options) as [string, string][];
  const shuffledEntries = shuffle(entries);
  const displayKeys = ['A', 'B', 'C', 'D'];

  const shuffled: ShuffledOption[] = shuffledEntries.map((entry, i) => ({
    key: displayKeys[i],
    value: entry[1],
  }));

  const mapping: Record<string, string> = {};
  shuffledEntries.forEach((entry, i) => {
    mapping[displayKeys[i]] = entry[0]; // displayKey -> originalKey
  });

  return { shuffled, mapping };
}

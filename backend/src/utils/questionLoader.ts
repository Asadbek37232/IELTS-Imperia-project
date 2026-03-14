import fs from 'fs';
import path from 'path';
import { VocabularyQuestion, GrammarQuestion } from '../types';

const VOCAB_DIR = path.resolve(__dirname, '../../question_database/vocabulary_questions');
const GRAMMAR_DIR = path.resolve(__dirname, '../../question_database/grammar_questions');

function loadJSONFiles<T>(dir: string): T[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  const results: T[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const parsed = JSON.parse(raw) as T;
      results.push(parsed);
    } catch (err) {
      console.error(`Failed to parse question file: ${file}`, err);
    }
  }
  return results;
}

function getRandomSample<T>(arr: T[], count: number): T[] {
  if (count >= arr.length) return [...arr];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomVocabQuestions(count: number): VocabularyQuestion[] {
  const all = loadJSONFiles<VocabularyQuestion>(VOCAB_DIR);
  return getRandomSample(all, count);
}

/**
 * Grammar: Each JSON file is one passage with multiple sub-questions.
 * We select random PASSAGES until we have at least `count` sub-questions,
 * then trim the last passage's questions if necessary.
 */
export function getRandomGrammarQuestions(count: number): GrammarQuestion[] {
  const all = loadJSONFiles<GrammarQuestion>(GRAMMAR_DIR);
  const shuffled = [...all].sort(() => Math.random() - 0.5);

  const selected: GrammarQuestion[] = [];
  let total = 0;

  for (const passage of shuffled) {
    if (total >= count) break;
    const remaining = count - total;
    if (passage.questions.length <= remaining) {
      selected.push(passage);
      total += passage.questions.length;
    } else {
      // Trim questions from this passage
      selected.push({
        ...passage,
        questions: passage.questions.slice(0, remaining),
      });
      total += remaining;
    }
  }

  return selected;
}

export function countAvailableVocab(): number {
  const all = loadJSONFiles<VocabularyQuestion>(VOCAB_DIR);
  return all.length;
}

export function countAvailableGrammar(): number {
  const all = loadJSONFiles<GrammarQuestion>(GRAMMAR_DIR);
  return all.reduce((sum, g) => sum + g.questions.length, 0);
}

import { Request } from 'express';

export type UserRole = 'ADMIN' | 'STUDENT';
export type SectionType = 'VOCABULARY' | 'GRAMMAR';
export type GrammarSubType = 'gap_fill_input' | 'multiple_choice' | 'heading_match';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  username: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── JSON Question Types ──────────────────────────────────────────────────────

export interface VocabOption {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface VocabularyQuestion {
  id: string;
  questionNumber: number;
  type: 'VOCABULARY';
  question: string;
  audio_path: string | null;
  image_path: string | null;
  options: VocabOption;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface GrammarSubQuestion {
  id: string;
  questionNumber: number;
  blank: number;
  question: string;
  type: string;
  options?: VocabOption;
  correctAnswer: string;
  explanation?: string;
}

export interface GrammarQuestion {
  id: string;
  type: 'GRAMMAR';
  subType: GrammarSubType;
  passage: string;
  audio_path: string | null;
  image_path: string | null;
  availableHeadings?: string[];
  questions: GrammarSubQuestion[];
}

export type AnyQuestion = VocabularyQuestion | GrammarQuestion;

// ─── Client-facing Question (shuffled, no correctAnswer) ─────────────────────

export interface ShuffledOption {
  key: string; // A, B, C, D (display label)
  value: string; // actual text
}

export interface ClientVocabQuestion {
  id: string;
  questionNumber: number;
  type: 'VOCABULARY';
  question: string;
  audio_path: string | null;
  image_path: string | null;
  options: ShuffledOption[];
  _originalKey: string; // hidden from client in production; used server-side
}

export interface ClientGrammarSubQuestion {
  id: string;
  questionNumber: number;
  blank: number;
  question: string;
  type: string;
  options: ShuffledOption[];
}

export interface ClientGrammarQuestion {
  id: string;
  type: 'GRAMMAR';
  subType: GrammarSubType;
  passage: string;
  audio_path: string | null;
  image_path: string | null;
  availableHeadings?: string[];
  questions: ClientGrammarSubQuestion[];
}

// ─── Test Section Config ──────────────────────────────────────────────────────

export interface SectionConfig {
  sectionType: SectionType;
  numberOfQuestions: number;
  timeAllocated: number; // minutes
  sectionOrder: number;
}

// ─── Result Submission ────────────────────────────────────────────────────────

export interface SubmitAnswer {
  questionId: string;
  questionType: SectionType;
  selectedAnswer: string; // the display key (A/B/C/D) → resolved server-side
  questionText: string;
}

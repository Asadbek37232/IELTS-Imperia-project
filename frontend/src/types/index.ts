export type UserRole = 'ADMIN' | 'STUDENT';
export type SectionType = 'VOCABULARY' | 'GRAMMAR';
export type GrammarSubType = 'gap_fill_input' | 'multiple_choice' | 'heading_match';

export interface User {
  id: string;
  fullName: string;
  username: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ShuffledOption {
  key: string;
  value: string;
}

export interface ClientVocabQuestion {
  id: string;
  questionNumber: number;
  type: 'VOCABULARY';
  question: string;
  audio_path: string | null;
  image_path: string | null;
  options: ShuffledOption[];
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

export type AnyClientQuestion = ClientVocabQuestion | ClientGrammarQuestion;

export interface SectionConfig {
  sectionType: SectionType;
  numberOfQuestions: number;
  timeAllocated: number;
  sectionOrder: number;
}

export interface TestSection extends SectionConfig {
  id: string;
  testSessionId: string;
}

export interface TestSession {
  id: string;
  pinCode: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  sections: TestSection[];
  _count?: { results: number };
}

export interface CurrentSection {
  sectionType: SectionType;
  sectionOrder: number;
  deadline: string;
  questions: AnyClientQuestion[];
}

export interface JoinTestResponse {
  testSessionId: string;
  title: string;
  sections: SectionConfig[];
  currentSection: CurrentSection;
}

export interface StudentAnswer {
  id: string;
  questionId: string;
  questionType: SectionType;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface Result {
  id: string;
  studentId: string;
  testSessionId: string;
  totalScore: number;
  vocabScore: number | null;
  grammarScore: number | null;
  vocabCorrect: number | null;
  vocabTotal: number | null;
  grammarCorrect: number | null;
  grammarTotal: number | null;
  submittedAt: string;
  isCompleted: boolean;
  testSession: TestSession;
  answers?: StudentAnswer[];
}

export interface LiveSession {
  id: string;
  studentId: string;
  testSessionId: string;
  pinCode: string;
  currentSection: SectionType;
  sectionOrder: number;
  sectionDeadline: string;
  tabSwitchCount: number;
  lastActive: string;
  isActive: boolean;
  student: { fullName: string; username: string; phoneNumber?: string };
  testSession: { title: string; pinCode: string };
}

export interface SubmitAnswer {
  questionId: string;
  questionType: SectionType;
  selectedAnswer: string;
  questionText: string;
}

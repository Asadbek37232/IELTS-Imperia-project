import prisma from '../config/database';
import { generateUniquePIN } from '../utils/pinGenerator';
import { getRandomVocabQuestions, getRandomGrammarQuestions } from '../utils/questionLoader';
import { shuffleOptions } from '../utils/shuffleAnswers';
import {
  SectionConfig,
  VocabularyQuestion,
  GrammarQuestion,
  ClientVocabQuestion,
  ClientGrammarQuestion,
} from '../types';

// ─── ADMIN: Create Test ───────────────────────────────────────────────────────

export async function createTest(adminId: string, title: string, sections: SectionConfig[]) {
  const pinCode = await generateUniquePIN();

  const testSession = await prisma.testSession.create({
    data: {
      pinCode,
      title,
      createdBy: adminId,
      sections: {
        create: sections.map(s => ({
          sectionType: s.sectionType,
          numberOfQuestions: s.numberOfQuestions,
          timeAllocated: s.timeAllocated,
          sectionOrder: s.sectionOrder,
        })),
      },
    },
    include: { sections: true },
  });

  return testSession;
}

// ─── ADMIN: Get all tests ─────────────────────────────────────────────────────

export async function getAdminTests(adminId: string) {
  return prisma.testSession.findMany({
    where: { createdBy: adminId },
    include: { sections: { orderBy: { sectionOrder: 'asc' } }, _count: { select: { results: true } } },
    orderBy: { createdAt: 'desc' },
  });
}

// ─── ADMIN: Toggle test active status ────────────────────────────────────────

export async function toggleTestStatus(testId: string, adminId: string) {
  const test = await prisma.testSession.findFirst({ where: { id: testId, createdBy: adminId } });
  if (!test) throw new Error('Test not found');

  return prisma.testSession.update({
    where: { id: testId },
    data: { isActive: !test.isActive },
  });
}

// ─── STUDENT: Validate PIN and prepare questions ──────────────────────────────

export async function validatePinAndGetSections(pin: string) {
  const session = await prisma.testSession.findUnique({
    where: { pinCode: pin },
    include: { sections: { orderBy: { sectionOrder: 'asc' } } },
  });

  if (!session) throw new Error('Invalid PIN code');
  if (!session.isActive) throw new Error('This test is no longer active');

  return session;
}

// ─── Build client-safe questions (shuffled, no correct answers leaked) ────────

export function buildClientVocabQuestions(
  rawQuestions: VocabularyQuestion[]
): { clientQuestions: ClientVocabQuestion[]; answerMap: Record<string, string> } {
  const clientQuestions: ClientVocabQuestion[] = [];
  const answerMap: Record<string, string> = {}; // questionId -> originalCorrectKey

  rawQuestions.forEach((q, idx) => {
    const { shuffled, mapping } = shuffleOptions(q.options);

    // Find new display key for the correct answer
    const correctDisplayKey = Object.entries(mapping).find(
      ([, origKey]) => origKey === q.correctAnswer
    )?.[0] || q.correctAnswer;

    answerMap[q.id] = correctDisplayKey; // store mapped correct key

    clientQuestions.push({
      id: q.id,
      questionNumber: idx + 1,
      type: 'VOCABULARY',
      question: q.question,
      audio_path: q.audio_path,
      image_path: q.image_path,
      options: shuffled,
      _originalKey: correctDisplayKey, // only used server-side; strip before sending
    });
  });

  return { clientQuestions, answerMap };
}

export function buildClientGrammarQuestions(
  rawPassages: GrammarQuestion[]
): { clientPassages: ClientGrammarQuestion[]; answerMap: Record<string, string> } {
  const clientPassages: ClientGrammarQuestion[] = [];
  const answerMap: Record<string, string> = {};

  rawPassages.forEach(passage => {
    const clientSubQuestions = passage.questions.map(sq => {
      if (passage.subType === 'multiple_choice' && sq.options) {
        const { shuffled, mapping } = shuffleOptions(sq.options);
        const correctDisplayKey = Object.entries(mapping).find(
          ([, origKey]) => origKey === sq.correctAnswer
        )?.[0] || sq.correctAnswer;
        answerMap[sq.id] = correctDisplayKey;
        return {
          id: sq.id,
          questionNumber: sq.questionNumber,
          blank: sq.blank,
          question: sq.question,
          type: sq.type,
          options: shuffled,
        };
      } else {
        // gap_fill_input and heading_match: store correctAnswer as-is
        answerMap[sq.id] = sq.correctAnswer;
        return {
          id: sq.id,
          questionNumber: sq.questionNumber,
          blank: sq.blank,
          question: sq.question,
          type: sq.type,
          options: [],
        };
      }
    });

    clientPassages.push({
      id: passage.id,
      type: 'GRAMMAR',
      subType: passage.subType,
      passage: passage.passage,
      audio_path: passage.audio_path,
      image_path: passage.image_path,
      availableHeadings: passage.availableHeadings,
      questions: clientSubQuestions,
    });
  });

  return { clientPassages, answerMap };
}

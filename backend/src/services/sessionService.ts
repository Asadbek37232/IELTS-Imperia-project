import prisma from '../config/database';
import { SectionType } from '../types';
import { getRandomVocabQuestions, getRandomGrammarQuestions } from '../utils/questionLoader';
import {
  buildClientVocabQuestions,
  buildClientGrammarQuestions,
  validatePinAndGetSections,
} from './testService';

// In-memory store for per-student question answers during a test
// Key: studentId, Value: answerMap { questionId -> correctDisplayKey }
const activeAnswerMaps = new Map<string, Record<string, string>>();

export function storeAnswerMap(studentId: string, map: Record<string, string>): void {
  const existing = activeAnswerMaps.get(studentId) || {};
  activeAnswerMaps.set(studentId, { ...existing, ...map });
}

export function getAnswerMap(studentId: string): Record<string, string> {
  return activeAnswerMaps.get(studentId) || {};
}

export function clearAnswerMap(studentId: string): void {
  activeAnswerMaps.delete(studentId);
}

// ─── Join Test ────────────────────────────────────────────────────────────────

export async function joinTest(studentId: string, pin: string) {
  // Check if already in test
  const existing = await prisma.activeSession.findFirst({
    where: { studentId, isActive: true },
  });
  if (existing) throw new Error('You are already in an active test');

  // Check already completed this test
  const alreadyDone = await prisma.result.findFirst({
    where: { studentId, testSession: { pinCode: pin } },
  });
  if (alreadyDone) throw new Error('You have already completed this test');

  const session = await validatePinAndGetSections(pin);
  const sections = session.sections; // ordered by sectionOrder

  if (sections.length === 0) throw new Error('Test has no sections configured');

  const firstSection = sections[0];
  const sectionDeadline = new Date(Date.now() + firstSection.timeAllocated * 60 * 1000);

  // Create active session
  await prisma.activeSession.create({
    data: {
      studentId,
      testSessionId: session.id,
      pinCode: pin,
      currentSection: firstSection.sectionType,
      sectionOrder: firstSection.sectionOrder,
      sectionDeadline,
    },
  });

  // Fetch questions for first section
  const { questions, answerMap } = await fetchQuestionsForSection(
    firstSection.sectionType,
    firstSection.numberOfQuestions
  );

  storeAnswerMap(studentId, answerMap);

  return {
    testSessionId: session.id,
    title: session.title,
    sections: sections.map(s => ({
      sectionType: s.sectionType,
      numberOfQuestions: s.numberOfQuestions,
      timeAllocated: s.timeAllocated,
      sectionOrder: s.sectionOrder,
    })),
    currentSection: {
      sectionType: firstSection.sectionType,
      sectionOrder: firstSection.sectionOrder,
      deadline: sectionDeadline,
      questions,
    },
  };
}

// ─── Advance to next section ──────────────────────────────────────────────────

export async function advanceSection(studentId: string, testSessionId: string) {
  const activeSession = await prisma.activeSession.findFirst({
    where: { studentId, testSessionId, isActive: true },
  });
  if (!activeSession) throw new Error('No active session found');

  const allSections = await prisma.testSection.findMany({
    where: { testSessionId },
    orderBy: { sectionOrder: 'asc' },
  });

  const nextSection = allSections.find(s => s.sectionOrder === activeSession.sectionOrder + 1);

  if (!nextSection) {
    // No more sections — session ended
    await prisma.activeSession.update({
      where: { id: activeSession.id },
      data: { isActive: false },
    });
    return null;
  }

  const sectionDeadline = new Date(Date.now() + nextSection.timeAllocated * 60 * 1000);

  await prisma.activeSession.update({
    where: { id: activeSession.id },
    data: {
      currentSection: nextSection.sectionType,
      sectionOrder: nextSection.sectionOrder,
      sectionDeadline,
    },
  });

  const { questions, answerMap } = await fetchQuestionsForSection(
    nextSection.sectionType as SectionType,
    nextSection.numberOfQuestions
  );

  storeAnswerMap(studentId, answerMap);

  return {
    sectionType: nextSection.sectionType,
    sectionOrder: nextSection.sectionOrder,
    deadline: sectionDeadline,
    questions,
  };
}

// ─── Internal: fetch & build questions for a section ─────────────────────────

async function fetchQuestionsForSection(
  type: SectionType,
  count: number
): Promise<{ questions: unknown; answerMap: Record<string, string> }> {
  if (type === 'VOCABULARY') {
    const raw = getRandomVocabQuestions(count);
    const { clientQuestions, answerMap } = buildClientVocabQuestions(raw);
    // Strip _originalKey before sending to client
    const safe = clientQuestions.map(({ _originalKey: _k, ...rest }) => rest);
    return { questions: safe, answerMap };
  } else {
    const raw = getRandomGrammarQuestions(count);
    const { clientPassages, answerMap } = buildClientGrammarQuestions(raw);
    return { questions: clientPassages, answerMap };
  }
}

export async function recordTabSwitch(studentId: string, testSessionId: string): Promise<number> {
  const updated = await prisma.activeSession.updateMany({
    where: { studentId, testSessionId, isActive: true },
    data: { tabSwitchCount: { increment: 1 }, lastActive: new Date() },
  });

  if (updated.count === 0) return 0;

  const session = await prisma.activeSession.findFirst({
    where: { studentId, testSessionId, isActive: true },
  });
  return session?.tabSwitchCount || 0;
}

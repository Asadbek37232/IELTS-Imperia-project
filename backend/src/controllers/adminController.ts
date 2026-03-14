import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest, SectionConfig } from '../types';
import { createTest, getAdminTests, toggleTestStatus } from '../services/testService';
import { getStudentsForAdmin } from '../services/resultService';
import { countAvailableVocab, countAvailableGrammar } from '../utils/questionLoader';
import prisma from '../config/database';

const sectionSchema = z.object({
  sectionType: z.enum(['VOCABULARY', 'GRAMMAR']),
  numberOfQuestions: z.number().int().min(1).max(100),
  timeAllocated: z.number().int().min(1).max(180),
  sectionOrder: z.number().int().min(1).max(10),
});

const createTestSchema = z.object({
  title: z.string().min(2).max(200),
  sections: z.array(sectionSchema).min(1).max(5),
});

export async function handleCreateTest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = createTestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, message: parsed.error.errors[0].message });
      return;
    }

    const { title, sections } = parsed.data;

    // Validate question availability
    const availableVocab = countAvailableVocab();
    const availableGrammar = countAvailableGrammar();

    for (const s of sections) {
      if (s.sectionType === 'VOCABULARY' && s.numberOfQuestions > availableVocab) {
        res.status(400).json({
          success: false,
          message: `Only ${availableVocab} vocabulary questions available, requested ${s.numberOfQuestions}`,
        });
        return;
      }
      if (s.sectionType === 'GRAMMAR' && s.numberOfQuestions > availableGrammar) {
        res.status(400).json({
          success: false,
          message: `Only ${availableGrammar} grammar sub-questions available, requested ${s.numberOfQuestions}`,
        });
        return;
      }
    }

    const test = await createTest(req.user!.userId, title, sections as SectionConfig[]);
    res.status(201).json({ success: true, data: test });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create test';
    res.status(400).json({ success: false, message });
  }
}

export async function handleGetTests(req: AuthRequest, res: Response): Promise<void> {
  try {
    const tests = await getAdminTests(req.user!.userId);
    res.json({ success: true, data: tests });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch tests' });
  }
}

export async function handleToggleTest(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const test = await toggleTestStatus(id, req.user!.userId);
    res.json({ success: true, data: test });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update test';
    res.status(400).json({ success: false, message });
  }
}

export async function handleGetStudents(req: AuthRequest, res: Response): Promise<void> {
  try {
    const students = await getStudentsForAdmin(req.user!.userId);
    res.json({ success: true, data: students });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
}

export async function handleGetDashboard(req: AuthRequest, res: Response): Promise<void> {
  try {
    const adminId = req.user!.userId;

    const [totalTests, totalStudents, activeSessions] = await Promise.all([
      prisma.testSession.count({ where: { createdBy: adminId } }),
      prisma.result.findMany({
        where: { testSession: { createdBy: adminId } },
        distinct: ['studentId'],
      }),
      prisma.activeSession.findMany({
        where: { testSession: { createdBy: adminId }, isActive: true },
        include: {
          student: { select: { fullName: true, username: true } },
          testSession: { select: { title: true, pinCode: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalTests,
        totalStudents: totalStudents.length,
        liveCount: activeSessions.length,
        liveSessions: activeSessions,
      },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard' });
  }
}

export async function handleGetLiveSessions(req: AuthRequest, res: Response): Promise<void> {
  try {
    const sessions = await prisma.activeSession.findMany({
      where: { testSession: { createdBy: req.user!.userId }, isActive: true },
      include: {
        student: { select: { fullName: true, username: true, phoneNumber: true } },
        testSession: { select: { title: true, pinCode: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: sessions });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch live sessions' });
  }
}

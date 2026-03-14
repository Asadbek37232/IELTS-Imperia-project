import { Response } from 'express';
import { AuthRequest } from '../types';
import {
  getStudentResults,
  getResultDetail,
  getAllResultsForAdmin,
} from '../services/resultService';

export async function handleGetMyResults(req: AuthRequest, res: Response): Promise<void> {
  try {
    const results = await getStudentResults(req.user!.userId);
    res.json({ success: true, data: results });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
}

export async function handleGetResultDetail(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const result = await getResultDetail(id, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch result';
    res.status(404).json({ success: false, message });
  }
}

export async function handleGetAllResults(req: AuthRequest, res: Response): Promise<void> {
  try {
    const results = await getAllResultsForAdmin(req.user!.userId);
    res.json({ success: true, data: results });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch results' });
  }
}

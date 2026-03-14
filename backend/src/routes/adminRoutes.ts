import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import {
  handleCreateTest,
  handleGetTests,
  handleToggleTest,
  handleGetStudents,
  handleGetDashboard,
  handleGetLiveSessions,
} from '../controllers/adminController';
import { handleGetAllResults } from '../controllers/resultsController';

const router = Router();
router.use(authenticate, requireRole('ADMIN'));

router.get('/dashboard', handleGetDashboard);
router.post('/tests', handleCreateTest);
router.get('/tests', handleGetTests);
router.patch('/tests/:id/toggle', handleToggleTest);
router.get('/students', handleGetStudents);
router.get('/results', handleGetAllResults);
router.get('/live', handleGetLiveSessions);

export default router;

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import {
  handleJoinTest,
  handleAdvanceSection,
  handleSubmitTest,
  handleTabSwitch,
  handleGetActiveSession,
  handleGetStudentDashboard,
} from '../controllers/studentController';
import { handleGetMyResults, handleGetResultDetail } from '../controllers/resultsController';

const router = Router();
router.use(authenticate, requireRole('STUDENT'));

router.get('/dashboard', handleGetStudentDashboard);
router.post('/test/join', handleJoinTest);
router.post('/test/advance', handleAdvanceSection);
router.post('/test/:testSessionId/submit', handleSubmitTest);
router.post('/test/tab-switch', handleTabSwitch);
router.get('/test/active', handleGetActiveSession);
router.get('/results', handleGetMyResults);
router.get('/results/:id', handleGetResultDetail);

export default router;

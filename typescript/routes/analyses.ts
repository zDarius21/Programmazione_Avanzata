import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getAllAnalyses, getAnalysisById } from '../controllers/analysisController';

const router = Router();

// Tutte le rotte /analyses richiedono autenticazione JWT
router.use(authenticate);

router.get('/', getAllAnalyses);
router.get('/:id', getAnalysisById);

export default router;
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema } from '../validation/schemas';
import { getAllAnalyses, getAnalysisById } from '../controllers/analysisController';

const router = Router();

// Tutte le rotte /analyses richiedono autenticazione JWT
router.use(authenticate);

router.get('/', getAllAnalyses);
router.get('/:id', validate({ params: idParamSchema }), getAnalysisById);

export default router;
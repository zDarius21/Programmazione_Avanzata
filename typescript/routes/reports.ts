import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema } from '../validation/schemas';
import { downloadReport } from '../controllers/reportController';

const router = Router();

// Tutte le rotte /reports richiedono autenticazione JWT
router.use(authenticate);

// Scarica il report PDF generato dall'analisi di un documento
router.get('/:id', validate({ params: idParamSchema }), downloadReport);

export default router;
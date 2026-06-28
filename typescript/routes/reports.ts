import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema } from '../validation/schemas';
import { downloadReport } from '../controllers/reportController';

const router = Router();
//-------------------------------------------------------\\
// Tutte le rotte /reports richiedono autenticazione JWT \\
//-------------------------------------------------------\\
router.use(authenticate);


/**
 * Rotta per scaricare un report PDF generato dall'analisi di un documento, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /reports/:id
 */
router.get('/:id', validate({ params: idParamSchema }), downloadReport);

export default router;
import { Router } from 'express';
import { getAllRegulations, getRegulationById, createRegulation, updateRegulation, deleteRegulation } from '../controllers/regulationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema, createRegulationSchema, updateRegulationSchema } from '../validation/schemas';

const router = Router();

// Rotte accessibili a tutti gli utenti autenticati per operazioni di lettura
router.get('/', authenticate, getAllRegulations);
router.get('/:id', authenticate, validate({ params: idParamSchema }), getRegulationById);

// Rotte riservate agli admin per operazioni CUD
router.post('/', authenticate, requireAdmin, uploadPdf, validate({ body: createRegulationSchema }), createRegulation);
router.patch('/:id', authenticate, requireAdmin, validate({ params: idParamSchema, body: updateRegulationSchema }), updateRegulation);
router.delete('/:id', authenticate, requireAdmin, validate({ params: idParamSchema }), deleteRegulation);

export default router;
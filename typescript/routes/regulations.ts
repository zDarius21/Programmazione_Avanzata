import { Router } from 'express';
import { getAllRegulations, getRegulationById, createRegulation, updateRegulation, deleteRegulation } from '../controllers/regulationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

// Rotte accessibili a tutti gli utenti autenticati per operazioni di lettura
router.get('/', authenticate, getAllRegulations);
router.get('/:id', authenticate, getRegulationById);

// Rotte riservate agli admin per operazioni CUD
router.post('/', authenticate, requireAdmin, createRegulation);
router.put('/:id', authenticate, requireAdmin, updateRegulation);
router.delete('/:id', authenticate, requireAdmin, deleteRegulation);

export default router;
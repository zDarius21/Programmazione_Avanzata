import { Router } from 'express';
import { getAllRegulations, getRegulationById, createRegulation, updateRegulation, deleteRegulation } from '../controllers/regulationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';

const router = Router();

// Rotte accessibili a tutti gli utenti autenticati
router.get('/', authenticate, getAllRegulations);
router.get('/:id', authenticate, getRegulationById);

// Rotte riservate agli admin — il token viene verificato e il ruolo controllato
router.post('/', authenticate, requireAdmin, createRegulation);
router.put('/:id', authenticate, requireAdmin, updateRegulation);
router.delete('/:id', authenticate, requireAdmin, deleteRegulation);

export default router;
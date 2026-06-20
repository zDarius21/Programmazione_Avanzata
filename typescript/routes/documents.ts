import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  analyzeDocument,
} from '../controllers/documentController';

const router = Router();

// Tutte le rotte /documents richiedono un token JWT valido
router.use(authenticate);

router.get('/', getAllDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

// Avvia l'analisi di conformità su un documento specifico
router.post('/:id/analyze', analyzeDocument);

export default router;
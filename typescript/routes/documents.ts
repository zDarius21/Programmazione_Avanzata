import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  analyzeDocument,
  downloadReport,
} from '../controllers/documentController';

const router = Router();

// Tutte le rotte /documents richiedono autenticazione JWT
router.use(authenticate);

router.get('/',            getAllDocuments);
router.get('/:id',         getDocumentById);
router.post('/',  uploadPdf, createDocument);   // accetta opzionalmente un file PDF nel campo "file"
router.put('/:id',         updateDocument);
router.delete('/:id',      deleteDocument);

// Avvia l'analisi ESG e genera il report PDF su MinIO
router.post('/:id/analyze',  analyzeDocument);

// Scarica il report PDF generato dall'analisi
router.get('/:id/report',    downloadReport);

export default router;

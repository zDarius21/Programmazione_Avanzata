import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema, createDocumentSchema, updateDocumentSchema } from '../validation/schemas';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  analyzeDocument,
  downloadDocumentFile,

} from '../controllers/documentController';

const router = Router();

// Tutte le rotte /documents richiedono autenticazione JWT
router.use(authenticate);

router.get('/',            getAllDocuments);
router.get('/:id',         validate({ params: idParamSchema }), getDocumentById);
router.get('/:id/file',    validate({ params: idParamSchema }), downloadDocumentFile);   // scarica il PDF originale
router.post('/',  uploadPdf, validate({ body: createDocumentSchema }), createDocument);   // accetta un file PDF nel campo "file"
router.patch('/:id',         validate({ params: idParamSchema, body: updateDocumentSchema }), updateDocument);
router.delete('/:id',      validate({ params: idParamSchema }), deleteDocument);

// Avvia l'analisi ESG e genera il report PDF su MinIO
router.post('/:id/analyze',  validate({ params: idParamSchema }), analyzeDocument);

export default router;

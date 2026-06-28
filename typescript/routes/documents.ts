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
//----------------------------------------------------------\\
// Tutte le rotte /documents richiedono autenticazione JWT. \\
//----------------------------------------------------------\\


router.use(authenticate);

//-----------------------------------------------------------------------------------------------------\\
//Rotte per la gestione dei documenti: creazione, lettura, aggiornamento, cancellazione e analisi ESG. \\
//-----------------------------------------------------------------------------------------------------\\

/**
 * Rotta per ottenere tutti i documenti caricati dall'utente autenticato. Restituisce un array di oggetti contenenti i dettagli dei documenti.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /documents
 */
router.get('/',            getAllDocuments);

/**
 * Rotta per ottenere i dettagli di un documento specifico, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /documents/:id
 */
router.get('/:id',         validate({ params: idParamSchema }), getDocumentById);

/**
 * Rotta per scaricare il file PDF originale di un documento specifico, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /documents/:id/file
 */
router.get('/:id/file',    validate({ params: idParamSchema }), downloadDocumentFile);  


/**
 * Rotta per creare un nuovo documento. Accetta un file PDF nel campo "file".
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route POST /documents
 */
router.post('/',  uploadPdf, validate({ body: createDocumentSchema }), createDocument);  


/**
 * Rotta per aggiornare un documento esistente, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route PATCH /documents/:id
 */


router.patch('/:id',         validate({ params: idParamSchema, body: updateDocumentSchema }), updateDocument);
/**
 * Rotta per eliminare un documento specifico, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route DELETE /documents/:id
 */
router.delete('/:id',      validate({ params: idParamSchema }), deleteDocument);


/**
 * Rotta per avviare l'analisi ESG di un documento specifico, identificato dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route POST /documents/:id/analyze
 */
router.post('/:id/analyze',  validate({ params: idParamSchema }), analyzeDocument);

export default router;

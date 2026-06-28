import { Router } from 'express';
import { getAllRegulations, getRegulationById, createRegulation, updateRegulation, deleteRegulation } from '../controllers/regulationController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import { uploadPdf } from '../middleware/uploadMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { idParamSchema, createRegulationSchema, updateRegulationSchema } from '../validation/schemas';

const router = Router();

//-----------------------------------------------------------------------------\\
// Rotte accessibili a tutti gli utenti autenticati per operazioni di lettura. \\
//-----------------------------------------------------------------------------\\

/**
 * Rotta per ottenere tutte le normative disponibili nel sistema. Restituisce un array di oggetti contenenti i dettagli delle normative.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /regulations
 */
router.get('/', authenticate, getAllRegulations);

/**
 * Rotta per ottenere i dettagli di una specifica normativa, identificata dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /regulations/:id
 */
router.get('/:id', authenticate, validate({ params: idParamSchema }), getRegulationById);

//------------------------------------------------\\
// Rotte riservate agli admin per operazioni CUD. \\
//------------------------------------------------\\

/**
 * Rotta per creare una nuova normativa. Accetta un file PDF nel campo "file" e un oggetto JSON con i dettagli della normativa.
 * Richiede un token JWT valido nell'intestazione Authorization e che l'utente abbia il ruolo di admin.
 * 
 * @route POST /regulations 
 */
router.post('/', authenticate, requireAdmin, uploadPdf, validate({ body: createRegulationSchema }), createRegulation);

/**
 * Rotta per aggiornare una normativa esistente, identificata dal suo ID. Accetta un oggetto JSON con i dettagli aggiornati della normativa.
 * Richiede un token JWT valido nell'intestazione Authorization e che l'utente abbia il ruolo di admin.
 * 
 * @route PATCH /regulations/:id
 */
router.patch('/:id', authenticate, requireAdmin, validate({ params: idParamSchema, body: updateRegulationSchema }), updateRegulation);

/**
 * Rotta per eliminare una normativa esistente, identificata dal suo ID.
 * Richiede un token JWT valido nell'intestazione Authorization e che l'utente abbia il ruolo di admin.
 * 
 * @route DELETE /regulations/:id
 */
router.delete('/:id', authenticate, requireAdmin, validate({ params: idParamSchema }), deleteRegulation);

export default router;
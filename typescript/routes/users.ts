import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validationMiddleware';
import {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  rechargeTokensSchema,
} from '../validation/schemas';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyTokens,
  rechargeTokens,
} from '../controllers/userController';

const router = Router();

/**
 * Rotta accessibile a qualsiasi utente autenticato per controllare i propri token.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /users/tokens
 */
router.get('/tokens', authenticate, getMyTokens);


//-----------------------------------------------------------------\\
// Le rotte seguenti richiedono un token JWT valido con ruolo admin\\
//-----------------------------------------------------------------\\
router.use(authenticate, requireAdmin);

/**
 * Rotta per ottenere tutti gli utenti del sistema. Richiede un token JWT valido con ruolo admin.
 * 
 * @route GET /users
 */
router.get('/', getAllUsers);

/**
 * Rotta per ottenere i dettagli di un utente specifico, identificato dal suo ID. Richiede un token JWT valido con ruolo admin.
 * 
 * @route GET /users/:id
 */
router.get('/:id', validate({ params: idParamSchema }), getUserById);

/**
 * Rotta per creare un nuovo utente. Richiede un token JWT valido con ruolo admin.
 * 
 * @route POST /users
 */
router.post('/', validate({ body: createUserSchema }), createUser);

/**
 * Rotta per aggiornare i dettagli di un utente specifico, identificato dal suo ID. Richiede un token JWT valido con ruolo admin.
 * 
 * @route PATCH /users/:id
 */
router.patch('/:id', validate({ params: idParamSchema, body: updateUserSchema }), updateUser);

/**
 * Rotta per eliminare un utente specifico, identificato dal suo ID. Richiede un token JWT valido con ruolo admin.
 * 
 * @route DELETE /users/:id
 */
router.delete('/:id', validate({ params: idParamSchema }), deleteUser);

/**
 * Rotta per ricaricare i token di un utente specifico, identificato dal suo ID. Richiede un token JWT valido con ruolo admin.
 * 
 * @route POST /users/:id/tokens
 */
router.post('/:id/tokens', validate({ params: idParamSchema, body: rechargeTokensSchema }), rechargeTokens);

export default router;

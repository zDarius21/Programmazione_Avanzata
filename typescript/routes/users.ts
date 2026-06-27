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

// Rotta accessibile a qualsiasi utente autenticato per controllare i propri token
router.get('/tokens', authenticate, getMyTokens);

// Le rotte seguenti richiedono un token JWT valido con ruolo admin
router.use(authenticate, requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', validate({ params: idParamSchema }), getUserById);
router.post('/', validate({ body: createUserSchema }), createUser);
router.patch('/:id', validate({ params: idParamSchema, body: updateUserSchema }), updateUser);
router.delete('/:id', validate({ params: idParamSchema }), deleteUser);
router.post('/:id/tokens', validate({ params: idParamSchema, body: rechargeTokensSchema }), rechargeTokens);

export default router;

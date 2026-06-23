import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/roleMiddleware';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyTokens,
} from '../controllers/userController';

const router = Router();

// Rotta accessibile a qualsiasi utente autenticato per controllare i propri token
router.get('/tokens', authenticate, getMyTokens);

// Le rotte seguenti richiedono un token JWT valido con ruolo admin
router.use(authenticate, requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

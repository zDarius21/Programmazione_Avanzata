import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Rotte pubbliche per la registrazione e per il login degli utenti. Non necessitano del token JWT
router.post('/register', register);
router.post('/login', login);

// Rotte autenticate ch permettono all'utente di ottenere e aggiornare le proprie informazioni
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
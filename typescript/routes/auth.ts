import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema, updateMeSchema } from '../validation/schemas';

const router = Router();

// Rotte pubbliche per la registrazione e per il login degli utenti. Non necessitano del token JWT
router.post('/register', validate({ body: registerSchema }), register);
router.post('/login', validate({ body: loginSchema }), login);

// Rotte autenticate ch permettono all'utente di ottenere e aggiornare le proprie informazioni
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate({ body: updateMeSchema }), updateMe);

export default router;
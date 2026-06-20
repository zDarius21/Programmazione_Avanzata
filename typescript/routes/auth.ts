import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Rotte pubbliche per la registrazione e per il login degli utenti. Non necessitano del token JWT
router.post('/register', register);
router.post('/login', login);

export default router;
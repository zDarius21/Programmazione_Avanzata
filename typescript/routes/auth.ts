import { Router } from 'express';
import { register, login, getMe, updateMe } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../middleware/validationMiddleware';
import { registerSchema, loginSchema, updateMeSchema } from '../validation/schemas';

const router = Router();

//------------------------------------------------------------------------------------------------\\
// Rotte pubbliche per la registrazione e per il login degli utenti. Non necessitano del token JWT\\
//------------------------------------------------------------------------------------------------\\

/**
 * Rotta per la registrazione di un nuovo utente. Richiede un oggetto JSON con email, password e ruolo.
 * Valida i dati in ingresso e, in caso di successo, crea un nuovo utente nel database.
 * Restituisce un token JWT per l'autenticazione dell'utente appena registrato.
 * 
 * @route POST /auth/register
 */
router.post('/register', validate({ body: registerSchema }), register);

/**
 * Rotta per il login di un utente esistente. Richiede un oggetto JSON con email e password.
 * Valida i dati in ingresso e, in caso di successo, restituisce un token JWT per l'autenticazione dell'utente.
 * 
 * @route POST /auth/login
 */
router.post('/login', validate({ body: loginSchema }), login);

//---------------------------------------------------------------------------------------------\\
// Rotte autenticate che permettono all'utente di ottenere e aggiornare le proprie informazioni\\
//---------------------------------------------------------------------------------------------\\

/** 
 * Rotta per ottenere le informazioni dell'utente autenticato.
 * Richiede un token JWT valido nell'intestazione Authorization.
 * 
 * @route GET /auth/me
 */
router.get('/me', authenticate, getMe);

/**
 * Rotta per aggiornare le informazioni dell'utente autenticato.
 * Richiede un token JWT valido nell'intestazione Authorization e un oggetto JSON con i dati da aggiornare.
 * 
 * @route PATCH /auth/me
 */
router.patch('/me', authenticate, validate({ body: updateMeSchema }), updateMe);

export default router;
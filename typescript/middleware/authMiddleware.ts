import { Request, Response, NextFunction } from 'express';
import fs from 'node:fs';
import jwt from 'jsonwebtoken';
import ResponseFactory from '../utils/responseFactory';

// La chiave pubblica viene usata per verificare la firma dei token in entrata
const PUBLIC_KEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, 'utf8');

// Struttura del payload decodificato dal token JWT
export interface AuthPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

// Estendiamo il tipo Request di Express per aggiungere il campo user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// Middleware che verifica la presenza e la validità del token Bearer
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ResponseFactory.error(res, 'Token mancante', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    // Se la verifica va a buon fine, salviamo il payload in req.user per i middleware successivi
    req.user = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }) as AuthPayload;
    next();
  } catch {
    ResponseFactory.error(res, 'Token non valido o scaduto', 401);
  }
};
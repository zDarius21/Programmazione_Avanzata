import { Request, Response, NextFunction } from 'express';
import ResponseFactory from '../utils/responseFactory';

// Middleware che blocca l'accesso se l'utente non ha il ruolo admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    ResponseFactory.error(res, 'Accesso riservato agli admin', 403);
    return;
  }
  next();
};
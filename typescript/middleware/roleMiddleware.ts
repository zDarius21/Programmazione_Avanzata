import { Request, Response, NextFunction } from 'express';
import ResponseFactory, { ErrorEnum } from '../factory/responseFactory';

// Middleware che blocca l'accesso se l'utente non ha il ruolo admin
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    ResponseFactory.sendError(res, ErrorEnum.Forbidden);
    return;
  }
  next();
};
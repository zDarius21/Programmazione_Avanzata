import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ResponseFactory from '../utils/responseFactory';

export interface AuthPayload {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ResponseFactory.error(res, 'Token mancante', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  const publicKey = process.env.JWT_PUBLIC_KEY!.replaceAll(String.raw`\n`, '\n');

  try {
    req.user = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as AuthPayload;
    next();
  } catch {
    ResponseFactory.error(res, 'Token non valido o scaduto', 401);
  }
};
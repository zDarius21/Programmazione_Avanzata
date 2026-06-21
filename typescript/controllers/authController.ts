import { Request, Response } from 'express';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// La chiave privata letta dal file indicato nel .env
const PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH ?? '', 'utf8');
const JWT_EXPIRY = (process.env.JWT_EXPIRES_IN ?? '1h') as jwt.SignOptions['expiresIn'];

// Registra un nuovo utente, salva la password hashata e restituisce un token JWT
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    ResponseFactory.sendError(res, ErrorEnum.MissingEmailPassword);
    return;
  }

  // Controlliamo che l'email non sia già in uso
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    ResponseFactory.sendError(res, ErrorEnum.EmailAlreadyRegistered);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: role === 'admin' ? 'admin' : 'user' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: JWT_EXPIRY,
  });

  ResponseFactory.sendSuccess(res, SuccessEnum.UserRegistered, { token, role: user.role });
};

// Verifica le credenziali e restituisce un token JWT se corrette
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    ResponseFactory.sendError(res, ErrorEnum.MissingEmailPassword);
    return;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    ResponseFactory.sendError(res, ErrorEnum.InvalidCredentials);
    return;
  }

  // Confrontiamo la password inviata con quella hashata nel database
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ResponseFactory.sendError(res, ErrorEnum.InvalidCredentials);
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: JWT_EXPIRY,
  });

  ResponseFactory.sendSuccess(res, SuccessEnum.UserLoggedIn, { token, role: user.role });
};

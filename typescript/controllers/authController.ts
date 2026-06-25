import { Request, Response } from 'express';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserDAO from '../dao/UserDAO';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// La chiave privata letta dal file indicato nel .env
const PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH ?? '', 'utf8');
const JWT_EXPIRY = (process.env.JWT_EXPIRES_IN ?? '1h') as jwt.SignOptions['expiresIn'];

// Registra un nuovo utente, salva la password hashata e restituisce un token JWT
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

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

  // La registrazione pubblica crea sempre un utente con ruolo "user":
  // il ruolo admin può essere assegnato solo da un admin tramite le rotte /users.
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: 'user' });

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

// Restituisce il profilo dell'utente autenticato 
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await UserDAO.findById(req.user.id);
  if (!user) {
    ResponseFactory.sendError(res, ErrorEnum.UserNotFound);
    return;
  }
  ResponseFactory.sendSuccess(res, SuccessEnum.ProfileFetched, user);
};

// Aggiorna email e password dell'utente autenticato
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (email === undefined && password === undefined) {
    ResponseFactory.sendError(res, ErrorEnum.NothingToUpdate);
    return;
  }

  const user = await UserDAO.findByIdFull(req.user.id);
  if (!user) {
    ResponseFactory.sendError(res, ErrorEnum.UserNotFound);
    return;
  }

  if (email !== undefined) {
    const conflict = await UserDAO.findByEmail(email);
    if (conflict && conflict.id !== user.id) {
      ResponseFactory.sendError(res, ErrorEnum.EmailInUse);
      return;
    }
    user.email = email;
  }

  if (password !== undefined) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();
  ResponseFactory.sendSuccess(res, SuccessEnum.ProfileUpdated, { id: user.id, email: user.email, role: user.role });
};

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import ResponseFactory from '../utils/responseFactory';

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY!.replaceAll(String.raw`\n`, '\n');
const JWT_EXPIRY = '1h';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    ResponseFactory.error(res, 'Email e password obbligatori', 400);
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    ResponseFactory.error(res, 'Email già registrata', 409);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: role === 'admin' ? 'admin' : 'user' });

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: JWT_EXPIRY,
  });

  ResponseFactory.success(res, { token }, 201);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    ResponseFactory.error(res, 'Email e password obbligatori', 400);
    return;
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    ResponseFactory.error(res, 'Credenziali non valide', 401);
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    ResponseFactory.error(res, 'Credenziali non valide', 401);
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: JWT_EXPIRY,
  });

  ResponseFactory.success(res, { token });
};
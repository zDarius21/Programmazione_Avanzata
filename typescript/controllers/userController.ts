import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import ResponseFactory from '../utils/responseFactory';

// Campi sicuri da restituire al client, escludendo, quindi, la password dell'utente
const SAFE_ATTRIBUTES = ['id', 'email', 'role', 'createdAt', 'updatedAt'];

// Implementazione della rotta /users di tipo "GET". Si restituiscono le informazioni sicure di tutti gli utenti 
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await User.findAll({ attributes: SAFE_ATTRIBUTES });
  ResponseFactory.success(res, users);
};

// Implementazione della rotta /users/:id di tipo "GET". Si restituiscono le informazioni sicure di un singolo utente, scegliendolo in base all'ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByPk(req.params.id, { attributes: SAFE_ATTRIBUTES });
  if (!user) {
    ResponseFactory.error(res, 'Utente non trovato', 404);
    return;
  }
  ResponseFactory.success(res, user);
};

// Implementazione della rotta /users di tipo "POST". Si crea un nuovo utente impostando email e password hashata. Il ruolo è impostato di default a "user"
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    ResponseFactory.error(res, 'Email e password sono obbligatori', 400);
    return;
  }

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    ResponseFactory.error(res, 'Email già utilizzata', 409);
    return;
  }

  const passwordHashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: passwordHashed,
    role: 'user',
  });

  ResponseFactory.success(res, { id: user.id, email: user.email, role: user.role }, 201);
};

// Implementazione della rotta /users/:id di tipo "PUT". Si aggiornano email, password dell'utente. Si può modificare il ruolo di un utente soltanto se il ruolo attuale è "user".

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    ResponseFactory.error(res, 'Utente non trovato', 404);
    return;
  }

  const { email, password, role } = req.body;

  if (email !== undefined) {
    const conflict = await User.findOne({ where: { email } });
    if (conflict && conflict.id !== user.id) {
      ResponseFactory.error(res, 'Email già in uso', 409);
      return;
    }
    user.email = email;
  }

  if (password !== undefined) {
    user.password = await bcrypt.hash(password, 10);
  }

  if (role === 'admin' && user.role === 'user') {
    user.role = 'admin';
  }

  await user.save();
  ResponseFactory.success(res, { id: user.id, email: user.email, role: user.role });
};

// Implementazione della rotta /users/:id di tipo "DELETE". Si elimina un utente selezionandolo in base all'ID
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    ResponseFactory.error(res, 'Utente non trovato', 404);
    return;
  }

  await user.destroy();
  ResponseFactory.success(res, { message: `${user.email}: Utente eliminato` });
};

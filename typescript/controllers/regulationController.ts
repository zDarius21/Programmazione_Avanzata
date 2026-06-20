import { Request, Response } from 'express';
import Regulation from '../models/Regulation';
import ResponseFactory from '../utils/responseFactory';

// Restituisce la lista di tutte le normative
export const getAllRegulations = async (req: Request, res: Response): Promise<void> => {
  const regulations = await Regulation.findAll();
  ResponseFactory.success(res, regulations);
};

// Restituisce i dettagli di una singola normativa tramite id
export const getRegulationById = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.error(res, 'Normativa non trovata', 404);
    return;
  }
  ResponseFactory.success(res, regulation);
};

// Crea una nuova normativa — riservato agli admin
export const createRegulation = async (req: Request, res: Response): Promise<void> => {
  const { name, description, version } = req.body;

  if (!name || !description || !version) {
    ResponseFactory.error(res, 'name, description e version sono obbligatori', 400);
    return;
  }

  const existing = await Regulation.findOne({ where: { name } });
  if (existing) {
    ResponseFactory.error(res, 'Normativa già esistente', 409);
    return;
  }

  const regulation = await Regulation.create({ name, description, version });
  ResponseFactory.success(res, regulation, 201);
};

// Aggiorna una normativa esistente — riservato agli admin
export const updateRegulation = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.error(res, 'Normativa non trovata', 404);
    return;
  }

  const { name, description, version } = req.body;
  await regulation.update({ name, description, version });
  ResponseFactory.success(res, regulation);
};

// Elimina una normativa — riservato agli admin
export const deleteRegulation = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.error(res, 'Normativa non trovata', 404);
    return;
  }

  await regulation.destroy();
  ResponseFactory.success(res, { message: `Normativa ${regulation.name} eliminata` });
};
import { Request, Response } from 'express';
import Regulation from '../models/Regulation';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// Restituisce la lista di tutte le normative presenti
export const getAllRegulations = async (req: Request, res: Response): Promise<void> => {
  const regulations = await Regulation.findAll();
  ResponseFactory.sendSuccess(res, SuccessEnum.RegulationsFetched, regulations);
};

// Restituisce i dettagli di una singola normativa ricercandola per id
export const getRegulationById = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.sendError(res, ErrorEnum.RegulationNotFound);
    return;
  }
  ResponseFactory.sendSuccess(res, SuccessEnum.RegulationFetched, regulation);
};

// Crea una nuova normativa, controllando che non sia già presente e che tutti i campi siamo compilati
export const createRegulation = async (req: Request, res: Response): Promise<void> => {
  const { name, description, version } = req.body;

  if (!name || !description || !version) {
    ResponseFactory.sendError(res, ErrorEnum.RegulationFieldsRequired);
    return;
  }

  const existing = await Regulation.findOne({ where: { name } });
  if (existing) {
    ResponseFactory.sendError(res, ErrorEnum.RegulationAlreadyExists);
    return;
  }

  const regulation = await Regulation.create({ name, description, version });
  ResponseFactory.sendSuccess(res, SuccessEnum.RegulationCreated, regulation);
};

// Aggiorna una normativa esistente, controllando che esista la normativa e che i campi siano compilati
export const updateRegulation = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.sendError(res, ErrorEnum.RegulationNotFound);
    return;
  }

  const { name, description, version } = req.body;
  await regulation.update({ name, description, version });
  ResponseFactory.sendSuccess(res, SuccessEnum.RegulationUpdated, regulation);
};

// Elimina una normativa, controllando che esista la normativa e restituendo un messaggio di conferma
export const deleteRegulation = async (req: Request, res: Response): Promise<void> => {
  const regulation = await Regulation.findByPk(req.params.id);
  if (!regulation) {
    ResponseFactory.sendError(res, ErrorEnum.RegulationNotFound);
    return;
  }

  await regulation.destroy();
  ResponseFactory.sendSuccess(res, SuccessEnum.RegulationDeleted, { message: `Normativa ${regulation.name} eliminata` });
};

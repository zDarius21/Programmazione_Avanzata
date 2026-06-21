import { Request, Response } from 'express';
import Document from '../models/Document';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// Restituisce solo i documenti dell'utente autenticato, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  const documents = await Document.findAll({ where: { userId: req.user!.id } });
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentsFetched, documents);
};

// Restituisce un singolo documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.DocumentNotFound);
    return;
  }
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentFetched, document);
};

// Crea un nuovo documento associato all'utente autenticato
export const createDocument = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = req.body;

  if (!title || !description) {
    ResponseFactory.sendError(res, ErrorEnum.TitleDescriptionRequired);
    return;
  }

  const document = await Document.create({ userId: req.user!.id, title, description });
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentCreated, document);
};

// Aggiorna titolo o descrizione di un documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.DocumentNotFound);
    return;
  }

  const { title, description } = req.body;
  await document.update({ title, description });
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentUpdated, document);
};

// Elimina un documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.DocumentNotFound);
    return;
  }

  await document.destroy();
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentDeleted, { message: `Documento "${document.title}" eliminato` });
};

// Avvia l'analisi di conformità su un documento, modificando lo stato del documento in "analyzed" una volta completata l'analisi.
export const analyzeDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.DocumentNotFound);
    return;
  }

  if (document.status === 'analyzed') {
    ResponseFactory.sendError(res, ErrorEnum.DocumentAlreadyAnalyzed);
    return;
  }

  await document.update({ status: 'analyzed' });
  ResponseFactory.sendSuccess(res, SuccessEnum.DocumentAnalyzed, document);
};

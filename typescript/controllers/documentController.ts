import { Request, Response } from 'express';
import Document from '../models/Document';
import ResponseFactory from '../utils/responseFactory';

// Restituisce solo i documenti dell'utente autenticato, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  const documents = await Document.findAll({ where: { userId: req.user!.id } });
  ResponseFactory.success(res, documents);
};

// Restituisce un singolo documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.error(res, 'Documento non trovato', 404);
    return;
  }
  ResponseFactory.success(res, document);
};

// Crea un nuovo documento associato all'utente autenticato
export const createDocument = async (req: Request, res: Response): Promise<void> => {
  const { title, description } = req.body;

  if (!title || !description) {
    ResponseFactory.error(res, 'title e description sono obbligatori', 400);
    return;
  }

  const document = await Document.create({ userId: req.user!.id, title, description });
  ResponseFactory.success(res, document, 201);
};

// Aggiorna titolo o descrizione di un documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.error(res, 'Documento non trovato', 404);
    return;
  }

  const { title, description } = req.body;
  await document.update({ title, description });
  ResponseFactory.success(res, document);
};

// Elimina un documento, controllando che l'id del documento corrisponda all'idUtente dell'utente autenticato
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.error(res, 'Documento non trovato', 404);
    return;
  }

  await document.destroy();
  ResponseFactory.success(res, { message: `Documento "${document.title}" eliminato` });
};

// Avvia l'analisi di conformità su un documento, modificando lo stato del documento in "analyzed" una volta completata l'analisi.
export const analyzeDocument = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({ where: { id: req.params.id, userId: req.user!.id } });
  if (!document) {
    ResponseFactory.error(res, 'Documento non trovato', 404);
    return;
  }

  if (document.status === 'analyzed') {
    ResponseFactory.error(res, 'Il documento è già stato analizzato', 409);
    return;
  }

  await document.update({ status: 'analyzed' });
  ResponseFactory.success(res, document);
};
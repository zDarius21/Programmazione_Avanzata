import { Request, Response } from 'express';
import Document from '../models/Document';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// Restituisce tutti i documenti analizzati dell'utente autenticato
export const getAllAnalyses = async (req: Request, res: Response): Promise<void> => {
  const analyses = await Document.findAll({
    where: { userId: req.user.id, status: 'analyzed' },
  });
  ResponseFactory.sendSuccess(res, SuccessEnum.AnalysesFetched, analyses);
};

// Restituisce i dettagli di una singola analisi
export const getAnalysisById = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({
    where: { id: req.params.id, userId: req.user.id, status: 'analyzed' },
  });

  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.AnalysisNotFound);
    return;
  }

  ResponseFactory.sendSuccess(res, SuccessEnum.AnalysisFetched, document);
};
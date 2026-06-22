import { Request, Response } from 'express';
import Document from '../models/Document';
import MinioStorage from '../singleton/minio';
import ResponseFactory, { ErrorEnum, SuccessEnum } from '../factory/responseFactory';

// Restituisce tutti i documenti analizzati dell'utente autenticato
export const getAllAnalyses = async (req: Request, res: Response): Promise<void> => {
  const analyses = await Document.findAll({
    where: { userId: req.user.id, status: 'analyzed' },
  });
  ResponseFactory.sendSuccess(res, SuccessEnum.AnalysesFetched, analyses);
};

// Restituisce i dettagli di una singola analisi con URL temporaneo per scaricare il report
export const getAnalysisById = async (req: Request, res: Response): Promise<void> => {
  const document = await Document.findOne({
    where: { id: req.params.id, userId: req.user.id, status: 'analyzed' },
  });

  if (!document) {
    ResponseFactory.sendError(res, ErrorEnum.AnalysisNotFound);
    return;
  }

  // Se esiste un report PDF su MinIO, genera un URL temporaneo valido 15 minuti
  let reportUrl: string | null = null;
  if (document.reportPath) {
    reportUrl = await MinioStorage.getInstance().presignedGetObject(
      MinioStorage.REPORTS_BUCKET,
      document.reportPath,
      15 * 60
    );
  }

  ResponseFactory.sendSuccess(res, SuccessEnum.AnalysisFetched, { ...document.toJSON(), reportUrl });
};
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import ResponseFactory, { ErrorEnum } from '../factory/responseFactory';

/**
 * Configurazione del multer per accettare soltanto file PDF per un massimo di 10MB.
 * Non viene salvato su disco, ma tenuto su RAM tramite memoryStorage.
 */
const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      cb(null, true);
    } else {
      cb(new Error('InvalidFileType'));
    }
  },
});

// Middleware per la gestione degli errori del multer
export const uploadPdf = (req: Request, res: Response, next: NextFunction): void => {
  multerInstance.single('file')(req, res, (err) => {
    if (err) {
      ResponseFactory.sendError(res, ErrorEnum.InvalidFileType);
      return;
    }
    next();
  });
};

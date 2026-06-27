import { Response } from 'express';
import { ZodError } from 'zod';
import { getError, ErrorEnum } from './error';
import { getSuccess, SuccessEnum } from './success';

// Pattern Factory per generare le risposte HTTP standard
class ResponseFactory {

  // Invia una risposta di errore
  static sendError(res: Response, type: ErrorEnum): Response {
    const { status, message } = getError(type).getErrorObj();
    return res.status(status).json({ success: false, error: message });
  }

  // Invia una risposta di errore di validazione (Zod), con il dettaglio dei campi non validi
  static sendValidationError(res: Response, error: ZodError): Response {
    const { status, message } = getError(ErrorEnum.ValidationError).getErrorObj();
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.') || '(root)',
      message: issue.message,
    }));
    return res.status(status).json({ success: false, error: message, details });
  }

  // Invia una risposta di successo 
  static sendSuccess(res: Response, type: SuccessEnum, data: unknown): Response {
    const { status } = getSuccess(type).getSuccessObj();
    return res.status(status).json({ success: true, data });
  }
}

export { ErrorEnum, SuccessEnum };
export default ResponseFactory;
